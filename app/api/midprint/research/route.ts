import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import type { Timestamp } from 'firebase-admin/firestore';

import researchScoringConfig from '@/config/midprintResearchScoring.json';
import { auth, db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const STALE_AFTER_MS = 24 * 60 * 60 * 1000; // 24 hours
const MIN_REQUEST_INTERVAL_MS = 60 * 1000; // 1 minute
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

type FirestoreTimestamp = Timestamp | { toDate: () => Date };

type StoredMarket = {
  marketCode?: string;
  currencyCode?: string;
  languageCode?: string;
  locationId?: string;
  [key: string]: unknown;
};

type MarketDocument = {
  marketCode?: string;
  currencyCode?: string;
  avgMonthlySearches?: number | string | null;
  averageCpc?: number | string | null;
  lowTopOfPageBid?: number | string | null;
  highTopOfPageBid?: number | string | null;
  competitionIndex?: number | string | null;
  competitionValue?: number | string | null;
  status?: string;
  [key: string]: unknown;
};

type QueryDocument = {
  keyword?: string;
  matchType?: string;
  device?: string;
  markets?: StoredMarket[];
  summary?: Record<string, unknown> | null;
  lastComputedAt?: FirestoreTimestamp | Date | string | null;
  lastRequestedAt?: FirestoreTimestamp | Date | string | null;
};

type KeywordResearchQueuePayload = {
  userId: string;
  keyword: string;
  matchType?: string;
  device?: string;
  markets: Array<string | StoredMarket>;
};

type ResearchRecord = {
  marketCode: string;
  currencyCode: string | null;
  searchVolume: number | null;
  topOfPageBidLow: number | null;
  topOfPageBidHigh: number | null;
  averageCpc: number | null;
  competitionIndex: number | null;
  normalizedSearchVolume: number | null;
  normalizedAverageCpc: number | null;
  normalizedCompetitionIndex: number | null;
  score: number | null;
  scoreRationale: string[];
};

type Aggregates = {
  minAverageCpc: number | null;
  maxAverageCpc: number | null;
  medianCompetitionIndex: number | null;
  minScore: number | null;
  maxScore: number | null;
  averageScore: number | null;
  totalResults: number;
};

type ScoringWeights = {
  searchVolume: number;
  averageCpc: number;
  competitionIndex: number;
};

type NormalizationRange = { min: number; max: number } | null;

type NormalizationStats = {
  searchVolume: NormalizationRange;
  averageCpc: NormalizationRange;
  competitionIndex: NormalizationRange;
};

type ScoringThresholds = typeof researchScoringConfig.scoring.thresholds;

type AppliedScoringMetadata = {
  weights: ScoringWeights;
  normalization: NormalizationStats;
  thresholds: ScoringThresholds;
  configVersion: string | number | null;
  model: string;
  minimumScore: number | null;
  rationaleLabels: Record<string, string> | undefined;
};

type Pagination = {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
  nextOffset: number | null;
};

function parseNumericParam(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isFirestoreTimestamp(value: unknown): value is FirestoreTimestamp {
  return Boolean(value) && typeof value === 'object' && 'toDate' in (value as Record<string, unknown>);
}

function coerceToDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (isFirestoreTimestamp(value)) {
    try {
      return value.toDate();
    } catch {
      return null;
    }
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function coerceNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

const HARD_CODED_DEFAULT_WEIGHTS: ScoringWeights = {
  searchVolume: 0.5,
  averageCpc: 0.3,
  competitionIndex: 0.2,
};

function normalizeWeightMap(weights: ScoringWeights): ScoringWeights {
  const sanitized: ScoringWeights = {
    searchVolume: Number.isFinite(weights.searchVolume) && weights.searchVolume > 0 ? weights.searchVolume : 0,
    averageCpc: Number.isFinite(weights.averageCpc) && weights.averageCpc > 0 ? weights.averageCpc : 0,
    competitionIndex: Number.isFinite(weights.competitionIndex) && weights.competitionIndex > 0 ? weights.competitionIndex : 0,
  };

  const total = sanitized.searchVolume + sanitized.averageCpc + sanitized.competitionIndex;

  if (total <= 0) {
    return { ...HARD_CODED_DEFAULT_WEIGHTS };
  }

  return {
    searchVolume: sanitized.searchVolume / total,
    averageCpc: sanitized.averageCpc / total,
    competitionIndex: sanitized.competitionIndex / total,
  };
}

function getConfiguredDefaultWeights(): ScoringWeights {
  const configured = (researchScoringConfig?.scoring?.defaultWeights ?? {}) as Partial<ScoringWeights>;

  const weights: ScoringWeights = {
    searchVolume: coerceNumber(configured.searchVolume) ?? HARD_CODED_DEFAULT_WEIGHTS.searchVolume,
    averageCpc: coerceNumber(configured.averageCpc) ?? HARD_CODED_DEFAULT_WEIGHTS.averageCpc,
    competitionIndex: coerceNumber(configured.competitionIndex) ?? HARD_CODED_DEFAULT_WEIGHTS.competitionIndex,
  };

  return normalizeWeightMap(weights);
}

const DEFAULT_WEIGHTS = getConfiguredDefaultWeights();
const DEFAULT_SCORING_MODEL =
  typeof researchScoringConfig?.scoring?.model === 'string'
    ? (researchScoringConfig.scoring.model as string)
    : 'weighted_normalized';
const SCORING_THRESHOLDS: ScoringThresholds =
  (researchScoringConfig?.scoring?.thresholds as ScoringThresholds) || ({} as ScoringThresholds);
const DEFAULT_MIN_SCORE = coerceNumber(researchScoringConfig?.scoring?.defaultMinimumScore) ?? null;
const SCORING_CONFIG_VERSION = researchScoringConfig?.version ?? null;

function median(values: number[]): number | null {
  if (!values.length) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const midpoint = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[midpoint - 1] + sorted[midpoint]) / 2;
  }

  return sorted[midpoint];
}

function readWeightOverride(searchParams: URLSearchParams, keys: string[]): number | null {
  for (const key of keys) {
    const value = parseNumericParam(searchParams.get(key));
    if (value !== null) {
      return value;
    }
  }

  return null;
}

function resolveWeights(searchParams: URLSearchParams): ScoringWeights {
  const overrides = {
    searchVolume: readWeightOverride(searchParams, ['weightVolume', 'volumeWeight', 'weights[volume]', 'weights[searchVolume]']),
    averageCpc: readWeightOverride(searchParams, ['weightCpc', 'cpcWeight', 'weights[cpc]', 'weights[averageCpc]']),
    competitionIndex: readWeightOverride(searchParams, ['weightCompetition', 'competitionWeight', 'weights[competition]', 'weights[competitionIndex]']),
  };

  const weights: ScoringWeights = {
    searchVolume: overrides.searchVolume ?? DEFAULT_WEIGHTS.searchVolume,
    averageCpc: overrides.averageCpc ?? DEFAULT_WEIGHTS.averageCpc,
    competitionIndex: overrides.competitionIndex ?? DEFAULT_WEIGHTS.competitionIndex,
  };

  return normalizeWeightMap(weights);
}

function computeNormalizationStats(records: ResearchRecord[]): NormalizationStats {
  const collect = (selector: (record: ResearchRecord) => number | null): NormalizationRange => {
    const values = records
      .map(selector)
      .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

    if (!values.length) {
      return null;
    }

    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  return {
    searchVolume: collect((record) => record.searchVolume),
    averageCpc: collect((record) => record.averageCpc),
    competitionIndex: collect((record) => record.competitionIndex),
  };
}

function normalizeValue(value: number | null, range: NormalizationRange, invert = false): number | null {
  if (value === null || value === undefined || range === null) {
    return null;
  }

  const { min, max } = range;

  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
    return null;
  }

  if (max === min) {
    return 1;
  }

  const normalized = Math.min(Math.max((value - min) / (max - min), 0), 1);
  return invert ? 1 - normalized : normalized;
}

function computeCompositeScore(record: ResearchRecord, weights: ScoringWeights): number | null {
  let totalWeight = 0;
  let sum = 0;

  if (record.normalizedSearchVolume !== null) {
    totalWeight += weights.searchVolume;
    sum += record.normalizedSearchVolume * weights.searchVolume;
  }

  if (record.normalizedAverageCpc !== null) {
    totalWeight += weights.averageCpc;
    sum += record.normalizedAverageCpc * weights.averageCpc;
  }

  if (record.normalizedCompetitionIndex !== null) {
    totalWeight += weights.competitionIndex;
    sum += record.normalizedCompetitionIndex * weights.competitionIndex;
  }

  if (totalWeight <= 0) {
    return null;
  }

  const score = sum / totalWeight;
  return Math.round(score * 1000) / 1000;
}

function buildScoreRationale(record: ResearchRecord, thresholds: ScoringThresholds): string[] {
  const rationale = new Set<string>();

  const highVolume = coerceNumber(thresholds?.highVolumeNormalized);
  const mediumVolume = coerceNumber(thresholds?.mediumVolumeNormalized);
  const lowVolume = coerceNumber(thresholds?.lowVolumeNormalized);

  if (record.normalizedSearchVolume !== null) {
    if (highVolume !== null && record.normalizedSearchVolume >= highVolume) {
      rationale.add('high_volume');
    } else if (
      mediumVolume !== null &&
      highVolume !== null &&
      record.normalizedSearchVolume >= mediumVolume &&
      record.normalizedSearchVolume < highVolume
    ) {
      rationale.add('medium_volume');
    } else if (lowVolume !== null && record.normalizedSearchVolume <= lowVolume) {
      rationale.add('low_volume');
    }
  }

  const lowCpc = coerceNumber(thresholds?.lowCpcNormalized);
  const highCpc = coerceNumber(thresholds?.highCpcNormalized);

  if (record.normalizedAverageCpc !== null) {
    if (lowCpc !== null && record.normalizedAverageCpc >= lowCpc) {
      rationale.add('low_cpc');
    }

    if (highCpc !== null && record.normalizedAverageCpc <= highCpc) {
      rationale.add('high_cpc');
    }
  }

  const lowCompetition = coerceNumber(thresholds?.lowCompetitionNormalized);
  const highCompetition = coerceNumber(thresholds?.highCompetitionNormalized);

  if (record.normalizedCompetitionIndex !== null) {
    if (lowCompetition !== null && record.normalizedCompetitionIndex >= lowCompetition) {
      rationale.add('low_competition');
    }

    if (highCompetition !== null && record.normalizedCompetitionIndex <= highCompetition) {
      rationale.add('high_competition');
    }
  }

  return Array.from(rationale);
}

function applyNormalizationAndScoring(
  records: ResearchRecord[],
  weights: ScoringWeights,
): { records: ResearchRecord[]; normalization: NormalizationStats } {
  const normalization = computeNormalizationStats(records);

  const scoredRecords = records.map((record) => {
    const normalizedSearchVolume = normalizeValue(record.searchVolume, normalization.searchVolume);
    const normalizedAverageCpc = normalizeValue(record.averageCpc, normalization.averageCpc, true);
    const normalizedCompetitionIndex = normalizeValue(record.competitionIndex, normalization.competitionIndex, true);

    const enriched: ResearchRecord = {
      ...record,
      normalizedSearchVolume,
      normalizedAverageCpc,
      normalizedCompetitionIndex,
    };

    const score = computeCompositeScore(enriched, weights);
    const scoreRationale = buildScoreRationale({ ...enriched, score }, SCORING_THRESHOLDS);

    return {
      ...enriched,
      score,
      scoreRationale,
    };
  });

  return { records: scoredRecords, normalization };
}

function computeQueryHash(keyword: string, matchType: string, device: string, markets: string[]): string {
  const normalizedKeyword = keyword.trim().toLowerCase();
  const normalizedMatchType = matchType.toUpperCase();
  const normalizedDevice = device.toUpperCase();
  const uniqueMarkets = Array.from(new Set(markets.map((code) => code.trim()))).filter(Boolean).sort();

  return createHash('sha256')
    .update([normalizedKeyword, normalizedMatchType, normalizedDevice, ...uniqueMarkets].join('|'))
    .digest('hex');
}

function parseMarkets(searchParams: URLSearchParams): string[] {
  const collected: string[] = [];
  const repeated = searchParams.getAll('market');

  if (repeated.length) {
    for (const entry of repeated) {
      if (entry && entry.trim()) {
        collected.push(entry.trim());
      }
    }
  }

  if (!collected.length) {
    const marketsParam = searchParams.get('markets') || searchParams.get('marketCodes');

    if (marketsParam) {
      const trimmed = marketsParam.trim();
      if (trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            for (const entry of parsed) {
              if (typeof entry === 'string' && entry.trim()) {
                collected.push(entry.trim());
              } else if (entry && typeof entry === 'object' && 'marketCode' in entry && typeof entry.marketCode === 'string') {
                collected.push(entry.marketCode.trim());
              }
            }
          }
        } catch {
          // Ignore JSON parsing failures and fall back to CSV parsing below.
        }
      }

      if (!collected.length) {
        collected.push(...trimmed.split(',').map((value) => value.trim()).filter(Boolean));
      }
    }
  }

  return collected;
}

function resolveSort(searchParams: URLSearchParams): { field: keyof ResearchRecord; direction: 'asc' | 'desc' } {
  const sortParam = (searchParams.get('sort') || searchParams.get('sortBy') || '').toLowerCase();
  const explicitOrder = (searchParams.get('sortOrder') || searchParams.get('direction') || '').toLowerCase();

  if (!sortParam || sortParam === 'score' || sortParam === 'composite' || sortParam === 'ranking' || sortParam === 'rank') {
    const direction = explicitOrder === 'asc' || explicitOrder === 'ascending' ? 'asc' : 'desc';
    return { field: 'score', direction };
  }

  if (sortParam === 'lowestcpc') {
    return { field: 'averageCpc', direction: 'asc' };
  }

  if (sortParam === 'highestcpc') {
    return { field: 'averageCpc', direction: 'desc' };
  }

  if (sortParam === 'highestvolume') {
    return { field: 'searchVolume', direction: 'desc' };
  }

  if (sortParam === 'lowestvolume') {
    return { field: 'searchVolume', direction: 'asc' };
  }

  const fieldMap: Record<string, keyof ResearchRecord> = {
    searchvolume: 'searchVolume',
    averagecpc: 'averageCpc',
    competitionindex: 'competitionIndex',
    topofpagebidlow: 'topOfPageBidLow',
    topofpagebidhigh: 'topOfPageBidHigh',
    marketcode: 'marketCode',
    normalizedsearchvolume: 'normalizedSearchVolume',
    normalizedaveragecpc: 'normalizedAverageCpc',
    normalizedcompetition: 'normalizedCompetitionIndex',
    score: 'score',
  };

  const resolvedField = fieldMap[sortParam] || 'score';
  const resolvedDirection = explicitOrder === 'asc' || explicitOrder === 'ascending' ? 'asc' : 'desc';

  return { field: resolvedField, direction: resolvedDirection };
}

function sortRecords(records: ResearchRecord[], sortField: keyof ResearchRecord, direction: 'asc' | 'desc'): ResearchRecord[] {
  const multiplier = direction === 'asc' ? 1 : -1;
  const sortableFields: Array<keyof ResearchRecord> = [
    'score',
    'searchVolume',
    'averageCpc',
    'competitionIndex',
    'topOfPageBidLow',
    'topOfPageBidHigh',
    'normalizedSearchVolume',
    'normalizedAverageCpc',
    'normalizedCompetitionIndex',
  ];

  return [...records].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (!sortableFields.includes(sortField)) {
      return a.marketCode.localeCompare(b.marketCode) * multiplier;
    }

    if (aValue === null && bValue === null) {
      return 0;
    }

    if (aValue === null) {
      return 1;
    }

    if (bValue === null) {
      return -1;
    }

    const numericA = Number(aValue);
    const numericB = Number(bValue);

    return (numericA - numericB) * multiplier;
  });
}

function applyFilters(records: ResearchRecord[], filters: {
  minSearchVolume: number | null;
  maxSearchVolume: number | null;
  minAverageCpc: number | null;
  maxAverageCpc: number | null;
  minCompetitionIndex: number | null;
  maxCompetitionIndex: number | null;
  minScore: number | null;
}): ResearchRecord[] {
  return records.filter((record) => {
    if (filters.minSearchVolume !== null && (record.searchVolume === null || record.searchVolume < filters.minSearchVolume)) {
      return false;
    }

    if (filters.maxSearchVolume !== null && (record.searchVolume === null || record.searchVolume > filters.maxSearchVolume)) {
      return false;
    }

    if (filters.minAverageCpc !== null && (record.averageCpc === null || record.averageCpc < filters.minAverageCpc)) {
      return false;
    }

    if (filters.maxAverageCpc !== null && (record.averageCpc === null || record.averageCpc > filters.maxAverageCpc)) {
      return false;
    }

    if (
      filters.minCompetitionIndex !== null &&
      (record.competitionIndex === null || record.competitionIndex < filters.minCompetitionIndex)
    ) {
      return false;
    }

    if (
      filters.maxCompetitionIndex !== null &&
      (record.competitionIndex === null || record.competitionIndex > filters.maxCompetitionIndex)
    ) {
      return false;
    }

    if (filters.minScore !== null && (record.score === null || record.score < filters.minScore)) {
      return false;
    }

    return true;
  });
}

function computeAggregates(records: ResearchRecord[]): Aggregates {
  const cpcValues = records
    .map((record) => record.averageCpc)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

  const competitionValues = records
    .map((record) => record.competitionIndex)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

  const scoreValues = records
    .map((record) => record.score)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

  return {
    minAverageCpc: cpcValues.length ? Math.min(...cpcValues) : null,
    maxAverageCpc: cpcValues.length ? Math.max(...cpcValues) : null,
    medianCompetitionIndex: median(competitionValues) ?? null,
    minScore: scoreValues.length ? Math.min(...scoreValues) : null,
    maxScore: scoreValues.length ? Math.max(...scoreValues) : null,
    averageScore: scoreValues.length
      ? scoreValues.reduce((total, value) => total + value, 0) / scoreValues.length
      : null,
    totalResults: records.length,
  };
}

function parsePagination(searchParams: URLSearchParams, total: number): Pagination {
  const limitParam = parseNumericParam(searchParams.get('limit'));
  const offsetParam = parseNumericParam(searchParams.get('offset') || searchParams.get('cursor'));

  const limit = Math.min(Math.max(limitParam ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
  const offset = Math.max(offsetParam ?? 0, 0);
  const end = Math.min(offset + limit, total);

  return {
    limit,
    offset,
    total,
    hasMore: end < total,
    nextOffset: end < total ? end : null,
  };
}

function formatScoringWeights(value: unknown): ScoringWeights | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const weights = value as Record<string, unknown>;
  const searchVolume = coerceNumber(weights.searchVolume);
  const averageCpc = coerceNumber(weights.averageCpc);
  const competitionIndex = coerceNumber(weights.competitionIndex);

  if (searchVolume === null && averageCpc === null && competitionIndex === null) {
    return null;
  }

  return normalizeWeightMap({
    searchVolume: searchVolume ?? 0,
    averageCpc: averageCpc ?? 0,
    competitionIndex: competitionIndex ?? 0,
  });
}

function formatSummary(summary: Record<string, unknown> | null | undefined) {
  if (!summary || typeof summary !== 'object') {
    return null;
  }

  const computedAt = coerceToDate(summary.computedAt ?? summary['lastComputedAt']);
  const scoringWeights = formatScoringWeights(summary.scoringWeights ?? summary['defaultWeights']);

  return {
    totalMarkets: coerceNumber(summary.totalMarkets),
    successfulMarkets: coerceNumber(summary.successfulMarkets),
    averageMonthlySearches: coerceNumber(summary.averageMonthlySearches),
    averageCompetitionIndex: coerceNumber(summary.averageCompetitionIndex),
    averageCpc: coerceNumber(summary.averageCpc),
    lowestCpc: coerceNumber(summary.lowestCpc),
    highestCpc: coerceNumber(summary.highestCpc),
    computedAt: computedAt ? computedAt.toISOString() : null,
    scoringModel: typeof summary.scoringModel === 'string' ? (summary.scoringModel as string) : null,
    scoringConfigVersion: summary.scoringConfigVersion ?? summary['configVersion'] ?? null,
    scoringWeights,
  };
}

function buildResearchRecord(
  doc: MarketDocument,
  fallback: StoredMarket | undefined,
): ResearchRecord {
  const marketCode = doc.marketCode || fallback?.marketCode;

  return {
    marketCode: marketCode || fallback?.marketCode || 'unknown',
    currencyCode: doc.currencyCode || (fallback?.currencyCode ?? null),
    searchVolume: coerceNumber(doc.avgMonthlySearches),
    topOfPageBidLow: coerceNumber(doc.lowTopOfPageBid),
    topOfPageBidHigh: coerceNumber(doc.highTopOfPageBid),
    averageCpc: coerceNumber(doc.averageCpc),
    competitionIndex: coerceNumber(doc.competitionIndex ?? doc.competitionValue),
    normalizedSearchVolume: null,
    normalizedAverageCpc: null,
    normalizedCompetitionIndex: null,
    score: null,
    scoreRationale: [],
  };
}

function extractAuthToken(request: NextRequest): string | null {
  const header = request.headers.get('authorization') || request.headers.get('Authorization');

  if (header && header.startsWith('Bearer ')) {
    return header.slice('Bearer '.length).trim();
  }

  const cookieToken = request.cookies.get('auth-token');
  return cookieToken?.value ?? null;
}

function buildProcessingResponse(params: {
  queryId: string;
  keyword: string | null;
  matchType: string | null;
  device: string | null;
  markets: StoredMarket[] | string[];
  lastRequestedAt: Date | null;
  lastComputedAt: Date | null;
  enqueued: boolean;
}) {
  return NextResponse.json({
    status: 'processing',
    queryId: params.queryId,
    keyword: params.keyword,
    matchType: params.matchType,
    device: params.device,
    markets: params.markets,
    lastRequestedAt: params.lastRequestedAt ? params.lastRequestedAt.toISOString() : null,
    lastComputedAt: params.lastComputedAt ? params.lastComputedAt.toISOString() : null,
    enqueued: params.enqueued,
    nextRecommendedPollMs: 15_000,
  });
}

async function triggerKeywordResearch(payload: KeywordResearchQueuePayload): Promise<void> {
  const region = process.env.GOOGLE_CLOUD_REGION || 'us-central1';
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const endpoint =
    process.env.KEYWORD_RESEARCH_FUNCTION_URL ||
    (projectId ? `https://${region}-${projectId}.cloudfunctions.net/requestKeywordResearch` : null);

  if (!endpoint) {
    throw new Error('Keyword research function endpoint is not configured.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to enqueue keyword research: ${response.status} ${text}`);
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json(
        { error: { code: 'unauthorized', message: 'Authentication is required to access keyword research.' } },
        { status: 401 },
      );
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      console.error('Failed to verify Firebase ID token for research request:', error);
      return NextResponse.json(
        { error: { code: 'unauthorized', message: 'Invalid or expired authentication token.' } },
        { status: 401 },
      );
    }

    const { searchParams } = request.nextUrl;
    const userId = decodedToken.uid;
    const requestedUserId = searchParams.get('userId');

    if (requestedUserId && requestedUserId !== userId) {
      console.error('Attempted access to another user\'s research data', { requestedUserId, userId });
      return NextResponse.json(
        { error: { code: 'forbidden', message: 'You are not authorized to access this keyword research.' } },
        { status: 403 },
      );
    }

    const keywordParam = searchParams.get('keyword');
    const matchTypeParam = (searchParams.get('matchType') || 'BROAD').toUpperCase();
    const deviceParam = (searchParams.get('device') || 'DESKTOP').toUpperCase();
    const marketCodes = parseMarkets(searchParams);
    const explicitQueryId = searchParams.get('queryId') || searchParams.get('hash');

    if (!explicitQueryId && (!keywordParam || !marketCodes.length)) {
      return NextResponse.json(
        {
          error: {
            code: 'invalid_request',
            message: 'Provide either an existing queryId or include keyword and markets to initiate research.',
          },
        },
        { status: 400 },
      );
    }

    const queryId = explicitQueryId || computeQueryHash(keywordParam as string, matchTypeParam, deviceParam, marketCodes);
    const queryRef = db.collection('midprintResearch').doc(userId).collection('queries').doc(queryId);
    const snapshot = await queryRef.get();
    const data = (snapshot.exists ? (snapshot.data() as QueryDocument) : null) || null;

    const lastComputedAt = coerceToDate(data?.lastComputedAt) || coerceToDate(data?.summary?.computedAt);
    const lastRequestedAt = coerceToDate(data?.lastRequestedAt);
    const now = Date.now();

    let needsRefresh = !snapshot.exists || !lastComputedAt || now - lastComputedAt.getTime() > STALE_AFTER_MS;
    let marketsSnapshot = null;

    if (!needsRefresh) {
      marketsSnapshot = await queryRef.collection('markets').get();
      const successCount = marketsSnapshot.docs.filter((doc) => {
        const docData = doc.data() as MarketDocument;
        return (docData.status || 'success') === 'success';
      }).length;

      if (successCount === 0) {
        needsRefresh = true;
      }
    }

    const effectiveKeyword = data?.keyword ?? keywordParam ?? null;
    const effectiveMatchType = (data?.matchType || matchTypeParam || null) as string | null;
    const effectiveDevice = (data?.device || deviceParam || null) as string | null;
    const effectiveMarkets: StoredMarket[] = Array.isArray(data?.markets)
      ? data!.markets!
      : marketCodes.map((marketCode) => ({ marketCode }));

    if (needsRefresh) {
      const marketsForRequest = effectiveMarkets.length ? effectiveMarkets : marketCodes.map((marketCode) => ({ marketCode }));
      const canEnqueue =
        effectiveKeyword && marketsForRequest.length && (!lastRequestedAt || now - lastRequestedAt.getTime() > MIN_REQUEST_INTERVAL_MS);

      let enqueued = false;

      if (canEnqueue) {
        try {
          await triggerKeywordResearch({
            userId,
            keyword: effectiveKeyword,
            matchType: effectiveMatchType || undefined,
            device: effectiveDevice || undefined,
            markets: marketsForRequest,
          });
          enqueued = true;
        } catch (error) {
          console.error('Failed to enqueue keyword research request:', error);
          return NextResponse.json(
            {
              error: {
                code: 'enqueue_failed',
                message: 'Unable to queue keyword research refresh. Please try again later.',
              },
            },
            { status: 500 },
          );
        }
      }

      return buildProcessingResponse({
        queryId,
        keyword: effectiveKeyword,
        matchType: effectiveMatchType,
        device: effectiveDevice,
        markets: marketsForRequest,
        lastRequestedAt,
        lastComputedAt,
        enqueued,
      });
    }

    if (!marketsSnapshot) {
      marketsSnapshot = await queryRef.collection('markets').get();
    }

    const storedMarketsByCode = new Map(
      (Array.isArray(effectiveMarkets) ? effectiveMarkets : [])
        .map((market) =>
          typeof market.marketCode === 'string' && market.marketCode
            ? ([market.marketCode, market] as const)
            : null,
        )
        .filter((entry): entry is readonly [string, StoredMarket] => Boolean(entry)),
    );

    const records = marketsSnapshot.docs
      .map((docSnapshot) => {
        const docData = docSnapshot.data() as MarketDocument;
        const fallbackMarket =
          storedMarketsByCode.get(docData.marketCode || docSnapshot.id) || storedMarketsByCode.get(docSnapshot.id);

        return {
          doc: {
            ...docData,
            marketCode: docData.marketCode || fallbackMarket?.marketCode || docSnapshot.id,
          },
          fallback: fallbackMarket,
        };
      })
      .filter(({ doc }) => (doc.status || 'success') === 'success')
      .map(({ doc, fallback }) => buildResearchRecord(doc, fallback));

    const weights = resolveWeights(searchParams);
    const { records: scoredRecords, normalization } = applyNormalizationAndScoring(records, weights);
    const minScoreParam = parseNumericParam(searchParams.get('minScore'));
    const minimumScore =
      minScoreParam ?? (DEFAULT_MIN_SCORE !== null && DEFAULT_MIN_SCORE > 0 ? DEFAULT_MIN_SCORE : null);

    const filters = {
      minSearchVolume: parseNumericParam(searchParams.get('minSearchVolume')),
      maxSearchVolume: parseNumericParam(searchParams.get('maxSearchVolume')),
      minAverageCpc: parseNumericParam(searchParams.get('minAverageCpc') || searchParams.get('minCpc')),
      maxAverageCpc: parseNumericParam(searchParams.get('maxAverageCpc') || searchParams.get('maxCpc')),
      minCompetitionIndex: parseNumericParam(searchParams.get('minCompetition') || searchParams.get('minCompetitionIndex')),
      maxCompetitionIndex: parseNumericParam(searchParams.get('maxCompetition') || searchParams.get('maxCompetitionIndex')),
      minScore: minimumScore,
    };

    const filteredRecords = applyFilters(scoredRecords, filters);
    const { field: sortField, direction } = resolveSort(searchParams);
    const sortedRecords = sortRecords(filteredRecords, sortField, direction);
    const pagination = parsePagination(searchParams, sortedRecords.length);
    const paginatedRecords = sortedRecords.slice(pagination.offset, pagination.offset + pagination.limit);
    const aggregates = computeAggregates(filteredRecords);

    const scoringMetadata: AppliedScoringMetadata = {
      weights,
      normalization,
      thresholds: { ...(SCORING_THRESHOLDS as Record<string, number>) } as ScoringThresholds,
      configVersion: SCORING_CONFIG_VERSION,
      model: DEFAULT_SCORING_MODEL,
      minimumScore,
      rationaleLabels: (researchScoringConfig?.scoring?.rationaleLabels as Record<string, string> | undefined) || undefined,
    };

    return NextResponse.json({
      status: 'ready',
      queryId,
      keyword: effectiveKeyword,
      matchType: effectiveMatchType,
      device: effectiveDevice,
      lastComputedAt: lastComputedAt ? lastComputedAt.toISOString() : null,
      data: paginatedRecords,
      pagination,
      aggregates,
      summary: formatSummary(data?.summary),
      scoring: scoringMetadata,
    });
  } catch (error) {
    console.error('Unexpected error handling keyword research request:', error);
    return NextResponse.json(
      { error: { code: 'internal_error', message: 'An unexpected error occurred while fetching keyword research.' } },
      { status: 500 },
    );
  }
}

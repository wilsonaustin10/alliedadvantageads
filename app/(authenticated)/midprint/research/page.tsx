'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import {
  ResearchPagination,
  ResearchRecord,
  ResearchSortField,
  ResearchTable,
} from '@/components/midprint/ResearchTable';
import { useMidprintAuthGuard } from '../useMidprintAuthGuard';

const POPULAR_MARKETS: Array<{ code: string; label: string }> = [
  { code: 'US-EN', label: 'United States (English)' },
  { code: 'US-ES', label: 'United States (Spanish)' },
  { code: 'CA-EN', label: 'Canada (English)' },
  { code: 'GB-EN', label: 'United Kingdom (English)' },
  { code: 'AU-EN', label: 'Australia (English)' },
  { code: 'NZ-EN', label: 'New Zealand (English)' },
  { code: 'IE-EN', label: 'Ireland (English)' },
  { code: 'IN-EN', label: 'India (English)' },
];

const MATCH_TYPES = [
  { value: 'BROAD', label: 'Broad' },
  { value: 'PHRASE', label: 'Phrase' },
  { value: 'EXACT', label: 'Exact' },
];

const DEVICE_TYPES = [
  { value: 'DESKTOP', label: 'Desktop' },
  { value: 'MOBILE', label: 'Mobile' },
  { value: 'TABLET', label: 'Tablet' },
];

type Aggregates = {
  minAverageCpc: number | null;
  maxAverageCpc: number | null;
  medianCompetitionIndex: number | null;
  minScore: number | null;
  maxScore: number | null;
  averageScore: number | null;
  totalResults: number;
};

type AppliedFilters = {
  minSearchVolume: number | null;
  maxAverageCpc: number | null;
  minCompetitionIndex: number | null;
  minScore: number | null;
};

type StatusDetails = {
  state?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  lastUpdatedAt?: string | null;
  error?: string | null;
};

type ProcessingInfo = StatusDetails & {
  enqueued?: boolean;
  lastRequestedAt?: string | null;
  lastComputedAt?: string | null;
};

type ResearchStatus = 'idle' | 'loading' | 'processing' | 'ready' | 'error';

type QueryState = {
  keyword: string;
  matchType: string;
  device: string;
  markets: string[];
};

export default function MidprintResearchPage() {
  const {
    loading: authLoading,
    user,
    hasGoogleAdsAccess,
    showAccountSelector,
    availableAccounts,
    handleConnectGoogleAds,
    handleAccountSelection,
  } = useMidprintAuthGuard();

  const [keyword, setKeyword] = useState('');
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['US-EN']);
  const [matchType, setMatchType] = useState<string>('BROAD');
  const [device, setDevice] = useState<string>('DESKTOP');
  const [filters, setFilters] = useState({
    minSearchVolume: '',
    maxAverageCpc: '',
    minCompetitionIndex: '',
    minScore: '',
  });
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    minSearchVolume: null,
    maxAverageCpc: null,
    minCompetitionIndex: null,
    minScore: null,
  });

  const [status, setStatus] = useState<ResearchStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ResearchRecord[]>([]);
  const [pagination, setPagination] = useState<ResearchPagination | null>(null);
  const [aggregates, setAggregates] = useState<Aggregates | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [processingInfo, setProcessingInfo] = useState<ProcessingInfo | null>(null);
  const [cacheExpiresAt, setCacheExpiresAt] = useState<Date | null>(null);

  const [sortField, setSortField] = useState<ResearchSortField>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [pageSize, setPageSize] = useState(25);
  const [activeQueryId, setActiveQueryId] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<QueryState | null>(null);

  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const clearPendingPoll = useCallback(() => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearPendingPoll();
    };
  }, [clearPendingPoll]);

  const applyFiltersFromInput = useCallback((): AppliedFilters => {
    const parseNumeric = (value: string) => {
      if (value.trim() === '') {
        return null;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    return {
      minSearchVolume: parseNumeric(filters.minSearchVolume),
      maxAverageCpc: parseNumeric(filters.maxAverageCpc),
      minCompetitionIndex: parseNumeric(filters.minCompetitionIndex),
      minScore: parseNumeric(filters.minScore),
    };
  }, [filters]);

  const fetchResearch = useCallback(
    async (options?: {
      query?: QueryState | null;
      filters?: AppliedFilters;
      queryId?: string | null;
      offset?: number;
      limit?: number;
      newQuery?: boolean;
      append?: boolean;
      pageToken?: string | null;
      sort?: { field: ResearchSortField; direction: 'asc' | 'desc' };
    }) => {
      if (!user) {
        return;
      }

      const effectiveQuery = options?.query ?? lastQuery;
      if (!effectiveQuery || !effectiveQuery.keyword || !effectiveQuery.markets.length) {
        setError('Enter a keyword and select at least one market to run research.');
        return;
      }

      const effectiveFilters = options?.filters ?? appliedFilters;
      const effectiveLimit = options?.limit ?? pageSize;
      const append = options?.append ?? false;
      const defaultOffset = append ? results.length : 0;
      const effectiveOffset = options?.offset ?? defaultOffset;
      const effectiveSortField = options?.sort?.field ?? sortField;
      const effectiveSortDirection = options?.sort?.direction ?? sortDirection;
      const effectiveQueryId = options?.queryId ?? (options?.newQuery ? null : activeQueryId);

      if (append) {
        setIsFetchingMore(true);
      } else {
        setStatus('loading');
      }
      setError(null);
      clearPendingPoll();

      try {
        const idToken = await user.getIdToken();
        const params = new URLSearchParams();
        params.set('userId', user.uid);
        params.set('keyword', effectiveQuery.keyword);
        params.set('matchType', effectiveQuery.matchType);
        params.set('device', effectiveQuery.device);
        params.set('markets', effectiveQuery.markets.join(','));
        params.set('limit', String(effectiveLimit));
        if (options?.pageToken) {
          params.set('pageToken', options.pageToken);
        }
        params.set('offset', String(effectiveOffset));
        params.set('sort', effectiveSortField);
        params.set('sortOrder', effectiveSortDirection);

        if (effectiveFilters.minSearchVolume !== null) {
          params.set('minSearchVolume', String(effectiveFilters.minSearchVolume));
        }
        if (effectiveFilters.maxAverageCpc !== null) {
          params.set('maxAverageCpc', String(effectiveFilters.maxAverageCpc));
        }
        if (effectiveFilters.minCompetitionIndex !== null) {
          params.set('minCompetitionIndex', String(effectiveFilters.minCompetitionIndex));
        }
        if (effectiveFilters.minScore !== null) {
          params.set('minScore', String(effectiveFilters.minScore));
        }
        if (effectiveQueryId) {
          params.set('queryId', effectiveQueryId);
        }

        const response = await fetch(`/api/midprint/research?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error?.message || 'Unable to load research results.');
        }

        const payload = await response.json();

        if (payload.status === 'processing') {
          setStatus('processing');
          setActiveQueryId(payload.queryId || null);
          setProcessingInfo({
            enqueued: payload.enqueued,
            lastRequestedAt: payload.lastRequestedAt,
            lastComputedAt: payload.lastComputedAt,
            state: payload.statusDetails?.state,
            startedAt: payload.statusDetails?.startedAt,
            completedAt: payload.statusDetails?.completedAt,
            lastUpdatedAt: payload.statusDetails?.lastUpdatedAt,
            error: payload.statusDetails?.error,
          });
          setCacheExpiresAt(payload.cacheExpiresAt ? new Date(payload.cacheExpiresAt) : null);
          clearPendingPoll();
          const delay = typeof payload.nextRecommendedPollMs === 'number' ? payload.nextRecommendedPollMs : 15000;
          pollTimeoutRef.current = setTimeout(() => {
            fetchResearch({
              query: effectiveQuery,
              filters: effectiveFilters,
              queryId: payload.queryId || null,
              offset: 0,
              limit: effectiveLimit,
              sort: { field: effectiveSortField, direction: effectiveSortDirection },
            });
          }, delay);
          setIsFetchingMore(false);
          return;
        }

        if (payload.status === 'ready') {
          setStatus('ready');
          setResults((previous) =>
            append && Array.isArray(payload.data)
              ? [...previous, ...payload.data]
              : Array.isArray(payload.data)
              ? payload.data
              : [],
          );
          setPagination((prev) => {
            if (!payload.pagination) {
              return null;
            }
            if (!append || !prev) {
              return payload.pagination;
            }
            return {
              ...payload.pagination,
              offset: 0,
            };
          });
          setAggregates(payload.aggregates || null);
          setActiveQueryId(payload.queryId || null);
          setProcessingInfo(null);
          setLastRefreshedAt(payload.lastComputedAt ? new Date(payload.lastComputedAt) : null);
          setCacheExpiresAt(payload.cacheExpiresAt ? new Date(payload.cacheExpiresAt) : null);
          return;
        }

        throw new Error('Unexpected response from research service.');
      } catch (err) {
        console.error('Failed to fetch research:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to fetch keyword research.');
      } finally {
        if (append) {
          setIsFetchingMore(false);
        }
      }
    },
    [
      activeQueryId,
      appliedFilters,
      clearPendingPoll,
      lastQuery,
      pageSize,
      results,
      sortDirection,
      sortField,
      user,
    ],
  );

  const handleRunResearch = useCallback(() => {
    if (!user) {
      return;
    }
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      setError('Enter a keyword to research.');
      return;
    }
    if (!selectedMarkets.length) {
      setError('Select at least one market to analyze.');
      return;
    }

    const numericFilters = applyFiltersFromInput();
    setAppliedFilters(numericFilters);

    const query: QueryState = {
      keyword: trimmedKeyword,
      matchType,
      device,
      markets: selectedMarkets,
    };

    setLastQuery(query);
    setActiveQueryId(null);
    setStatus('loading');
    setResults([]);
    setPagination(null);
    setProcessingInfo(null);
    setCacheExpiresAt(null);
    setIsFetchingMore(false);
    fetchResearch({
      query,
      filters: numericFilters,
      limit: pageSize,
      newQuery: true,
      sort: { field: sortField, direction: sortDirection },
    });
  }, [
    applyFiltersFromInput,
    device,
    fetchResearch,
    keyword,
    matchType,
    pageSize,
    selectedMarkets,
    sortDirection,
    sortField,
    user,
  ]);

  const handleMarketToggle = useCallback((code: string) => {
    setSelectedMarkets((previous) =>
      previous.includes(code) ? previous.filter((value) => value !== code) : [...previous, code],
    );
  }, []);

  const handleSort = useCallback(
    (field: ResearchSortField) => {
      if (!lastQuery) {
        setSortField(field);
        return;
      }
      const nextDirection = sortField === field ? (sortDirection === 'desc' ? 'asc' : 'desc') : 'desc';
      setSortField(field);
      setSortDirection(nextDirection);
      fetchResearch({
        query: lastQuery,
        filters: appliedFilters,
        queryId: activeQueryId,
        limit: pageSize,
        sort: { field, direction: nextDirection },
      });
    },
    [activeQueryId, appliedFilters, fetchResearch, lastQuery, pageSize, sortDirection, sortField],
  );

  const handlePageChange = useCallback(() => {
    // Pagination is driven by infinite scroll; manual page changes are no-ops.
  }, []);

  const handlePageSizeChange = useCallback(
    (nextSize: number) => {
      setPageSize(nextSize);
      if (!lastQuery) {
        return;
      }
      setIsFetchingMore(false);
      fetchResearch({
        query: lastQuery,
        filters: appliedFilters,
        queryId: activeQueryId,
        limit: nextSize,
        sort: { field: sortField, direction: sortDirection },
      });
    },
    [activeQueryId, appliedFilters, fetchResearch, lastQuery, sortDirection, sortField],
  );

  const loadMore = useCallback(() => {
    if (
      !lastQuery ||
      !pagination?.hasMore ||
      !pagination.nextPageToken ||
      isFetchingMore
    ) {
      return;
    }

    fetchResearch({
      query: lastQuery,
      filters: appliedFilters,
      queryId: activeQueryId,
      offset: results.length,
      limit: pageSize,
      append: true,
      pageToken: pagination.nextPageToken,
      sort: { field: sortField, direction: sortDirection },
    });
  }, [
    activeQueryId,
    appliedFilters,
    fetchResearch,
    isFetchingMore,
    lastQuery,
    pagination?.hasMore,
    pagination?.nextPageToken,
    pageSize,
    results.length,
    sortDirection,
    sortField,
  ]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    if (status !== 'ready' || !pagination?.hasMore || !pagination.nextPageToken || isFetchingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          observer.unobserve(entry.target);
          loadMore();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [isFetchingMore, loadMore, pagination?.hasMore, pagination?.nextPageToken, status]);

  const disableRunButton =
    !keyword.trim() || !selectedMarkets.length || status === 'loading' || status === 'processing';

  const formattedLastRefreshed = useMemo(() => {
    if (!lastRefreshedAt) {
      return null;
    }
    return lastRefreshedAt.toLocaleString();
  }, [lastRefreshedAt]);

  const formattedCacheExpiry = useMemo(() => {
    if (!cacheExpiresAt) {
      return null;
    }
    return cacheExpiresAt.toLocaleString();
  }, [cacheExpiresAt]);

  const renderStatusMessage = () => {
    if (status === 'processing' && processingInfo) {
      return (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-medium">We're crunching the numbers for "{lastQuery?.keyword}".</p>
          <p className="mt-1">Your request has been queued and will refresh automatically.</p>
          {processingInfo.lastRequestedAt ? (
            <p className="mt-2 text-xs text-amber-700">
              Last requested: {new Date(processingInfo.lastRequestedAt).toLocaleString()}
            </p>
          ) : null}
          {processingInfo.lastComputedAt ? (
            <p className="mt-1 text-xs text-amber-700">
              Last completed: {new Date(processingInfo.lastComputedAt).toLocaleString()}
            </p>
          ) : null}
          {processingInfo.state ? (
            <p className="mt-1 text-xs text-amber-700">Current job state: {processingInfo.state}</p>
          ) : null}
          {processingInfo.startedAt ? (
            <p className="mt-1 text-xs text-amber-700">
              Started at: {new Date(processingInfo.startedAt).toLocaleString()}
            </p>
          ) : null}
          {processingInfo.error ? (
            <p className="mt-1 text-xs text-red-700">Last error: {processingInfo.error}</p>
          ) : null}
          {processingInfo.enqueued ? (
            <p className="mt-1 text-xs text-amber-700">Keyword research job successfully queued.</p>
          ) : null}
        </div>
      );
    }

    if (status === 'error' && error) {
      return (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      );
    }

    if (status === 'idle') {
      return (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          Enter a keyword, select one or more markets, and choose any filters to evaluate MidPrint opportunities.
        </div>
      );
    }

    return null;
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (showAccountSelector && user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Select Your Google Ads Account</CardTitle>
            <CardDescription>
              Choose which Google Ads account to connect to Allied Advantage Ads.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableAccounts.length > 0 ? (
              availableAccounts.map((account) => (
                <div
                  key={account.customerId}
                  className="cursor-pointer rounded-lg border p-4 hover:bg-gray-50"
                  onClick={() => handleAccountSelection(account, user.uid)}
                >
                  <div className="font-medium">{account.descriptiveName}</div>
                  <div className="text-sm text-gray-500">Customer ID: {account.customerId}</div>
                  <div className="text-sm text-gray-500">{account.currencyCode} • {account.timeZone}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No Google Ads accounts were returned. Please try reconnecting your Google Ads account.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasGoogleAdsAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Connect Your Google Ads Account</CardTitle>
            <CardDescription>
              Click below to connect your Google Ads account. After authorization, you'll be able to select which account to use.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleConnectGoogleAds(user?.uid)} className="w-full">
              Connect Google Ads Account
            </Button>
            <p className="mt-4 text-center text-sm text-gray-500">
              You'll be redirected to Google to authorize access, then you can select which account to use.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">MidPrint Market Research</h1>
        <p className="mt-1 text-gray-600">
          Evaluate keyword opportunities across your target markets using fresh demand, cost, and competition insights.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Research Parameters</CardTitle>
            <CardDescription>Specify the keyword, markets, and filters to analyze potential performance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-700">Keyword</span>
                <input
                  type="text"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Enter a core keyword (e.g., cash home buyers)"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-700">Match Type</span>
                <select
                  value={matchType}
                  onChange={(event) => setMatchType(event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                >
                  {MATCH_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-gray-700">Device</span>
                <select
                  value={device}
                  onChange={(event) => setDevice(event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                >
                  {DEVICE_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">Target Markets</p>
              <p className="text-xs text-gray-500">Select one or more markets to benchmark.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {POPULAR_MARKETS.map((market) => {
                  const isSelected = selectedMarkets.includes(market.code);
                  return (
                    <label
                      key={market.code}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleMarketToggle(market.code)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{market.label}</span>
                    </label>
                  );
                })}
              </div>
              {selectedMarkets.length ? (
                <p className="mt-2 text-xs text-gray-500">
                  Selected: {selectedMarkets.slice().sort().join(', ')}
                </p>
              ) : (
                <p className="mt-2 text-xs text-red-600">Select at least one market.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Focus on markets that meet your performance guardrails.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-gray-700">Minimum Monthly Searches</span>
              <input
                type="number"
                min={0}
                value={filters.minSearchVolume}
                onChange={(event) => setFilters((previous) => ({ ...previous, minSearchVolume: event.target.value }))}
                placeholder="e.g. 500"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-gray-700">Maximum Avg. CPC</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={filters.maxAverageCpc}
                onChange={(event) => setFilters((previous) => ({ ...previous, maxAverageCpc: event.target.value }))}
                placeholder="e.g. 12.50"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-gray-700">Minimum Competition Index</span>
              <input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={filters.minCompetitionIndex}
                onChange={(event) =>
                  setFilters((previous) => ({ ...previous, minCompetitionIndex: event.target.value }))
                }
                placeholder="e.g. 10"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-gray-700">Minimum Composite Score</span>
              <input
                type="number"
                min={0}
                max={1}
                step="0.01"
                value={filters.minScore}
                onChange={(event) => setFilters((previous) => ({ ...previous, minScore: event.target.value }))}
                placeholder="e.g. 0.55"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">
          Configure your research parameters and select "Run Research" to retrieve the latest data.
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => handleRunResearch()} disabled={status === 'processing'}>
            Refresh
          </Button>
          <Button onClick={handleRunResearch} disabled={disableRunButton}>
            {status === 'loading' ? 'Running…' : 'Run Research'}
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {formattedLastRefreshed ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            Last refreshed: {formattedLastRefreshed}
          </div>
        ) : null}
        {formattedCacheExpiry ? (
          <div className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-700">
            Cache valid until: {formattedCacheExpiry}
          </div>
        ) : null}

        {renderStatusMessage()}

        {status === 'loading' ? (
          <div className="flex items-center justify-center rounded-md border border-gray-200 bg-white py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
          </div>
        ) : null}

        {status === 'ready' && aggregates ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-gray-900">
                  {aggregates.averageScore !== null ? aggregates.averageScore.toFixed(3) : '—'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Lowest Avg. CPC</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-gray-900">
                  {aggregates.minAverageCpc !== null ? `$${aggregates.minAverageCpc.toFixed(2)}` : '—'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Highest Avg. CPC</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-gray-900">
                  {aggregates.maxAverageCpc !== null ? `$${aggregates.maxAverageCpc.toFixed(2)}` : '—'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Median Competition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-gray-900">
                  {aggregates.medianCompetitionIndex !== null
                    ? aggregates.medianCompetitionIndex.toFixed(2)
                    : '—'}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {status === 'ready' || status === 'processing' ? (
          <ResearchTable
            data={results}
            pagination={pagination}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            topRankCount={3}
            mode="infinite"
            isFetchingMore={isFetchingMore}
            totalLoaded={results.length}
          />
        ) : null}
        <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />
      </div>
    </div>
  );
}

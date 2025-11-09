'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

export interface ResearchRecord {
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
}

export interface ResearchPagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
  nextOffset: number | null;
  nextPageToken: string | null;
}

type SortField =
  | 'score'
  | 'searchVolume'
  | 'averageCpc'
  | 'competitionIndex'
  | 'topOfPageBidLow'
  | 'topOfPageBidHigh';

interface ResearchTableProps {
  data: ResearchRecord[];
  pagination: ResearchPagination | null;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  topRankCount?: number;
  mode?: 'paged' | 'infinite';
  isFetchingMore?: boolean;
  totalLoaded?: number;
}

function formatNumber(value: number | null, options?: Intl.NumberFormatOptions) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', options).format(value);
}

function formatCurrency(value: number | null, currency = 'USD') {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function SortIcon({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (!direction) {
    return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
  }

  return direction === 'asc' ? (
    <ArrowUp className="h-4 w-4 text-blue-600" />
  ) : (
    <ArrowDown className="h-4 w-4 text-blue-600" />
  );
}

export function ResearchTable({
  data,
  pagination,
  sortField,
  sortDirection,
  onSort,
  currentPage = 0,
  pageSize,
  onPageChange,
  onPageSizeChange,
  topRankCount = 3,
  mode = 'paged',
  isFetchingMore = false,
  totalLoaded,
}: ResearchTableProps) {
  const resolvedLimit = pagination?.limit ?? pageSize ?? (data.length > 0 ? data.length : 25);
  const total = pagination?.total ?? data.length;
  const rankBase = mode === 'infinite' ? 0 : pagination?.offset ?? currentPage * resolvedLimit;
  const totalPages =
    mode === 'infinite'
      ? 1
      : resolvedLimit > 0
        ? Math.max(1, Math.ceil(total / resolvedLimit))
        : 1;
  const displayedCount = mode === 'infinite' ? totalLoaded ?? data.length : data.length;
  const selectedPageSize = pageSize ?? resolvedLimit;
  const displayFrom = mode === 'infinite' ? (total === 0 ? 0 : 1) : total === 0 ? 0 : rankBase + 1;
  const displayTo =
    mode === 'infinite'
      ? displayedCount
      : total === 0
        ? 0
        : Math.min(rankBase + data.length, total);

  const isFirstPage = mode === 'infinite' ? true : currentPage <= 0;
  const isLastPage =
    mode === 'infinite'
      ? true
      : pagination
        ? !pagination.hasMore && currentPage >= totalPages - 1
        : total === 0 || currentPage >= totalPages - 1;

  type HeaderConfig =
    | { key: 'rank'; label: string }
    | { key: 'marketCode'; label: string }
    | { key: SortField; label: string; align?: 'left' | 'right' };

  const headers: HeaderConfig[] = [
    { key: 'rank', label: 'Rank' },
    { key: 'marketCode', label: 'Market' },
    { key: 'searchVolume', label: 'Search Volume', align: 'right' },
    { key: 'averageCpc', label: 'Avg. CPC', align: 'right' },
    { key: 'competitionIndex', label: 'Competition', align: 'right' },
    { key: 'topOfPageBidLow', label: 'Top of Page (Low)', align: 'right' },
    { key: 'topOfPageBidHigh', label: 'Top of Page (High)', align: 'right' },
    { key: 'score', label: 'Composite Score', align: 'right' },
  ];

  const handleSortClick = (field: SortField) => {
    onSort(field);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => {
                if (header.key === 'rank' || header.key === 'marketCode') {
                  return (
                    <th
                      key={header.label}
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {header.label}
                    </th>
                  );
                }

                const isActive = sortField === header.key;
                const direction = isActive ? sortDirection : null;

                return (
                  <th
                    key={header.key}
                    scope="col"
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${
                      header.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700"
                      onClick={() => handleSortClick(header.key as SortField)}
                    >
                      {header.label}
                      <SortIcon direction={direction} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-4 py-10 text-center text-sm text-gray-500">
                  No markets matched the selected filters yet.
                </td>
              </tr>
            ) : (
              data.map((record, index) => {
                const rank = rankBase + index + 1;
                const isTopRank = rank <= topRankCount;
                const rowClass = isTopRank ? 'bg-blue-50/60' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

                return (
                  <tr key={record.marketCode} className={rowClass}>
                    <td className="px-4 py-3 font-medium text-gray-700">{rank}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span>{record.marketCode}</span>
                        {record.currencyCode ? (
                          <span className="text-xs text-gray-500">Currency: {record.currencyCode}</span>
                        ) : null}
                      </div>
                      {isTopRank ? (
                        <span className="mt-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                          Top {rank}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatNumber(record.searchVolume)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {formatCurrency(record.averageCpc, record.currencyCode ?? 'USD')}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {formatNumber(record.competitionIndex, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {formatCurrency(record.topOfPageBidLow, record.currencyCode ?? 'USD')}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {formatCurrency(record.topOfPageBidHigh, record.currencyCode ?? 'USD')}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {record.score !== null && record.score !== undefined ? record.score.toFixed(3) : '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-gray-200 px-4 py-3 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
        <div>
          {mode === 'infinite' ? (
            <span>
              Loaded <span className="font-medium text-gray-900">{displayTo}</span> of{' '}
              <span className="font-medium text-gray-900">{total}</span> markets
              {pagination?.hasMore ? (
                <span className="ml-2 text-xs text-gray-500">
                  {isFetchingMore ? 'Loading more…' : 'Scroll to load additional markets.'}
                </span>
              ) : null}
            </span>
          ) : (
            <span>
              Showing <span className="font-medium text-gray-900">{displayFrom}-{displayTo}</span> of{' '}
              <span className="font-medium text-gray-900">{total}</span> markets
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onPageSizeChange ? (
            <label className="flex items-center gap-2 text-sm text-gray-600">
              {mode === 'infinite' ? 'Rows per load' : 'Rows per page'}
              <select
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                value={selectedPageSize}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {mode === 'paged' ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isFirstPage || !onPageChange}
                onClick={() => onPageChange?.(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700">
                Page <span className="font-semibold text-gray-900">{total === 0 ? 0 : currentPage + 1}</span> of{' '}
                <span className="font-semibold text-gray-900">{total === 0 ? 0 : totalPages}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={isLastPage || !onPageChange}
                onClick={() => onPageChange?.(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export type { SortField as ResearchSortField };

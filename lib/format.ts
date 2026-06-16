/**
 * Shared formatting utilities for financial values.
 */

/** Formats a number as a compact currency string (e.g. 1.50B, 250.00M, 12.5K) */
export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

/** Formats a percentage value, returning '—' for invalid numbers */
export function formatPercent(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  return `${value.toFixed(2)}%`;
}

/** Formats a payback period in months, returning 'Never' for null */
export function formatPBP(value: number | null): string {
  if (value === null) return 'Never';
  return `${value.toFixed(1)} mo`;
}

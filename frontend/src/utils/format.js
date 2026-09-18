/**
 * Small formatting helpers shared across Admin pages.
 */

/**
 * Format an ISO date string as e.g. "18 Sep 2026".
 * Falls back to the raw value if it can't be parsed.
 */
export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format an ISO date string with date + time, e.g. "18 Sep 2026, 13:20".
 */
export function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Percentage from score/total, rounded to a whole number. Returns e.g. "80%".
 */
export function toPercentage(score, total) {
  if (!total || Number.isNaN(score) || Number.isNaN(total)) return '—';
  return `${Math.round((score / total) * 100)}%`;
}

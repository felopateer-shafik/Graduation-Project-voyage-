import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date string to readable format
 * @param {string|Date} date
 * @param {string} pattern - date-fns format pattern
 * @returns {string}
 */
export function formatDate(date, pattern = 'MMM dd, yyyy') {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern);
}

/**
 * Format a date to relative time (e.g. "2 hours ago")
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Format time in HH:MM AM/PM
 * @param {string|Date} date
 * @returns {string}
 */
export function formatTime(date) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'hh:mm a');
}

import { clsx } from 'clsx';

/**
 * Merge class names conditionally
 * @param  {...(string|object|Array)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Format a number as EGP.
 * @param {number} amount - Amount in EGP
 * @param {string} currencyCode - Ignored; prices are displayed in EGP site-wide.
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currencyCode = 'EGP') {
  void currencyCode;
  const value = Number(amount);
  const safeAmount = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeAmount) + ' EGP';
}

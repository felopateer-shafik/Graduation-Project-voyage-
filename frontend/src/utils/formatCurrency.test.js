import { describe, expect, it } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('always displays booking and wallet amounts in EGP', () => {
    expect(formatCurrency(1250)).toBe('1,250 EGP');
    expect(formatCurrency(1250, 'USD')).toBe('1,250 EGP');
    expect(formatCurrency('500')).toBe('500 EGP');
  });

  it('handles missing and invalid amounts as zero EGP', () => {
    expect(formatCurrency(undefined)).toBe('0 EGP');
    expect(formatCurrency(Number.NaN)).toBe('0 EGP');
  });
});


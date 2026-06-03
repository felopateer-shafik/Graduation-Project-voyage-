export const LOYALTY_TIERS = {
  BRONZE: {
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 4999,
    color: '#CD7F32',
    benefits: ['Basic rewards', '1x points earning'],
  },
  SILVER: {
    name: 'Silver',
    minPoints: 5000,
    maxPoints: 14999,
    color: '#C0C0C0',
    benefits: ['Priority check-in', '1.5x points earning', 'Free seat selection'],
  },
  GOLD: {
    name: 'Gold',
    minPoints: 15000,
    maxPoints: 29999,
    color: '#FFD700',
    benefits: ['Lounge access', '2x points earning', 'Free upgrades (when available)'],
  },
  PLATINUM: {
    name: 'Platinum',
    minPoints: 30000,
    maxPoints: Infinity,
    color: '#E5E4E2',
    benefits: ['Personal concierge', '3x points earning', 'Guaranteed upgrades', 'Companion passes'],
  },
};

/**
 * Get user's loyalty tier based on points
 * @param {number} points
 * @returns {object} tier info
 */
export function getLoyaltyTier(points) {
  if (points >= LOYALTY_TIERS.PLATINUM.minPoints) return LOYALTY_TIERS.PLATINUM;
  if (points >= LOYALTY_TIERS.GOLD.minPoints) return LOYALTY_TIERS.GOLD;
  if (points >= LOYALTY_TIERS.SILVER.minPoints) return LOYALTY_TIERS.SILVER;
  return LOYALTY_TIERS.BRONZE;
}

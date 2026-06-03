package com.voyage.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyBalanceResponse {
    private int points;
    private String tier;
    private double walletBalance;
    /** Points needed to reach the next tier; 0 if already at Platinum */
    private int pointsToNextTier;
    /** Name of the next tier; null if already at Platinum */
    private String nextTierName;
}

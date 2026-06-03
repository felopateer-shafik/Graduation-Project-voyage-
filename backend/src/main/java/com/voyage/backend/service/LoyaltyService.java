package com.voyage.backend.service;

import com.voyage.backend.dto.LoyaltyBalanceResponse;
import com.voyage.backend.exception.BadRequestException;
import com.voyage.backend.exception.ResourceNotFoundException;
import com.voyage.backend.model.Booking;
import com.voyage.backend.model.LoyaltyTransaction;
import com.voyage.backend.model.User;
import com.voyage.backend.model.enums.LoyaltyReason;
import com.voyage.backend.model.enums.LoyaltyTier;
import com.voyage.backend.repository.LoyaltyTransactionRepository;
import com.voyage.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LoyaltyService {

    // Must stay in sync with frontend loyaltyTiers.js
    private static final int SILVER_THRESHOLD   = 5_000;
    private static final int GOLD_THRESHOLD     = 15_000;
    private static final int PLATINUM_THRESHOLD = 30_000;

    private static final int POINTS_PER_EGP = 1;
    private static final int POINTS_PER_CREDIT  = 100; // 100 points = 1 EGP wallet credit
    private static final int MIN_REDEEM         = 500;

    private final LoyaltyTransactionRepository txRepo;
    private final UserRepository userRepository;

    public LoyaltyService(LoyaltyTransactionRepository txRepo, UserRepository userRepository) {
        this.txRepo = txRepo;
        this.userRepository = userRepository;
    }

    /**
     * Award points after a booking is paid. Returns the number of points awarded.
     * Caller is responsible for saving the booking with loyaltyPointsEarned set.
     */
    @Transactional
    public int awardForBooking(User user, Booking booking) {
        int points = (int) (booking.getTotalPrice() * POINTS_PER_EGP);
        if (points <= 0) return 0;

        user.setLoyaltyPoints(user.getLoyaltyPoints() + points);
        recomputeTier(user);
        userRepository.save(user);

        txRepo.save(LoyaltyTransaction.builder()
                .user(user)
                .delta(points)
                .reason(LoyaltyReason.EARN_BOOKING)
                .bookingId(booking.getId())
                .build());

        return points;
    }

    /**
     * Redeem points for wallet credit. Atomically deducts points and adds wallet balance.
     */
    @Transactional
    public User redeem(Long userId, int points) {
        if (points < MIN_REDEEM) {
            throw new BadRequestException("Minimum redemption is " + MIN_REDEEM + " points");
        }
        if (points % 100 != 0) {
            throw new BadRequestException("Points must be a multiple of 100");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getLoyaltyPoints() < points) {
            throw new BadRequestException("Insufficient loyalty points");
        }

        double credit = (double) points / POINTS_PER_CREDIT;

        user.setLoyaltyPoints(user.getLoyaltyPoints() - points);
        user.setWalletBalance(user.getWalletBalance() + credit);
        recomputeTier(user);
        userRepository.save(user);

        txRepo.save(LoyaltyTransaction.builder()
                .user(user)
                .delta(-points)
                .reason(LoyaltyReason.REDEEM)
                .build());

        return user;
    }

    public LoyaltyBalanceResponse getBalance(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        int points = user.getLoyaltyPoints();
        LoyaltyTier tier = user.getTier();
        int[] nextThreshold = nextTierInfo(points);

        return LoyaltyBalanceResponse.builder()
                .points(points)
                .tier(tier.name())
                .walletBalance(user.getWalletBalance())
                .pointsToNextTier(nextThreshold[0])
                .nextTierName(nextThreshold[1] == 0 ? null : LoyaltyTier.values()[nextThreshold[1]].name())
                .build();
    }

    public List<LoyaltyTransaction> getHistory(Long userId) {
        return txRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /** Updates user.tier based on current loyaltyPoints. Does NOT save the user. */
    public void recomputeTier(User user) {
        int p = user.getLoyaltyPoints();
        LoyaltyTier tier;
        if (p >= PLATINUM_THRESHOLD) tier = LoyaltyTier.PLATINUM;
        else if (p >= GOLD_THRESHOLD) tier = LoyaltyTier.GOLD;
        else if (p >= SILVER_THRESHOLD) tier = LoyaltyTier.SILVER;
        else tier = LoyaltyTier.BRONZE;
        user.setTier(tier);
    }

    /** Returns [pointsToNext, ordinal of next tier] or [0, 0] for Platinum. */
    private int[] nextTierInfo(int points) {
        if (points >= PLATINUM_THRESHOLD) return new int[]{0, 0};
        if (points >= GOLD_THRESHOLD)     return new int[]{PLATINUM_THRESHOLD - points, LoyaltyTier.PLATINUM.ordinal()};
        if (points >= SILVER_THRESHOLD)   return new int[]{GOLD_THRESHOLD - points,     LoyaltyTier.GOLD.ordinal()};
        return new int[]{SILVER_THRESHOLD - points, LoyaltyTier.SILVER.ordinal()};
    }
}

package com.voyage.backend.controller;

import com.voyage.backend.dto.LoyaltyBalanceResponse;
import com.voyage.backend.dto.RedeemRequest;
import com.voyage.backend.model.LoyaltyTransaction;
import com.voyage.backend.model.User;
import com.voyage.backend.service.LoyaltyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/loyalty")
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    public LoyaltyController(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    @GetMapping("/balance")
    public ResponseEntity<LoyaltyBalanceResponse> getBalance(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(loyaltyService.getBalance(userId));
    }

    @GetMapping("/history")
    public ResponseEntity<List<LoyaltyTransaction>> getHistory(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(loyaltyService.getHistory(userId));
    }

    @PostMapping("/redeem")
    public ResponseEntity<?> redeem(@AuthenticationPrincipal Long userId,
                                    @RequestBody RedeemRequest request) {
        User updated = loyaltyService.redeem(userId, request.getPoints());
        return ResponseEntity.ok(Map.of(
                "message", "Redeemed " + request.getPoints() + " points for " + (request.getPoints() / 100.0) + " EGP wallet credit",
                "newPoints", updated.getLoyaltyPoints(),
                "newWalletBalance", updated.getWalletBalance(),
                "tier", updated.getTier().name()
        ));
    }
}

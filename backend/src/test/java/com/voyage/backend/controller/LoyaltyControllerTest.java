package com.voyage.backend.controller;

import com.voyage.backend.dto.RedeemRequest;
import com.voyage.backend.model.User;
import com.voyage.backend.model.enums.LoyaltyTier;
import com.voyage.backend.service.LoyaltyService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class LoyaltyControllerTest {

    @Test
    void redeemMessageUsesEgpWalletCredit() {
        LoyaltyService loyaltyService = mock(LoyaltyService.class);
        LoyaltyController controller = new LoyaltyController(loyaltyService);
        RedeemRequest request = new RedeemRequest();
        request.setPoints(500);
        User updated = User.builder()
                .id(7L)
                .loyaltyPoints(1000)
                .walletBalance(105.0)
                .tier(LoyaltyTier.BRONZE)
                .build();

        when(loyaltyService.redeem(7L, 500)).thenReturn(updated);

        ResponseEntity<?> response = controller.redeem(7L, request);
        Map<?, ?> body = (Map<?, ?>) response.getBody();

        assertThat(body).isNotNull();
        assertThat(body.get("message")).isEqualTo("Redeemed 500 points for 5.0 EGP wallet credit");
        assertThat(body.get("newWalletBalance")).isEqualTo(105.0);
    }
}


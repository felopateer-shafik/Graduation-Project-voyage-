package com.voyage.backend.service;

import com.voyage.backend.exception.BadRequestException;
import com.voyage.backend.model.LoyaltyTransaction;
import com.voyage.backend.model.User;
import com.voyage.backend.repository.LoyaltyTransactionRepository;
import com.voyage.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class LoyaltyServiceTest {

    private final LoyaltyTransactionRepository transactionRepository = mock(LoyaltyTransactionRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final LoyaltyService loyaltyService = new LoyaltyService(transactionRepository, userRepository);

    @Test
    void redeemConvertsEveryOneHundredPointsToOneEgpWalletCredit() {
        User user = User.builder()
                .id(1L)
                .walletBalance(25.0)
                .loyaltyPoints(1500)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(transactionRepository.save(any(LoyaltyTransaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = loyaltyService.redeem(1L, 500);

        assertThat(updated.getWalletBalance()).isEqualTo(30.0);
        assertThat(updated.getLoyaltyPoints()).isEqualTo(1000);
    }

    @Test
    void redeemRejectsAmountsBelowMinimumOrNotInHundredPointMultiples() {
        assertThatThrownBy(() -> loyaltyService.redeem(1L, 400))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Minimum");

        assertThatThrownBy(() -> loyaltyService.redeem(1L, 550))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("multiple");
    }
}

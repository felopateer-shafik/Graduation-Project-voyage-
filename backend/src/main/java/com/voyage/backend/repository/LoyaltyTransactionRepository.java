package com.voyage.backend.repository;

import com.voyage.backend.model.LoyaltyTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoyaltyTransactionRepository extends JpaRepository<LoyaltyTransaction, Long> {
    List<LoyaltyTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
}

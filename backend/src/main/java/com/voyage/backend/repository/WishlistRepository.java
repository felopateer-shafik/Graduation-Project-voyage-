package com.voyage.backend.repository;

import com.voyage.backend.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findByUserIdOrderByAddedAtDesc(Long userId);

    Optional<WishlistItem> findByIdAndUserId(Long id, Long userId);

    Optional<WishlistItem> findByUserIdAndItemTypeAndItemId(Long userId, String itemType, Long itemId);

    void deleteByUserId(Long userId);
}

package com.voyage.backend.repository;

import com.voyage.backend.model.PriceFreeze;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PriceFreezeRepository extends JpaRepository<PriceFreeze, Long> {
    List<PriceFreeze> findByUserIdAndActiveTrue(Long userId);
    Optional<PriceFreeze> findByBookingId(Long bookingId);
    boolean existsByUserIdAndBooking_Flight_IdAndActiveTrue(Long userId, Long flightId);
}

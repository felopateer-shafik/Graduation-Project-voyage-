package com.voyage.backend.repository;

import com.voyage.backend.model.Booking;
import com.voyage.backend.model.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId ORDER BY b.bookingDate DESC")
    List<Booking> findByUserIdOrderByBookingDateDesc(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b WHERE b.id = :id AND b.user.id = :userId")
    Optional<Booking> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.user.id = :userId AND b.hotel.id = :targetId AND b.status = :status AND b.paid = true")
    boolean existsPaidBookingForHotel(@Param("userId") Long userId, @Param("targetId") Long targetId, @Param("status") BookingStatus status);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.user.id = :userId AND b.tour.id = :targetId AND b.status = :status AND b.paid = true")
    boolean existsPaidBookingForTour(@Param("userId") Long userId, @Param("targetId") Long targetId, @Param("status") BookingStatus status);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.user.id = :userId AND b.travelPackage.id = :targetId AND b.status = :status AND b.paid = true")
    boolean existsPaidBookingForPackage(@Param("userId") Long userId, @Param("targetId") Long targetId, @Param("status") BookingStatus status);
}

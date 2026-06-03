package com.voyage.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.voyage.backend.model.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "flight_id")
    private Flight flight;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tour_id")
    private Tour tour;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "package_id")
    private TravelPackage travelPackage;

    @Column(nullable = false, unique = true)
    private String transactionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Column(nullable = false)
    private Double totalPrice;

    @Column(nullable = false)
    @Builder.Default
    private Integer rooms = 1;

    @Column(nullable = false)
    @Builder.Default
    private Integer days = 1;

    @Column(nullable = false)
    @Builder.Default
    private Integer guests = 1;

    @Column(nullable = false)
    @Builder.Default
    private Boolean paid = false;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime bookingDate = LocalDateTime.now();

    /** Confirmation code shown to user after payment */
    private String confirmationCode;

    /** Loyalty points earned from this booking */
    @Builder.Default
    private Integer loyaltyPointsEarned = 0;

    @PrePersist
    protected void onCreate() {
        if (transactionId == null) {
            transactionId = "VGA-TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (bookingDate == null) {
            bookingDate = LocalDateTime.now();
        }
    }
}

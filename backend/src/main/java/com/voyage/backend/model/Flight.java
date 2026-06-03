package com.voyage.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "flights", indexes = {
    @Index(name = "idx_flight_departure", columnList = "departureCity"),
    @Index(name = "idx_flight_arrival", columnList = "arrivalCity"),
    @Index(name = "idx_flight_price", columnList = "price")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String airlineName;

    @Column(nullable = false)
    private String flightNumber;

    @Column(nullable = false)
    private String departureCity;

    @Column(nullable = false, length = 5)
    private String departureCityCode;

    @Column(nullable = false)
    private String arrivalCity;

    @Column(nullable = false, length = 5)
    private String arrivalCityCode;

    @Column(nullable = false)
    private LocalDateTime departureTime;

    @Column(nullable = false)
    private LocalDateTime arrivalTime;

    @Column(nullable = false)
    private String duration;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer availableSeats;

    @Column(nullable = false)
    @Builder.Default
    private Integer stops = 0;

    @Column(nullable = false)
    @Builder.Default
    private String cabinClass = "Economy";

    private String aircraft;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    /** Comma-separated list of amenities e.g. "WiFi,Meals,Entertainment" */
    @Column(length = 500)
    private String amenities;

    @Column(nullable = false)
    @Builder.Default
    private Boolean refundable = false;
}

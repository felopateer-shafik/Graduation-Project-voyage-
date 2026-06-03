package com.voyage.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hotels", indexes = {
    @Index(name = "idx_hotel_city", columnList = "city"),
    @Index(name = "idx_hotel_price", columnList = "pricePerNight")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String city;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double pricePerNight;

    @Column(nullable = false)
    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer reviewCount = 0;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    /** Comma-separated list of image URLs */
    @Column(columnDefinition = "TEXT")
    private String images;

    @Column(nullable = false)
    @Builder.Default
    private Integer availableRooms = 10;

    private String roomType;

    /** Comma-separated amenity keys e.g. "wifi,pool,spa,gym" */
    @Column(length = 500)
    private String amenities;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    @Builder.Default
    private Integer stars = 3;

    private String bedType;
    private String roomSize;
    private String view;

    @Builder.Default
    private Integer discount = 0;

    private Double originalPrice;

    @Builder.Default
    private Boolean freeCancellation = true;

    @Builder.Default
    private Integer loyaltyPoints = 0;

    /** Comma-separated tags e.g. "Beachfront,Luxury" */
    @Column(length = 500)
    private String tags;
}

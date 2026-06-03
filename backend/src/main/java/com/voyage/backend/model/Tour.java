package com.voyage.backend.model;

import com.voyage.backend.model.enums.TourType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tours", indexes = {
    @Index(name = "idx_tour_location", columnList = "location"),
    @Index(name = "idx_tour_price", columnList = "price")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String duration;

    @Column(nullable = false)
    private Double price;

    private String category;

    private String difficulty;

    @Builder.Default
    private Integer maxGroupSize = 15;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer reviewCount = 0;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TourType tourType = TourType.GROUP;

    @Column(nullable = false)
    @Builder.Default
    private Boolean featured = false;
}

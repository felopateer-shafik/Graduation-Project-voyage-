package com.voyage.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "landmarks")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Landmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    /** Denormalised for easy serialisation without circular reference. */
    @Column(nullable = false, length = 10)
    private String cityCode;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id")
    private City city;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    private Double latitude;

    private Double longitude;

    /** "historic" | "natural" | "cultural" | "hidden-gem" */
    private String category;

    @Column(nullable = false)
    @Builder.Default
    private boolean hiddenGem = false;
}

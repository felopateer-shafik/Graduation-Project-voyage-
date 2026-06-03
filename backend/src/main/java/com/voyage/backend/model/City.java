package com.voyage.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cities")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String code;

    @Column(nullable = false)
    private String name;

    /** Denormalised for easy serialisation without circular reference. */
    @Column(nullable = false, length = 10)
    private String countryCode;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id")
    private Country country;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String heroImageUrl;

    private Double latitude;

    private Double longitude;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "city_activities", joinColumns = @JoinColumn(name = "city_id"))
    @Column(name = "activity")
    @Builder.Default
    private List<String> popularActivities = new ArrayList<>();
}

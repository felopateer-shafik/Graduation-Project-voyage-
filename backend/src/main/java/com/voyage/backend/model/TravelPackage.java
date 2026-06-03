package com.voyage.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "packages")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TravelPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String heroImageUrl;

    private String originCityCode;
    private String destinationCityCode;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id")
    private Flight flight;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    private LocalDate startDate;
    private LocalDate endDate;

    @Column(nullable = false)
    private Integer nights;

    @Column(nullable = false)
    private Double pricePerPerson;

    @Column(nullable = false)
    private Double totalPrice;

    @Builder.Default
    private String currency = "EGP";

    /** Always loaded with the entity — needed on every package card. */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "package_inclusions", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "inclusion")
    @Builder.Default
    private List<String> inclusions = new ArrayList<>();

    /** Itinerary hidden from list responses; loaded on demand via PackageDetailResponse. */
    @JsonIgnore
    @OneToMany(mappedBy = "travelPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DayPlan> itinerary = new ArrayList<>();

    @Builder.Default
    private Boolean active = true;
}

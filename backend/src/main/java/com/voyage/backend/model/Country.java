package com.voyage.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "countries")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 10)
    private String code;

    private String continent;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String heroImageUrl;

    private String currency;

    private String language;

    private String timezone;

    @Column(nullable = false)
    @Builder.Default
    private boolean popular = false;
}

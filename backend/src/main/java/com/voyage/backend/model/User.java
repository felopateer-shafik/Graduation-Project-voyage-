package com.voyage.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.voyage.backend.model.enums.LoyaltyTier;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true) // الوحيد اللي Unique
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private String phone;

    private String profilePictureUrl;

    @Column(nullable = false)
    @Builder.Default
    private Integer loyaltyPoints = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private LoyaltyTier tier = LoyaltyTier.BRONZE;

    @Column(nullable = false)
    @Builder.Default
    private Double walletBalance = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean emailVerified = false;

    @JsonIgnore
    private String otpCode;

    @JsonIgnore
    private LocalDateTime otpExpiresAt;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
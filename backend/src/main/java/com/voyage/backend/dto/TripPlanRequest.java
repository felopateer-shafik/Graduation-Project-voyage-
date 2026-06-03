package com.voyage.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record TripPlanRequest(
    @NotBlank String origin,
    @NotBlank String destination,
    @Min(1) @Max(21) int days,
    List<String> interests,
    String customInstructions,
    String departureDate,
    String returnDate
) {}

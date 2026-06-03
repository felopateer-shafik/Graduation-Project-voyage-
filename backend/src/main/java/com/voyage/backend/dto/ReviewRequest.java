package com.voyage.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewRequest {

    @NotBlank
    @Pattern(regexp = "HOTEL|TOUR|PACKAGE", message = "targetType must be HOTEL, TOUR, or PACKAGE")
    private String targetType;

    @NotNull
    private Long targetId;

    @Min(1) @Max(5)
    private int rating;

    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 2000)
    private String body;
}

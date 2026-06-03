package com.voyage.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ProfileUpdateRequest {
    @NotBlank
    private String fullName;
    private String phone;
}

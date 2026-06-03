package com.voyage.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class WishlistRequest {
    @NotBlank
    private String type;
    @NotNull
    private Long itemId;
}

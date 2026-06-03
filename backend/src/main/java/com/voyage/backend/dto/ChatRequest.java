package com.voyage.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

public record ChatRequest(
    @NotBlank String message,
    List<Map<String, String>> history
) {}

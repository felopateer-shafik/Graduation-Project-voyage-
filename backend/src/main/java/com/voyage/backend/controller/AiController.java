package com.voyage.backend.controller;

import com.voyage.backend.dto.ChatRequest;
import com.voyage.backend.dto.TripPlanRequest;
import com.voyage.backend.service.ai.AiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/trip-plan")
    public ResponseEntity<Map<String, Object>> tripPlan(
            Authentication authentication,
            @Valid @RequestBody TripPlanRequest request) {
        Long userId = resolveUserId(authentication);
        Map<String, Object> plan = aiService.generateTripPlan(
            request.origin(),
            request.destination(),
            request.days(),
            request.interests() != null ? request.interests() : List.of(),
            request.customInstructions(),
            request.departureDate(),
            request.returnDate(),
            userId
        );
        return ResponseEntity.ok(plan);
    }

    @PostMapping("/support")
    public ResponseEntity<Map<String, String>> support(
            Authentication authentication,
            @Valid @RequestBody ChatRequest request) {
        Long userId = resolveUserId(authentication);
        String reply = aiService.answerSupport(request.message(), request.history(), userId);
        return ResponseEntity.ok(Map.of("reply", reply));
    }

    private Long resolveUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return null;
        try {
            return Long.parseLong(authentication.getName());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}

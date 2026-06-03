package com.voyage.backend.controller;

import com.voyage.backend.service.RecommendationsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/recommendations")
public class RecommendationsController {

    private final RecommendationsService recommendationsService;

    public RecommendationsController(RecommendationsService recommendationsService) {
        this.recommendationsService = recommendationsService;
    }

    /** GET /recommendations — returns popular hotels, featured tours, latest packages */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getRecommendations() {
        return ResponseEntity.ok(recommendationsService.getRecommendations());
    }
}

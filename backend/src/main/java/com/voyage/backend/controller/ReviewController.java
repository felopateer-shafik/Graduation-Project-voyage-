package com.voyage.backend.controller;

import com.voyage.backend.dto.ReviewRequest;
import com.voyage.backend.dto.ReviewResponse;
import com.voyage.backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    private Long getUserId(Authentication auth) {
        return Long.parseLong(auth.getName());
    }

    /** GET /reviews?targetType=HOTEL&targetId=12 — public */
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getReviews(
            @RequestParam String targetType,
            @RequestParam Long targetId) {
        return ResponseEntity.ok(reviewService.getReviews(targetType, targetId));
    }

    /** POST /reviews — authenticated, eligibility enforced in service */
    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            Authentication auth,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.addReview(getUserId(auth), request));
    }

    /** DELETE /reviews/{id} — owner only */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(Authentication auth, @PathVariable Long id) {
        reviewService.deleteReview(getUserId(auth), id);
        return ResponseEntity.noContent().build();
    }
}

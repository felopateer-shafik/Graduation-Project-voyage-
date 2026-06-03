package com.voyage.backend.controller;

import com.voyage.backend.model.Tour;
import com.voyage.backend.service.TourService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tours")
public class TourController {

    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @GetMapping
    public ResponseEntity<List<Tour>> getAllTours() {
        return ResponseEntity.ok(tourService.getAllTours());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Tour>> searchTours(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(tourService.searchTours(query));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Tour>> getFeaturedTours() {
        return ResponseEntity.ok(tourService.getFeaturedTours());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Tour>> getToursByCategory(@PathVariable String category) {
        return ResponseEntity.ok(tourService.getToursByCategory(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getTourById(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.getTourById(id));
    }
}

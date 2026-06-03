package com.voyage.backend.controller;

import com.voyage.backend.model.Landmark;
import com.voyage.backend.service.CityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/landmarks")
public class LandmarkController {

    private final CityService cityService;

    public LandmarkController(CityService cityService) {
        this.cityService = cityService;
    }

    /** GET /landmarks?cityCode=CAI&hiddenGem=true */
    @GetMapping
    public ResponseEntity<List<Landmark>> listLandmarks(
            @RequestParam(required = false) String cityCode,
            @RequestParam(required = false) Boolean hiddenGem) {
        return ResponseEntity.ok(cityService.getLandmarks(cityCode, hiddenGem));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Landmark> getLandmark(@PathVariable Long id) {
        return ResponseEntity.ok(cityService.getLandmarkById(id));
    }
}

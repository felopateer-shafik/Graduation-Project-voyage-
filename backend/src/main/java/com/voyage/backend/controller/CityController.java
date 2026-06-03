package com.voyage.backend.controller;

import com.voyage.backend.dto.CityDetailResponse;
import com.voyage.backend.model.City;
import com.voyage.backend.model.Landmark;
import com.voyage.backend.service.CityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cities")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    /** GET /cities?countryCode=EG */
    @GetMapping
    public ResponseEntity<List<City>> listCities(
            @RequestParam(required = false) String countryCode) {
        return ResponseEntity.ok(cityService.getAllCities(countryCode));
    }

    /** GET /cities/{code} — detail with landmarks + activities */
    @GetMapping("/{code}")
    public ResponseEntity<CityDetailResponse> getCity(@PathVariable String code) {
        return ResponseEntity.ok(cityService.getCityDetail(code));
    }
}

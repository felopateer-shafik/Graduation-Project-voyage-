package com.voyage.backend.controller;

import com.voyage.backend.dto.CountryDetailResponse;
import com.voyage.backend.model.Country;
import com.voyage.backend.service.CountryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/countries")
public class CountryController {

    private final CountryService countryService;

    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    /** GET /countries?popular=true */
    @GetMapping
    public ResponseEntity<List<Country>> listCountries(
            @RequestParam(defaultValue = "false") boolean popular) {
        return ResponseEntity.ok(countryService.getAllCountries(popular));
    }

    /** GET /countries/{code} — detail with cities */
    @GetMapping("/{code}")
    public ResponseEntity<CountryDetailResponse> getCountry(@PathVariable String code) {
        return ResponseEntity.ok(countryService.getCountryDetail(code));
    }
}

package com.voyage.backend.controller;

import com.voyage.backend.dto.PackageDetailResponse;
import com.voyage.backend.model.TravelPackage;
import com.voyage.backend.service.PackageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/packages")
public class PackageController {

    private final PackageService packageService;

    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    /** GET /packages?origin=CAI&destination=DXB */
    @GetMapping
    public ResponseEntity<List<TravelPackage>> listPackages(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination) {
        return ResponseEntity.ok(packageService.listPackages(origin, destination));
    }

    /** GET /packages/{id} — returns full detail including itinerary */
    @GetMapping("/{id}")
    public ResponseEntity<PackageDetailResponse> getPackage(@PathVariable Long id) {
        return ResponseEntity.ok(packageService.getPackageDetail(id));
    }
}

package com.voyage.backend.service;

import com.voyage.backend.model.Hotel;
import com.voyage.backend.model.Tour;
import com.voyage.backend.model.TravelPackage;
import com.voyage.backend.repository.HotelRepository;
import com.voyage.backend.repository.PackageRepository;
import com.voyage.backend.repository.TourRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecommendationsService {

    private final HotelRepository hotelRepository;
    private final TourRepository tourRepository;
    private final PackageRepository packageRepository;

    public RecommendationsService(HotelRepository hotelRepository,
                                  TourRepository tourRepository,
                                  PackageRepository packageRepository) {
        this.hotelRepository = hotelRepository;
        this.tourRepository = tourRepository;
        this.packageRepository = packageRepository;
    }

    public Map<String, Object> getRecommendations() {
        List<Hotel> hotels = hotelRepository.findAll().stream()
                .sorted((a, b) -> Double.compare(
                        b.getRating() != null ? b.getRating() : 0,
                        a.getRating() != null ? a.getRating() : 0))
                .limit(4)
                .toList();

        List<Tour> tours = tourRepository.findByFeaturedTrue().stream()
                .limit(4)
                .toList();
        if (tours.isEmpty()) {
            tours = tourRepository.findAll().stream()
                    .sorted((a, b) -> Double.compare(
                            b.getRating() != null ? b.getRating() : 0,
                            a.getRating() != null ? a.getRating() : 0))
                    .limit(4)
                    .toList();
        }

        List<TravelPackage> packages = packageRepository.findByActiveTrueOrderByIdDesc().stream()
                .limit(3)
                .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("hotels", hotels);
        result.put("tours", tours);
        result.put("packages", packages);
        return result;
    }
}

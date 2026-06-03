package com.voyage.backend.service;

import com.voyage.backend.exception.ResourceNotFoundException;
import com.voyage.backend.model.Tour;
import com.voyage.backend.repository.TourRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TourService {

    private final TourRepository tourRepository;

    public TourService(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }

    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    public Tour getTourById(Long id) {
        return tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + id));
    }

    public List<Tour> searchTours(String query) {
        if (query != null && !query.isBlank()) {
            return tourRepository.searchTours(query);
        }
        return tourRepository.findAll();
    }

    public List<Tour> getFeaturedTours() {
        return tourRepository.findByFeaturedTrue();
    }

    public List<Tour> getToursByCategory(String category) {
        return tourRepository.findByCategoryIgnoreCase(category);
    }
}

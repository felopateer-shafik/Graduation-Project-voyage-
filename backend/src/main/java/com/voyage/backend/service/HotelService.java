package com.voyage.backend.service;

import com.voyage.backend.exception.ResourceNotFoundException;
import com.voyage.backend.model.Hotel;
import com.voyage.backend.repository.HotelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
    }

    public List<Hotel> searchHotels(String city, Double maxPrice) {
        String normalizedCity = normalize(city);
        if (normalizedCity != null && maxPrice != null) {
            return hotelRepository.searchByCityAndMaxPrice(normalizedCity, maxPrice);
        } else if (normalizedCity != null) {
            return hotelRepository.searchByCityLocationOrName(normalizedCity);
        }
        return hotelRepository.findAll();
    }

    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}

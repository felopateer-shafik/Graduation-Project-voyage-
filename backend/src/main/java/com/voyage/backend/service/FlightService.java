package com.voyage.backend.service;

import com.voyage.backend.exception.ResourceNotFoundException;
import com.voyage.backend.model.Flight;
import com.voyage.backend.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
    }

    public List<Flight> searchFlights(String from, String to) {
        String normalizedFrom = normalize(from);
        String normalizedTo = normalize(to);
        if (normalizedFrom != null && normalizedTo != null) {
            return flightRepository.searchFlights(normalizedFrom, normalizedTo);
        } else if (normalizedFrom != null) {
            return flightRepository.searchByDeparture(normalizedFrom);
        } else if (normalizedTo != null) {
            return flightRepository.searchByArrival(normalizedTo);
        }
        return flightRepository.findAll();
    }

    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}

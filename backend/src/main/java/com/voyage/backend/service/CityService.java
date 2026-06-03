package com.voyage.backend.service;

import com.voyage.backend.dto.CityDetailResponse;
import com.voyage.backend.exception.ResourceNotFoundException;
import com.voyage.backend.model.City;
import com.voyage.backend.model.Landmark;
import com.voyage.backend.repository.CityRepository;
import com.voyage.backend.repository.LandmarkRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityService {

    private final CityRepository cityRepository;
    private final LandmarkRepository landmarkRepository;

    public CityService(CityRepository cityRepository, LandmarkRepository landmarkRepository) {
        this.cityRepository = cityRepository;
        this.landmarkRepository = landmarkRepository;
    }

    public List<City> getAllCities(String countryCode) {
        if (countryCode != null && !countryCode.isBlank()) {
            return cityRepository.findByCountryCode(countryCode.toUpperCase());
        }
        return cityRepository.findAll();
    }

    public CityDetailResponse getCityDetail(String code) {
        City city = cityRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("City not found: " + code));

        List<Landmark> landmarks = landmarkRepository.findByCityCode(city.getCode());

        List<CityDetailResponse.LandmarkBrief> landmarkBriefs = landmarks.stream()
                .map(l -> CityDetailResponse.LandmarkBrief.builder()
                        .id(l.getId())
                        .name(l.getName())
                        .cityCode(l.getCityCode())
                        .description(l.getDescription())
                        .imageUrl(l.getImageUrl())
                        .latitude(l.getLatitude())
                        .longitude(l.getLongitude())
                        .category(l.getCategory())
                        .hiddenGem(l.isHiddenGem())
                        .build())
                .toList();

        return CityDetailResponse.builder()
                .id(city.getId())
                .code(city.getCode())
                .name(city.getName())
                .countryCode(city.getCountryCode())
                .description(city.getDescription())
                .heroImageUrl(city.getHeroImageUrl())
                .latitude(city.getLatitude())
                .longitude(city.getLongitude())
                .popularActivities(city.getPopularActivities())
                .landmarks(landmarkBriefs)
                .build();
    }

    public List<Landmark> getLandmarks(String cityCode, Boolean hiddenGem) {
        if (cityCode != null && !cityCode.isBlank() && hiddenGem != null) {
            return landmarkRepository.findByCityCodeAndHiddenGem(cityCode.toUpperCase(), hiddenGem);
        }
        if (cityCode != null && !cityCode.isBlank()) {
            return landmarkRepository.findByCityCode(cityCode.toUpperCase());
        }
        if (hiddenGem != null) {
            return landmarkRepository.findByHiddenGem(hiddenGem);
        }
        return landmarkRepository.findAll();
    }

    public Landmark getLandmarkById(Long id) {
        return landmarkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Landmark not found: " + id));
    }
}

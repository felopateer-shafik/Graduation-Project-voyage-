package com.voyage.backend.service;

import com.voyage.backend.dto.CountryDetailResponse;
import com.voyage.backend.exception.ResourceNotFoundException;
import com.voyage.backend.model.City;
import com.voyage.backend.model.Country;
import com.voyage.backend.repository.CityRepository;
import com.voyage.backend.repository.CountryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CountryService {

    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;

    public CountryService(CountryRepository countryRepository, CityRepository cityRepository) {
        this.countryRepository = countryRepository;
        this.cityRepository = cityRepository;
    }

    public List<Country> getAllCountries(boolean popularOnly) {
        return popularOnly ? countryRepository.findByPopularTrue() : countryRepository.findAll();
    }

    public CountryDetailResponse getCountryDetail(String code) {
        Country country = countryRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Country not found: " + code));

        List<City> cities = cityRepository.findByCountryCode(country.getCode());

        List<CountryDetailResponse.CityBrief> cityBriefs = cities.stream()
                .map(c -> CountryDetailResponse.CityBrief.builder()
                        .id(c.getId())
                        .code(c.getCode())
                        .name(c.getName())
                        .heroImageUrl(c.getHeroImageUrl())
                        .latitude(c.getLatitude())
                        .longitude(c.getLongitude())
                        .build())
                .toList();

        return CountryDetailResponse.builder()
                .id(country.getId())
                .name(country.getName())
                .code(country.getCode())
                .continent(country.getContinent())
                .description(country.getDescription())
                .heroImageUrl(country.getHeroImageUrl())
                .currency(country.getCurrency())
                .language(country.getLanguage())
                .timezone(country.getTimezone())
                .popular(country.isPopular())
                .cities(cityBriefs)
                .build();
    }
}

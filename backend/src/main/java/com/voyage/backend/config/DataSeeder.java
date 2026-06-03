package com.voyage.backend.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.voyage.backend.model.*;
import com.voyage.backend.repository.*;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Loads countries, cities, and landmarks from JSON files in src/main/resources/data/.
 * Each file is only applied if the corresponding table is empty.
 * Safe to re-run on restart — existing records are skipped by unique code/name checks.
 */
@Component
@Order(10)
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;
    private final LandmarkRepository landmarkRepository;
    private final PackageRepository packageRepository;
    private final DayPlanRepository dayPlanRepository;
    private final ObjectMapper objectMapper;

    public DataSeeder(CountryRepository countryRepository,
                      CityRepository cityRepository,
                      LandmarkRepository landmarkRepository,
                      PackageRepository packageRepository,
                      DayPlanRepository dayPlanRepository,
                      ObjectMapper objectMapper) {
        this.countryRepository = countryRepository;
        this.cityRepository = cityRepository;
        this.landmarkRepository = landmarkRepository;
        this.packageRepository = packageRepository;
        this.dayPlanRepository = dayPlanRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        seedCountries();
        seedCities();
        seedLandmarks();
        seedPackages();
    }

    @Transactional
    protected void seedCountries() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/countries.json");
        if (!resource.exists()) {
            log.info("data/countries.json not found — skipping country seed");
            return;
        }
        try (InputStream is = resource.getInputStream()) {
            List<CountrySeed> seeds = objectMapper.readValue(is, new TypeReference<>() {});
            int added = 0;
            for (CountrySeed s : seeds) {
                if (countryRepository.existsByCode(s.getCode())) continue;
                countryRepository.save(Country.builder()
                        .name(s.getName())
                        .code(s.getCode())
                        .continent(s.getContinent())
                        .description(s.getDescription())
                        .heroImageUrl(s.getHeroImageUrl())
                        .currency(s.getCurrency())
                        .language(s.getLanguage())
                        .timezone(s.getTimezone())
                        .popular(s.isPopular())
                        .build());
                added++;
            }
            if (added > 0) log.info("Seeded {} countries", added);
        }
    }

    @Transactional
    protected void seedCities() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/cities.json");
        if (!resource.exists()) {
            log.info("data/cities.json not found — skipping city seed");
            return;
        }
        try (InputStream is = resource.getInputStream()) {
            List<CitySeed> seeds = objectMapper.readValue(is, new TypeReference<>() {});
            int added = 0;
            for (CitySeed s : seeds) {
                if (cityRepository.existsByCode(s.getCode())) continue;
                Country country = countryRepository.findByCode(s.getCountryCode()).orElse(null);
                if (country == null) {
                    log.warn("City {} references unknown country code {} — skipped", s.getCode(), s.getCountryCode());
                    continue;
                }
                cityRepository.save(City.builder()
                        .code(s.getCode())
                        .name(s.getName())
                        .countryCode(s.getCountryCode())
                        .country(country)
                        .description(s.getDescription())
                        .heroImageUrl(s.getHeroImageUrl())
                        .latitude(s.getLatitude())
                        .longitude(s.getLongitude())
                        .popularActivities(s.getPopularActivities() != null ? s.getPopularActivities() : new ArrayList<>())
                        .build());
                added++;
            }
            if (added > 0) log.info("Seeded {} cities", added);
        }
    }

    @Transactional
    protected void seedLandmarks() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/landmarks.json");
        if (!resource.exists()) {
            log.info("data/landmarks.json not found — skipping landmark seed");
            return;
        }
        try (InputStream is = resource.getInputStream()) {
            List<LandmarkSeed> seeds = objectMapper.readValue(is, new TypeReference<>() {});
            int added = 0;
            for (LandmarkSeed s : seeds) {
                if (landmarkRepository.existsByNameAndCityCode(s.getName(), s.getCityCode())) continue;
                City city = cityRepository.findByCode(s.getCityCode()).orElse(null);
                if (city == null) {
                    log.warn("Landmark '{}' references unknown city code {} — skipped", s.getName(), s.getCityCode());
                    continue;
                }
                landmarkRepository.save(Landmark.builder()
                        .name(s.getName())
                        .cityCode(s.getCityCode())
                        .city(city)
                        .description(s.getDescription())
                        .imageUrl(s.getImageUrl())
                        .latitude(s.getLatitude())
                        .longitude(s.getLongitude())
                        .category(s.getCategory())
                        .hiddenGem(s.isHiddenGem())
                        .build());
                added++;
            }
            if (added > 0) log.info("Seeded {} landmarks", added);
        }
    }

    @Transactional
    protected void seedPackages() throws Exception {
        ClassPathResource resource = new ClassPathResource("data/packages.json");
        if (!resource.exists()) {
            log.info("data/packages.json not found — skipping package seed");
            return;
        }
        try (InputStream is = resource.getInputStream()) {
            List<PackageSeed> seeds = objectMapper.readValue(is, new TypeReference<>() {});
            int added = 0;
            for (PackageSeed s : seeds) {
                if (packageRepository.existsByName(s.getName())) continue;
                TravelPackage pkg = packageRepository.save(TravelPackage.builder()
                        .name(s.getName())
                        .description(s.getDescription())
                        .heroImageUrl(s.getHeroImageUrl())
                        .originCityCode(s.getOriginCityCode())
                        .destinationCityCode(s.getDestinationCityCode())
                        .nights(s.getNights())
                        .pricePerPerson(s.getPricePerPerson())
                        .totalPrice(s.getTotalPrice())
                        .currency("EGP")
                        .inclusions(s.getInclusions() != null ? s.getInclusions() : new ArrayList<>())
                        .build());
                if (s.getItinerary() != null) {
                    for (DayPlanSeed dp : s.getItinerary()) {
                        dayPlanRepository.save(DayPlan.builder()
                                .travelPackage(pkg)
                                .dayNumber(dp.getDayNumber())
                                .title(dp.getTitle())
                                .description(dp.getDescription())
                                .activities(dp.getActivities() != null ? dp.getActivities() : new ArrayList<>())
                                .build());
                    }
                }
                added++;
            }
            if (added > 0) log.info("Seeded {} packages", added);
        }
    }

    // ── Seed DTOs ──────────────────────────────────────────────────────────────

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CountrySeed {
        private String name;
        private String code;
        private String continent;
        private String description;
        private String heroImageUrl;
        private String currency;
        private String language;
        private String timezone;
        private boolean popular;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CitySeed {
        private String code;
        private String name;
        private String countryCode;
        private String description;
        private String heroImageUrl;
        private Double latitude;
        private Double longitude;
        private List<String> popularActivities;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LandmarkSeed {
        private String name;
        private String cityCode;
        private String description;
        private String imageUrl;
        private Double latitude;
        private Double longitude;
        private String category;
        private boolean hiddenGem;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PackageSeed {
        private String name;
        private String description;
        private String heroImageUrl;
        private String originCityCode;
        private String destinationCityCode;
        private Integer nights;
        private Double pricePerPerson;
        private Double totalPrice;
        private String currency;
        private List<String> inclusions;
        private List<DayPlanSeed> itinerary;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DayPlanSeed {
        private Integer dayNumber;
        private String title;
        private String description;
        private List<String> activities;
    }
}

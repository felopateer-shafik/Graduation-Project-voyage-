package com.voyage.backend.service;

import com.voyage.backend.dto.PackageDetailResponse;
import com.voyage.backend.exception.ResourceNotFoundException;
import com.voyage.backend.model.City;
import com.voyage.backend.model.DayPlan;
import com.voyage.backend.model.TravelPackage;
import com.voyage.backend.repository.CityRepository;
import com.voyage.backend.repository.DayPlanRepository;
import com.voyage.backend.repository.PackageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class PackageService {

    private final PackageRepository packageRepository;
    private final DayPlanRepository dayPlanRepository;
    private final CityRepository cityRepository;

    public PackageService(PackageRepository packageRepository,
                          DayPlanRepository dayPlanRepository,
                          CityRepository cityRepository) {
        this.packageRepository = packageRepository;
        this.dayPlanRepository = dayPlanRepository;
        this.cityRepository = cityRepository;
    }

    @Transactional(readOnly = true)
    public List<TravelPackage> listPackages(String origin, String destination) {
        String normalizedOrigin = resolveCitySearchTerm(origin);
        String normalizedDestination = resolveCitySearchTerm(destination);
        if (normalizedOrigin != null && normalizedDestination != null) {
            return packageRepository.searchByOriginAndDestination(normalizedOrigin, normalizedDestination);
        }
        if (normalizedDestination != null) {
            return packageRepository.searchByDestination(normalizedDestination);
        }
        return packageRepository.findByActiveTrueOrderByIdDesc();
    }

    private String resolveCitySearchTerm(String value) {
        String normalized = normalize(value);
        if (normalized == null) {
            return null;
        }

        String codeCandidate = normalized.toUpperCase(Locale.ROOT);
        return cityRepository.findByCode(codeCandidate)
                .or(() -> cityRepository.findFirstByNameContainingIgnoreCase(normalized))
                .map(City::getCode)
                .orElse(normalized);
    }

    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    public PackageDetailResponse getPackageDetail(Long id) {
        TravelPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found"));

        List<DayPlan> dayPlans = dayPlanRepository.findByTravelPackageOrderByDayNumberAsc(pkg);

        List<PackageDetailResponse.DayPlanDto> itinerary = dayPlans.stream()
                .map(dp -> PackageDetailResponse.DayPlanDto.builder()
                        .dayNumber(dp.getDayNumber())
                        .title(dp.getTitle())
                        .description(dp.getDescription())
                        .activities(dp.getActivities())
                        .build())
                .collect(Collectors.toList());

        return PackageDetailResponse.builder()
                .id(pkg.getId())
                .name(pkg.getName())
                .description(pkg.getDescription())
                .heroImageUrl(pkg.getHeroImageUrl())
                .originCityCode(pkg.getOriginCityCode())
                .destinationCityCode(pkg.getDestinationCityCode())
                .startDate(pkg.getStartDate())
                .endDate(pkg.getEndDate())
                .nights(pkg.getNights())
                .pricePerPerson(pkg.getPricePerPerson())
                .totalPrice(pkg.getTotalPrice())
                .currency(pkg.getCurrency())
                .active(pkg.getActive())
                .inclusions(pkg.getInclusions())
                .itinerary(itinerary)
                .build();
    }
}

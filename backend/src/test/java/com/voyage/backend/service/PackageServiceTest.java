package com.voyage.backend.service;

import com.voyage.backend.model.City;
import com.voyage.backend.model.TravelPackage;
import com.voyage.backend.repository.CityRepository;
import com.voyage.backend.repository.DayPlanRepository;
import com.voyage.backend.repository.PackageRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PackageServiceTest {

    private final PackageRepository packageRepository = mock(PackageRepository.class);
    private final DayPlanRepository dayPlanRepository = mock(DayPlanRepository.class);
    private final CityRepository cityRepository = mock(CityRepository.class);
    private final PackageService packageService = new PackageService(
            packageRepository,
            dayPlanRepository,
            cityRepository
    );

    @Test
    void listPackagesResolvesDestinationCityNameBeforeSearchingPackages() {
        TravelPackage dubaiPackage = TravelPackage.builder()
                .id(20L)
                .name("Dubai Escape")
                .destinationCityCode("DXB")
                .build();

        when(cityRepository.findByCode("DUBAI")).thenReturn(Optional.empty());
        when(cityRepository.findFirstByNameContainingIgnoreCase("Dubai"))
                .thenReturn(Optional.of(City.builder().code("DXB").name("Dubai").build()));
        when(packageRepository.searchByDestination("DXB")).thenReturn(List.of(dubaiPackage));

        List<TravelPackage> results = packageService.listPackages(null, "Dubai");

        assertThat(results).containsExactly(dubaiPackage);
        verify(packageRepository).searchByDestination("DXB");
    }

    @Test
    void listPackagesResolvesOriginAndDestinationCityNamesBeforeSearchingPackages() {
        TravelPackage packageToDubai = TravelPackage.builder()
                .id(21L)
                .name("Cairo to Dubai")
                .originCityCode("CAI")
                .destinationCityCode("DXB")
                .build();

        when(cityRepository.findByCode("CAIRO")).thenReturn(Optional.empty());
        when(cityRepository.findByCode("DUBAI")).thenReturn(Optional.empty());
        when(cityRepository.findFirstByNameContainingIgnoreCase("Cairo"))
                .thenReturn(Optional.of(City.builder().code("CAI").name("Cairo").build()));
        when(cityRepository.findFirstByNameContainingIgnoreCase("Dubai"))
                .thenReturn(Optional.of(City.builder().code("DXB").name("Dubai").build()));
        when(packageRepository.searchByOriginAndDestination("CAI", "DXB"))
                .thenReturn(List.of(packageToDubai));

        List<TravelPackage> results = packageService.listPackages("Cairo", "Dubai");

        assertThat(results).containsExactly(packageToDubai);
        verify(packageRepository).searchByOriginAndDestination("CAI", "DXB");
    }
}

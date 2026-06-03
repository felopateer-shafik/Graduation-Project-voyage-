package com.voyage.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackageDetailResponse {
    private Long id;
    private String name;
    private String description;
    private String heroImageUrl;
    private String originCityCode;
    private String destinationCityCode;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer nights;
    private Double pricePerPerson;
    private Double totalPrice;
    private String currency;
    private Boolean active;
    private List<String> inclusions;
    private List<DayPlanDto> itinerary;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DayPlanDto {
        private Integer dayNumber;
        private String title;
        private String description;
        private List<String> activities;
    }
}

package com.voyage.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CountryDetailResponse {

    private Long id;
    private String name;
    private String code;
    private String continent;
    private String description;
    private String heroImageUrl;
    private String currency;
    private String language;
    private String timezone;
    private boolean popular;
    private List<CityBrief> cities;

    @Data
    @Builder
    public static class CityBrief {
        private Long id;
        private String code;
        private String name;
        private String heroImageUrl;
        private Double latitude;
        private Double longitude;
    }
}

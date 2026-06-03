package com.voyage.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CityDetailResponse {

    private Long id;
    private String code;
    private String name;
    private String countryCode;
    private String description;
    private String heroImageUrl;
    private Double latitude;
    private Double longitude;
    private List<String> popularActivities;
    private List<LandmarkBrief> landmarks;

    @Data
    @Builder
    public static class LandmarkBrief {
        private Long id;
        private String name;
        private String cityCode;
        private String description;
        private String imageUrl;
        private Double latitude;
        private Double longitude;
        private String category;
        private boolean hiddenGem;
    }
}

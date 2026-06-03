package com.voyage.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private String targetType;
    private Long targetId;
    private int rating;
    private String title;
    private String body;
    private Instant createdAt;
    private Long userId;
    private String userFullName;
    private String userAvatarUrl;
}

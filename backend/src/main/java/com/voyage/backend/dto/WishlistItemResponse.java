package com.voyage.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WishlistItemResponse {
    private Long id;
    private String type;
    private Object item; // The actual Flight, Hotel, or Tour object
}

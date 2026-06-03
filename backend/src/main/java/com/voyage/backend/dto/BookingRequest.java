package com.voyage.backend.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long hotelId;
    private Long flightId;
    private Long tourId;
    private Long packageId;
    private Integer rooms;
    private Integer days;
    private Integer guests;
    private String paymentMethod;
    private VisaPaymentRequest paymentDetails;
}

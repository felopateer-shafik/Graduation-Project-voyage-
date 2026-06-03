package com.voyage.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class VisaPaymentRequest {
    @NotBlank
    private String cardNumber;
    @NotBlank
    private String expiryDate;
    @NotBlank
    private String cvv;
    @NotBlank
    private String cardHolderName;
}

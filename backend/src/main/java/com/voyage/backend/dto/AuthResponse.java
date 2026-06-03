package com.voyage.backend.dto;

import com.voyage.backend.model.User;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private User user;
    private String message;
    private String email;

    // 1. Constructor للـ Registration والـ OTP (رسالة وإيميل)
    public AuthResponse(String message, String email) {
        this.message = message;
        this.email = email;
    }

    // 2. Constructor للـ Login وجوجل (توكن ويوزر)
    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }

    // 3. Constructor للـ Verification (توكن ويوزر ورسالة) - ده اللي هيحل مشكلتك حالاً
    public AuthResponse(String token, User user, String message) {
        this.token = token;
        this.user = user;
        this.message = message;
    }
}
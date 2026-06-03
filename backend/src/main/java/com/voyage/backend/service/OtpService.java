package com.voyage.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private final SecureRandom random = new SecureRandom();

    /**
     * Generate a 6-digit OTP code.
     */
    public String generateOtp() {
        int otp = 100000 + random.nextInt(900000);
        String otpCode = String.valueOf(otp);
        log.info("═══════════════════════════════════════");
        log.info("  Generated OTP: {}", otpCode);
        log.info("═══════════════════════════════════════");
        return otpCode;
    }

    /**
     * Verify the provided OTP against the stored one.
     */
    public boolean verifyOtp(String storedOtp, String providedOtp) {
        if (storedOtp == null || providedOtp == null) {
            return false;
        }
        return storedOtp.equals(providedOtp);
    }
}

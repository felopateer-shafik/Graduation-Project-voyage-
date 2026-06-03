package com.voyage.backend.service;

import com.voyage.backend.dto.AuthResponse;
import com.voyage.backend.exception.BadRequestException;
import com.voyage.backend.model.User;
import com.voyage.backend.repository.UserRepository;
import com.voyage.backend.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final JwtUtil jwtUtil = mock(JwtUtil.class);
    private final OtpService otpService = mock(OtpService.class);
    private final EmailService emailService = mock(EmailService.class);
    private final AuthService authService = new AuthService(
            userRepository,
            passwordEncoder,
            jwtUtil,
            otpService,
            emailService
    );

    @Test
    void resendOtpRefreshesCodeForUnverifiedUser() {
        User user = User.builder()
                .id(1L)
                .email("ali@example.com")
                .fullName("Ali Shams")
                .password("encoded")
                .emailVerified(false)
                .build();

        when(userRepository.findByEmail("ali@example.com")).thenReturn(Optional.of(user));
        when(otpService.generateOtp()).thenReturn("123456");

        AuthResponse response = authService.resendOtp("ali@example.com");

        assertThat(response.getEmail()).isEqualTo("ali@example.com");
        assertThat(user.getOtpCode()).isEqualTo("123456");
        assertThat(user.getOtpExpiresAt()).isNotNull();
        verify(userRepository).save(user);
        verify(emailService).sendOtpEmail("ali@example.com", "123456");
    }

    @Test
    void resendOtpRejectsAlreadyVerifiedUser() {
        User user = User.builder()
                .id(1L)
                .email("ali@example.com")
                .fullName("Ali Shams")
                .password("encoded")
                .emailVerified(true)
                .build();

        when(userRepository.findByEmail("ali@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.resendOtp("ali@example.com"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already verified");
    }
}


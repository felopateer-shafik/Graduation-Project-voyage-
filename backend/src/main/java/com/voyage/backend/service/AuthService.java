package com.voyage.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.voyage.backend.dto.*;
import com.voyage.backend.exception.BadRequestException;
import com.voyage.backend.exception.ResourceNotFoundException;
import com.voyage.backend.model.User;
import com.voyage.backend.model.enums.LoyaltyTier;
import com.voyage.backend.repository.UserRepository;
import com.voyage.backend.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    // الـ Client ID الخاص بمشروعك (Voyga) لضمان الربط الصحيح مع جوجل
    private static final String GOOGLE_CLIENT_ID = "383857845928-arkhkpea7flg4bq2po0t77cihsk1pd7l.apps.googleusercontent.com";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       OtpService otpService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.otpService = otpService;
        this.emailService = emailService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            User existing = userRepository.findByEmail(request.getEmail()).orElse(null);
            if (existing != null && !existing.getEmailVerified()) {
                String otp = otpService.generateOtp();
                existing.setOtpCode(otp);
                existing.setOtpExpiresAt(LocalDateTime.now().plusMinutes(10));
                userRepository.save(existing);
                emailService.sendOtpEmail(existing.getEmail(), otp);
                return new AuthResponse("OTP sent to your email", request.getEmail());
            }
            throw new BadRequestException("Email already registered");
        }

        String otp = otpService.generateOtp();
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .emailVerified(false)
                .otpCode(otp)
                .otpExpiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        userRepository.save(user);
        emailService.sendOtpEmail(user.getEmail(), otp);
        log.info("New user registered: {}", user.getEmail());

        return new AuthResponse("Registration successful! Please verify your email.", user.getEmail());
    }

    @Transactional
    public AuthResponse resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getEmailVerified()) {
            throw new BadRequestException("Email is already verified");
        }

        String otp = otpService.generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);
        emailService.sendOtpEmail(user.getEmail(), otp);

        return new AuthResponse("A new verification code has been sent to your email", user.getEmail());
    }

    @Transactional
    public AuthResponse verifyOtp(OtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getEmailVerified()) {
            throw new BadRequestException("Email already verified");
        }

        if (user.getOtpExpiresAt() != null && user.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired. Please request a new one.");
        }

        if (!otpService.verifyOtp(user.getOtpCode(), request.getOtpCode())) {
            throw new BadRequestException("Invalid OTP code");
        }

        user.setEmailVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiresAt(null);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        log.info("User verified: {}", user.getEmail());

        return new AuthResponse(token, user, "Account verified successfully!");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.getEmailVerified()) {
            throw new BadRequestException("Please verify your email first");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        log.info("User logged in: {}", user.getEmail());

        return new AuthResponse(token, user);
    }

    /**
     * التحقق من توكن جوجل وإنشاء جلسة عمل (Session) للمستخدم
     */
    public AuthResponse loginWithGoogle(String googleToken) {
        try {
            // التحقق من صحة التوكن المبعوث من الفرونت إند
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(googleToken);

            if (idToken == null) {
                log.error("Google login failed: Invalid ID Token");
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google Token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            // إذا كان المستخدم موجوداً، يتم تسجيل دخوله، وإلا يتم إنشاء حساب جديد
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                log.info("Provisioning new Google user: {}", email);
                User newUser = User.builder()
                        .fullName(name)
                        .email(email)
                        .profilePictureUrl(pictureUrl)
                        // نضع كلمة سر عشوائية لأن المستخدم يسجل عبر جوجل
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .emailVerified(true)
                        .walletBalance(0.0)
                        .loyaltyPoints(0)
                        .tier(LoyaltyTier.BRONZE)
                        .createdAt(LocalDateTime.now())
                        .build();
                return userRepository.save(newUser);
            });

            // توليد الـ JWT الخاص بنظامنا (Voyga Token)
            String systemToken = jwtUtil.generateToken(user.getId(), user.getEmail());
            log.info("Google Auth Success: {}", email);

            return new AuthResponse(systemToken, user);

        } catch (Exception e) {
            log.error("Google authentication error: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google login failed: " + e.getMessage());
        }
    }

    public User getCurrentUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public User updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = getCurrentUser(userId);
        user.setFullName(request.getFullName());
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        return userRepository.save(user);
    }

    @Transactional
    public User updateProfilePicture(Long userId, MultipartFile file, StorageService storageService) throws IOException {
        User user = getCurrentUser(userId);
        if (user.getProfilePictureUrl() != null) {
            storageService.deleteAvatar(user.getProfilePictureUrl());
        }
        String url = storageService.uploadAvatar(userId, file);
        user.setProfilePictureUrl(url);
        return userRepository.save(user);
    }

    @Transactional
    public User removeProfilePicture(Long userId, StorageService storageService) {
        User user = getCurrentUser(userId);
        if (user.getProfilePictureUrl() != null) {
            storageService.deleteAvatar(user.getProfilePictureUrl());
            user.setProfilePictureUrl(null);
            userRepository.save(user);
        }
        return user;
    }
}
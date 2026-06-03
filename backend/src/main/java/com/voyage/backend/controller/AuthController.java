package com.voyage.backend.controller;

import com.voyage.backend.dto.*;
import com.voyage.backend.model.User;
import com.voyage.backend.service.AuthService;
import com.voyage.backend.service.StorageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final StorageService storageService;

    public AuthController(AuthService authService, StorageService storageService) {
        this.authService = authService;
        this.storageService = storageService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody OtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).build();
        }
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(authService.getCurrentUser(userId));
    }

    @PostMapping("/login/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        String idtoken = request.get("token");
        AuthResponse response = authService.loginWithGoogle(idtoken);
        return ResponseEntity.ok(response);
    }

    // ─── Profile Update ───
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(Authentication authentication,
                                               @RequestBody ProfileUpdateRequest request) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).build();
        }
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(authService.updateProfile(userId, request));
    }

    // ─── Profile Picture Upload ───
    @PostMapping("/profile/picture")
    public ResponseEntity<User> uploadProfilePicture(Authentication authentication,
                                                      @RequestParam("file") MultipartFile file) throws IOException {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).build();
        }
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(authService.updateProfilePicture(userId, file, storageService));
    }

    // ─── Profile Picture Delete ───
    @DeleteMapping("/profile/picture")
    public ResponseEntity<User> deleteProfilePicture(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).build();
        }
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(authService.removeProfilePicture(userId, storageService));
    }
}
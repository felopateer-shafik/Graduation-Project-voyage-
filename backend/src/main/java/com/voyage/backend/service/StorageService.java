package com.voyage.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.Locale;

@Service
public class StorageService {

    private static final List<String> ALLOWED_EXTENSIONS = List.of("jpg", "jpeg", "png", "webp");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    private final Path uploadRoot;
    private final String publicBaseUrl;

    public StorageService(@Value("${storage.local.upload-dir:uploads}") String uploadDir,
                          @Value("${app.public-base-url:http://localhost:8080/api}") String publicBaseUrl) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.publicBaseUrl = stripTrailingSlash(publicBaseUrl);
    }

    public boolean isConfigured() {
        return true;
    }

    public Path getUploadRoot() {
        return uploadRoot;
    }

    public String uploadAvatar(Long userId, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size must not exceed 5 MB.");
        }

        String ext = extensionFor(file);
        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            throw new IllegalArgumentException("Only jpg, jpeg, png, and webp images are accepted.");
        }

        Path avatarDir = uploadRoot.resolve("avatars");
        Files.createDirectories(avatarDir);

        String filename = "user-%d-%d.%s".formatted(userId, Instant.now().toEpochMilli(), ext);
        Path target = avatarDir.resolve(filename).normalize();
        if (!target.startsWith(avatarDir)) {
            throw new IllegalArgumentException("Invalid file name.");
        }

        Files.copy(file.getInputStream(), target);
        return publicBaseUrl + "/uploads/avatars/" + filename;
    }

    public void deleteAvatar(String publicUrl) {
        if (publicUrl == null || publicUrl.isBlank()) return;
        String marker = "/uploads/avatars/";
        int markerIndex = publicUrl.indexOf(marker);
        if (markerIndex < 0) return;

        String filename = publicUrl.substring(markerIndex + marker.length());
        Path target = uploadRoot.resolve("avatars").resolve(filename).normalize();
        Path avatarDir = uploadRoot.resolve("avatars").normalize();
        if (!target.startsWith(avatarDir)) return;

        try {
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // Deleting a stale avatar is best-effort and should not block profile updates.
        }
    }

    private String extensionFor(MultipartFile file) {
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "avatar";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == originalFilename.length() - 1) {
            return "jpg";
        }
        return originalFilename.substring(dotIndex + 1).toLowerCase(Locale.ROOT);
    }

    private String stripTrailingSlash(String value) {
        if (value == null || value.isBlank()) {
            return "http://localhost:8080/api";
        }
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }
}

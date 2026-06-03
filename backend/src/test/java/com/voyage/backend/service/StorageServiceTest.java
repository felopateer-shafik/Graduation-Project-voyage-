package com.voyage.backend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class StorageServiceTest {

    @TempDir
    Path tempDir;

    @Test
    void uploadAvatarStoresFileLocallyAndReturnsPublicUrl() throws Exception {
        StorageService storageService = new StorageService(tempDir.toString(), "http://localhost:8080/api");
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "avatar.png",
                "image/png",
                "fake image".getBytes()
        );

        String url = storageService.uploadAvatar(42L, file);

        assertThat(url).startsWith("http://localhost:8080/api/uploads/avatars/user-42-");
        assertThat(url).endsWith(".png");
        assertThat(Files.list(tempDir.resolve("avatars")).toList()).hasSize(1);
    }

    @Test
    void deleteAvatarRemovesLocalFileForReturnedUrl() throws Exception {
        StorageService storageService = new StorageService(tempDir.toString(), "http://localhost:8080/api");
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "avatar.webp",
                "image/webp",
                "fake image".getBytes()
        );
        String url = storageService.uploadAvatar(42L, file);

        storageService.deleteAvatar(url);

        assertThat(Files.list(tempDir.resolve("avatars")).toList()).isEmpty();
    }

    @Test
    void uploadAvatarRejectsUnsupportedExtension() {
        StorageService storageService = new StorageService(tempDir.toString(), "http://localhost:8080/api");
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "avatar.gif",
                "image/gif",
                "fake image".getBytes()
        );

        assertThatThrownBy(() -> storageService.uploadAvatar(42L, file))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Only jpg, jpeg, png, and webp");
    }
}

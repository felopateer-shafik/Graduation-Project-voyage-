package com.voyage.backend.controller;

import com.voyage.backend.dto.WishlistItemResponse;
import com.voyage.backend.dto.WishlistRequest;
import com.voyage.backend.service.WishlistService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    private Long getUserId(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof Long userId) {
            return userId;
        }
        return Long.parseLong(authentication.getName());
    }

    @PostMapping("/add")
    public ResponseEntity<WishlistItemResponse> addItem(Authentication authentication, 
                                                        @Valid @RequestBody WishlistRequest request) {
        return ResponseEntity.ok(wishlistService.addItem(getUserId(authentication), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<WishlistItemResponse>> getMyWishlist(Authentication authentication) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(getUserId(authentication)));
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Void> removeItem(Authentication authentication, @PathVariable Long id) {
        wishlistService.removeItem(getUserId(authentication), id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearWishlist(Authentication authentication) {
        wishlistService.clearUserWishlist(getUserId(authentication));
        return ResponseEntity.noContent().build();
    }
}

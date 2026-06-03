package com.voyage.backend.service;

import com.voyage.backend.dto.WishlistItemResponse;
import com.voyage.backend.dto.WishlistRequest;
import com.voyage.backend.exception.ResourceNotFoundException;
import com.voyage.backend.model.User;
import com.voyage.backend.model.WishlistItem;
import com.voyage.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final FlightRepository flightRepository;
    private final HotelRepository hotelRepository;
    private final TourRepository tourRepository;
    private final PackageRepository packageRepository;

    public WishlistService(WishlistRepository wishlistRepository,
                           UserRepository userRepository,
                           FlightRepository flightRepository,
                           HotelRepository hotelRepository,
                           TourRepository tourRepository,
                           PackageRepository packageRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.flightRepository = flightRepository;
        this.hotelRepository = hotelRepository;
        this.tourRepository = tourRepository;
        this.packageRepository = packageRepository;
    }

    @Transactional
    public WishlistItemResponse addItem(Long userId, WishlistRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if already exists
        wishlistRepository.findByUserIdAndItemTypeAndItemId(userId, request.getType(), request.getItemId())
                .ifPresent(w -> {
                    throw new IllegalStateException("Item already in wishlist");
                });

        WishlistItem item = WishlistItem.builder()
                .user(user)
                .itemType(request.getType())
                .itemId(request.getItemId())
                .build();

        WishlistItem saved = wishlistRepository.save(item);
        return mapToResponse(saved);
    }

    public List<WishlistItemResponse> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserIdOrderByAddedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void clearUserWishlist(Long userId) {
        wishlistRepository.deleteByUserId(userId);
    }

    @Transactional
    public void removeItem(Long userId, Long itemId) {
        WishlistItem item = wishlistRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist item not found"));
        wishlistRepository.delete(item);
    }

    private WishlistItemResponse mapToResponse(WishlistItem item) {
        Object itemData = null;
        if ("flight".equalsIgnoreCase(item.getItemType())) {
            itemData = flightRepository.findById(item.getItemId()).orElse(null);
        } else if ("hotel".equalsIgnoreCase(item.getItemType())) {
            itemData = hotelRepository.findById(item.getItemId()).orElse(null);
        } else if ("tour".equalsIgnoreCase(item.getItemType())) {
            itemData = tourRepository.findById(item.getItemId()).orElse(null);
        } else if ("package".equalsIgnoreCase(item.getItemType())) {
            itemData = packageRepository.findById(item.getItemId()).orElse(null);
        }

        return WishlistItemResponse.builder()
                .id(item.getId()) // This is the Wishlist item ID
                .type(item.getItemType())
                .item(itemData)
                .build();
    }
}

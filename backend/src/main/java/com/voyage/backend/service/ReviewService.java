package com.voyage.backend.service;

import com.voyage.backend.dto.ReviewRequest;
import com.voyage.backend.dto.ReviewResponse;
import com.voyage.backend.exception.ResourceNotFoundException;
import com.voyage.backend.model.Review;
import com.voyage.backend.model.User;
import com.voyage.backend.model.enums.BookingStatus;
import com.voyage.backend.repository.BookingRepository;
import com.voyage.backend.repository.ReviewRepository;
import com.voyage.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         UserRepository userRepository,
                         BookingRepository bookingRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<ReviewResponse> getReviews(String targetType, Long targetId) {
        return reviewRepository
                .findByTargetTypeAndTargetIdOrderByCreatedAtDesc(targetType.toUpperCase(), targetId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewResponse addReview(Long userId, ReviewRequest request) {
        String type = request.getTargetType().toUpperCase();

        // Eligibility: must have a confirmed paid booking for this target
        boolean eligible = switch (type) {
            case "HOTEL"   -> bookingRepository.existsPaidBookingForHotel(userId, request.getTargetId(), BookingStatus.CONFIRMED);
            case "TOUR"    -> bookingRepository.existsPaidBookingForTour(userId, request.getTargetId(), BookingStatus.CONFIRMED);
            case "PACKAGE" -> bookingRepository.existsPaidBookingForPackage(userId, request.getTargetId(), BookingStatus.CONFIRMED);
            default        -> false;
        };
        if (!eligible) {
            throw new IllegalStateException("You need a confirmed booking to review this item.");
        }

        // One review per user per target
        if (reviewRepository.existsByUserIdAndTargetTypeAndTargetId(userId, type, request.getTargetId())) {
            throw new IllegalStateException("You have already reviewed this item.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = Review.builder()
                .user(user)
                .targetType(type)
                .targetId(request.getTargetId())
                .rating(request.getRating())
                .title(request.getTitle())
                .body(request.getBody())
                .build();

        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(Long userId, Long reviewId) {
        Review review = reviewRepository.findByIdAndUserId(reviewId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        reviewRepository.delete(review);
    }

    private ReviewResponse toResponse(Review r) {
        User u = r.getUser();
        return ReviewResponse.builder()
                .id(r.getId())
                .targetType(r.getTargetType())
                .targetId(r.getTargetId())
                .rating(r.getRating())
                .title(r.getTitle())
                .body(r.getBody())
                .createdAt(r.getCreatedAt())
                .userId(u.getId())
                .userFullName(u.getFullName())
                .userAvatarUrl(u.getProfilePictureUrl())
                .build();
    }
}

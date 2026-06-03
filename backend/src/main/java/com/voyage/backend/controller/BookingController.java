package com.voyage.backend.controller;

import com.voyage.backend.dto.BookingRequest;
import com.voyage.backend.dto.VisaPaymentRequest;
import com.voyage.backend.model.Booking;
import com.voyage.backend.model.PriceFreeze;
import com.voyage.backend.model.User;
import com.voyage.backend.repository.PriceFreezeRepository;
import com.voyage.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final PriceFreezeRepository priceFreezeRepository;

    public BookingController(BookingService bookingService, PriceFreezeRepository priceFreezeRepository) {
        this.bookingService = bookingService;
        this.priceFreezeRepository = priceFreezeRepository;
    }

    private Long getUserId(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }

    @PostMapping("/add")
    public ResponseEntity<Booking> createBooking(Authentication authentication, @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(getUserId(authentication), request));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getUserBookings(getUserId(authentication)));
    }

    @PostMapping("/{id}/checkout")
    public ResponseEntity<Booking> checkoutWallet(Authentication authentication, 
                                                  @PathVariable Long id, 
                                                  @RequestParam String method) {
        if ("WALLET".equalsIgnoreCase(method)) {
            return ResponseEntity.ok(bookingService.checkoutWithWallet(getUserId(authentication), id));
        }
        throw new IllegalArgumentException("Unsupported payment method: " + method);
    }

    @PutMapping("/{id}/checkout/visa")
    public ResponseEntity<Booking> checkoutVisa(Authentication authentication, 
                                                @PathVariable Long id, 
                                                @Valid @RequestBody VisaPaymentRequest request) {
        return ResponseEntity.ok(bookingService.checkoutWithVisa(getUserId(authentication), id));
    }

    @PutMapping("/services/{id}/cancel")
    public ResponseEntity<Booking> cancelService(Authentication authentication, 
                                                 @PathVariable Long id, 
                                                 @RequestParam String type) {
        return ResponseEntity.ok(bookingService.cancelService(getUserId(authentication), id, type));
    }

    @PutMapping("/wallet/topup")
    public ResponseEntity<User> topUpWallet(Authentication authentication, @RequestParam Double amount) {
        return ResponseEntity.ok(bookingService.topUpWallet(getUserId(authentication), amount));
    }

    @PostMapping("/freeze")
    public ResponseEntity<PriceFreeze> freezePrice(Authentication authentication, @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.freezePrice(getUserId(authentication), request));
    }

    @GetMapping("/my-freezes")
    public ResponseEntity<List<PriceFreeze>> getMyFreezes(Authentication authentication) {
        return ResponseEntity.ok(priceFreezeRepository.findByUserIdAndActiveTrue(getUserId(authentication)));
    }

    @GetMapping("/planner")
    public ResponseEntity<List<Booking>> getPlanner(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getUserBookings(getUserId(authentication)));
    }
}

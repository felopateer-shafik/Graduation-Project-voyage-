package com.voyage.backend.service;

import com.voyage.backend.dto.BookingRequest;
import com.voyage.backend.dto.VisaPaymentRequest;
import com.voyage.backend.exception.ResourceNotFoundException;
import com.voyage.backend.model.*;
import com.voyage.backend.model.enums.BookingStatus;
import com.voyage.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final HotelRepository hotelRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;
    private final PriceFreezeRepository priceFreezeRepository;
    private final LoyaltyService loyaltyService;
    private final PackageRepository packageRepository;

    public BookingService(BookingRepository bookingRepository,
                          FlightRepository flightRepository,
                          HotelRepository hotelRepository,
                          TourRepository tourRepository,
                          UserRepository userRepository,
                          PriceFreezeRepository priceFreezeRepository,
                          LoyaltyService loyaltyService,
                          PackageRepository packageRepository) {
        this.bookingRepository = bookingRepository;
        this.flightRepository = flightRepository;
        this.hotelRepository = hotelRepository;
        this.tourRepository = tourRepository;
        this.userRepository = userRepository;
        this.priceFreezeRepository = priceFreezeRepository;
        this.loyaltyService = loyaltyService;
        this.packageRepository = packageRepository;
    }

    @Transactional
    public Booking createBooking(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        double totalPrice = 0.0;
        Booking booking = Booking.builder()
                .user(user)
                .status(BookingStatus.PENDING)
                .paid(false)
                .build();

        if (request.getFlightId() != null) {
            Flight flight = flightRepository.findById(request.getFlightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
            booking.setFlight(flight);
            totalPrice += flight.getPrice();
        }

        if (request.getHotelId() != null) {
            Hotel hotel = hotelRepository.findById(request.getHotelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
            int rooms = positiveCount(request.getRooms(), "rooms");
            int days = positiveCount(request.getDays(), "days");
            int guests = positiveCount(request.getGuests(), "guests");

            if (rooms > hotel.getAvailableRooms()) {
                throw new IllegalArgumentException("Requested rooms exceed available rooms");
            }

            booking.setHotel(hotel);
            booking.setRooms(rooms);
            booking.setDays(days);
            booking.setGuests(guests);
            totalPrice += hotel.getPricePerNight() * rooms * days;
        }

        if (request.getTourId() != null) {
            Tour tour = tourRepository.findById(request.getTourId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tour not found"));
            booking.setTour(tour);
            totalPrice += tour.getPrice();
        }

        if (request.getPackageId() != null) {
            TravelPackage pkg = packageRepository.findById(request.getPackageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Package not found"));
            booking.setTravelPackage(pkg);
            totalPrice += pkg.getTotalPrice();
        }

        if (totalPrice == 0) {
            throw new IllegalArgumentException("Booking must include at least one service");
        }

        booking.setTotalPrice(totalPrice);
        return bookingRepository.save(booking);
    }

    private int positiveCount(Integer value, String fieldName) {
        int count = value == null ? 1 : value;
        if (count <= 0) {
            throw new IllegalArgumentException("Hotel booking " + fieldName + " must be positive");
        }
        return count;
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByBookingDateDesc(userId);
    }

    @Transactional
    public Booking checkoutWithWallet(Long userId, Long bookingId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getPaid()) {
            throw new IllegalStateException("Booking is already paid");
        }

        if (user.getWalletBalance() < booking.getTotalPrice()) {
            throw new IllegalStateException("Insufficient wallet balance");
        }

        // Deduct balance
        user.setWalletBalance(user.getWalletBalance() - booking.getTotalPrice());
        userRepository.save(user);

        // Mark paid before awarding points (booking.getId() must exist)
        booking.setPaid(true);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setConfirmationCode("CONF-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        Booking saved = bookingRepository.save(booking);

        int points = loyaltyService.awardForBooking(user, saved);
        saved.setLoyaltyPointsEarned(points);
        return bookingRepository.save(saved);
    }

    @Transactional
    public Booking checkoutWithVisa(Long userId, Long bookingId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getPaid()) {
            throw new IllegalStateException("Booking is already paid");
        }

        // Fake visa processing success

        // Mark paid before awarding points (booking.getId() must exist)
        booking.setPaid(true);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setConfirmationCode("VISA-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        Booking saved = bookingRepository.save(booking);

        int points = loyaltyService.awardForBooking(user, saved);
        saved.setLoyaltyPointsEarned(points);
        return bookingRepository.save(saved);
    }

    @Transactional
    public Booking cancelService(Long userId, Long serviceId, String serviceType) {
        // Since frontend passes the serviceId to cancel, but backend bookings are grouped.
        // Usually, one booking has hotel, flight, or tour. If they cancel a service, we'll find the booking containing it.
        // For MVP, assuming serviceId is actually the bookingId based on frontend behavior.
        // Let's adapt to finding booking by ID.
        Booking booking = bookingRepository.findByIdAndUserId(serviceId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
                
        booking.setStatus(BookingStatus.CANCELLED);
        
        // If it was paid, refund to wallet
        if (booking.getPaid()) {
            User user = userRepository.findById(userId).get();
            user.setWalletBalance(user.getWalletBalance() + booking.getTotalPrice());
            userRepository.save(user);
        }
        
        return bookingRepository.save(booking);
    }

    @Transactional
    public User topUpWallet(Long userId, Double amount) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Wallet top-up amount must be positive");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setWalletBalance(user.getWalletBalance() + amount);
        return userRepository.save(user);
    }

    @Transactional
    public PriceFreeze freezePrice(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getFlightId() == null) {
            throw new IllegalArgumentException("Price freeze is only available for flights");
        }

        // Check for duplicate freeze on the same flight
        if (priceFreezeRepository.existsByUserIdAndBooking_Flight_IdAndActiveTrue(userId, request.getFlightId())) {
            throw new IllegalStateException("You have already frozen the price for this flight");
        }

        // Create a pending booking first
        Booking booking = createBooking(userId, request);

        // Calculate a 5% freeze fee
        double fee = booking.getTotalPrice() * 0.05;
        String paymentMethod = request.getPaymentMethod() == null ? "WALLET" : request.getPaymentMethod().trim().toUpperCase();

        if ("WALLET".equals(paymentMethod)) {
            if (user.getWalletBalance() < fee) {
                throw new IllegalStateException("Insufficient wallet balance for price freeze fee");
            }
            user.setWalletBalance(user.getWalletBalance() - fee);
            userRepository.save(user);
        } else if ("CARD".equals(paymentMethod)) {
            validateCardFreezePayment(request.getPaymentDetails());
        } else {
            throw new IllegalArgumentException("Unsupported price freeze payment method: " + request.getPaymentMethod());
        }

        // Create price freeze
        PriceFreeze freeze = PriceFreeze.builder()
                .user(user)
                .booking(booking)
                .frozenPrice(booking.getTotalPrice())
                .freezeFee(fee)
                .expiresAt(LocalDateTime.now().plusDays(1)) // 24 hour freeze
                .active(true)
                .build();

        return priceFreezeRepository.save(freeze);
    }

    private void validateCardFreezePayment(VisaPaymentRequest paymentDetails) {
        if (paymentDetails == null
                || isBlank(paymentDetails.getCardNumber())
                || isBlank(paymentDetails.getExpiryDate())
                || isBlank(paymentDetails.getCvv())
                || isBlank(paymentDetails.getCardHolderName())) {
            throw new IllegalArgumentException("Card payment details are required for price freeze");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}

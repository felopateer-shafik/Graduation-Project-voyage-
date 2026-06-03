package com.voyage.backend.service;

import com.voyage.backend.model.Booking;
import com.voyage.backend.dto.VisaPaymentRequest;
import com.voyage.backend.model.Flight;
import com.voyage.backend.model.Hotel;
import com.voyage.backend.model.PriceFreeze;
import com.voyage.backend.model.User;
import com.voyage.backend.dto.BookingRequest;
import com.voyage.backend.model.enums.BookingStatus;
import com.voyage.backend.repository.BookingRepository;
import com.voyage.backend.repository.FlightRepository;
import com.voyage.backend.repository.HotelRepository;
import com.voyage.backend.repository.PackageRepository;
import com.voyage.backend.repository.PriceFreezeRepository;
import com.voyage.backend.repository.TourRepository;
import com.voyage.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class BookingServiceTest {

    private final BookingRepository bookingRepository = mock(BookingRepository.class);
    private final FlightRepository flightRepository = mock(FlightRepository.class);
    private final HotelRepository hotelRepository = mock(HotelRepository.class);
    private final TourRepository tourRepository = mock(TourRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final PriceFreezeRepository priceFreezeRepository = mock(PriceFreezeRepository.class);
    private final LoyaltyService loyaltyService = mock(LoyaltyService.class);
    private final PackageRepository packageRepository = mock(PackageRepository.class);
    private final BookingService bookingService = new BookingService(
            bookingRepository,
            flightRepository,
            hotelRepository,
            tourRepository,
            userRepository,
            priceFreezeRepository,
            loyaltyService,
            packageRepository
    );

    @Test
    void topUpWalletRejectsNonPositiveAmounts() {
        assertThatThrownBy(() -> bookingService.topUpWallet(1L, -50.0))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("positive");
    }

    @Test
    void walletCheckoutDeductsBackendBookingTotalAndAwardsPoints() {
        User user = User.builder().id(1L).walletBalance(1000.0).build();
        Booking booking = Booking.builder()
                .id(10L)
                .user(user)
                .totalPrice(375.0)
                .paid(false)
                .status(BookingStatus.PENDING)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookingRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(loyaltyService.awardForBooking(user, booking)).thenReturn(375);

        Booking paid = bookingService.checkoutWithWallet(1L, 10L);

        assertThat(user.getWalletBalance()).isEqualTo(625.0);
        assertThat(paid.getPaid()).isTrue();
        assertThat(paid.getLoyaltyPointsEarned()).isEqualTo(375);
        assertThat(paid.getConfirmationCode()).startsWith("CONF-");
    }

    @Test
    void visaCheckoutUsesBackendTotalForPointsWithoutDeductingWallet() {
        User user = User.builder().id(1L).walletBalance(1000.0).build();
        Booking booking = Booking.builder()
                .id(11L)
                .user(user)
                .totalPrice(420.0)
                .paid(false)
                .status(BookingStatus.PENDING)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookingRepository.findByIdAndUserId(11L, 1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(loyaltyService.awardForBooking(user, booking)).thenReturn(420);

        Booking paid = bookingService.checkoutWithVisa(1L, 11L);

        assertThat(user.getWalletBalance()).isEqualTo(1000.0);
        assertThat(paid.getPaid()).isTrue();
        assertThat(paid.getLoyaltyPointsEarned()).isEqualTo(420);
        assertThat(paid.getConfirmationCode()).startsWith("VISA-");
    }

    @Test
    void cancellingPaidBookingRefundsBackendBookingTotalToWallet() {
        User user = User.builder().id(1L).walletBalance(50.0).build();
        Booking booking = Booking.builder()
                .id(12L)
                .user(user)
                .totalPrice(300.0)
                .paid(true)
                .status(BookingStatus.CONFIRMED)
                .build();

        when(bookingRepository.findByIdAndUserId(12L, 1L)).thenReturn(Optional.of(booking));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Booking cancelled = bookingService.cancelService(1L, 12L, "booking");

        assertThat(cancelled.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        assertThat(user.getWalletBalance()).isEqualTo(350.0);
    }

    @Test
    void hotelBookingUsesRoomAndDayCountsForTotalAndStoresDetails() {
        User user = User.builder().id(1L).build();
        Hotel hotel = Hotel.builder()
                .id(20L)
                .pricePerNight(300.0)
                .availableRooms(5)
                .build();
        BookingRequest request = new BookingRequest();
        request.setHotelId(20L);
        request.setRooms(2);
        request.setDays(3);
        request.setGuests(4);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(hotelRepository.findById(20L)).thenReturn(Optional.of(hotel));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Booking booking = bookingService.createBooking(1L, request);

        assertThat(booking.getTotalPrice()).isEqualTo(1800.0);
        assertThat(booking.getRooms()).isEqualTo(2);
        assertThat(booking.getDays()).isEqualTo(3);
        assertThat(booking.getGuests()).isEqualTo(4);
    }

    @Test
    void hotelBookingRejectsRequestedRoomsOverInventory() {
        User user = User.builder().id(1L).build();
        Hotel hotel = Hotel.builder()
                .id(20L)
                .pricePerNight(300.0)
                .availableRooms(1)
                .build();
        BookingRequest request = new BookingRequest();
        request.setHotelId(20L);
        request.setRooms(2);
        request.setDays(1);
        request.setGuests(2);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(hotelRepository.findById(20L)).thenReturn(Optional.of(hotel));

        assertThatThrownBy(() -> bookingService.createBooking(1L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("available rooms");
    }

    @Test
    void priceFreezeDeductsFivePercentOfBackendBookingTotal() {
        User user = User.builder().id(1L).walletBalance(1000.0).build();
        Flight flight = Flight.builder()
                .id(44L)
                .price(800.0)
                .build();
        BookingRequest request = new BookingRequest();
        request.setFlightId(44L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(flightRepository.findById(44L)).thenReturn(Optional.of(flight));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(priceFreezeRepository.save(any(PriceFreeze.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PriceFreeze freeze = bookingService.freezePrice(1L, request);

        assertThat(freeze.getFrozenPrice()).isEqualTo(800.0);
        assertThat(freeze.getFreezeFee()).isEqualTo(40.0);
        assertThat(user.getWalletBalance()).isEqualTo(960.0);
    }

    @Test
    void cardPriceFreezeCreatesRecordWithoutDeductingWallet() {
        User user = User.builder().id(1L).walletBalance(1000.0).build();
        Flight flight = Flight.builder()
                .id(44L)
                .price(800.0)
                .build();
        VisaPaymentRequest paymentDetails = new VisaPaymentRequest();
        paymentDetails.setCardNumber("4111111111111111");
        paymentDetails.setExpiryDate("12/30");
        paymentDetails.setCvv("123");
        paymentDetails.setCardHolderName("Ali Traveler");

        BookingRequest request = new BookingRequest();
        request.setFlightId(44L);
        request.setPaymentMethod("CARD");
        request.setPaymentDetails(paymentDetails);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(flightRepository.findById(44L)).thenReturn(Optional.of(flight));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(priceFreezeRepository.save(any(PriceFreeze.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PriceFreeze freeze = bookingService.freezePrice(1L, request);

        assertThat(freeze.getFrozenPrice()).isEqualTo(800.0);
        assertThat(freeze.getFreezeFee()).isEqualTo(40.0);
        assertThat(user.getWalletBalance()).isEqualTo(1000.0);
    }
}

package com.voyage.backend.service.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.voyage.backend.model.*;
import com.voyage.backend.repository.*;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RetrievalService {

    private static final Logger log = LoggerFactory.getLogger(RetrievalService.class);
    private static final DateTimeFormatter DT_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final HotelRepository hotelRepository;
    private final TourRepository tourRepository;
    private final PackageRepository packageRepository;
    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final ObjectMapper objectMapper;

    private String cachedFaqs = "";

    public RetrievalService(HotelRepository hotelRepository,
                            TourRepository tourRepository,
                            PackageRepository packageRepository,
                            BookingRepository bookingRepository,
                            FlightRepository flightRepository,
                            ObjectMapper objectMapper) {
        this.hotelRepository = hotelRepository;
        this.tourRepository = tourRepository;
        this.packageRepository = packageRepository;
        this.bookingRepository = bookingRepository;
        this.flightRepository = flightRepository;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    void loadFaqs() {
        try {
            var resource = new ClassPathResource("data/faqs.json");
            List<Map<String, String>> faqs = objectMapper.readValue(
                    resource.getInputStream(), new TypeReference<>() {});
            cachedFaqs = faqs.stream()
                    .map(f -> "Q: " + f.get("question") + "\nA: " + f.get("answer"))
                    .collect(Collectors.joining("\n\n"));
        } catch (Exception e) {
            log.error("Could not load FAQs: {}", e.getMessage());
            cachedFaqs = "No FAQ data available.";
        }
    }

    public String getFaqContext() {
        return cachedFaqs;
    }

    public String getHotelsContext(String destination) {
        List<Hotel> hotels = hotelRepository.searchByCityLocationOrName(destination);
        if (hotels.isEmpty()) return "No hotels found for " + destination + ".";
        return hotels.stream().limit(5)
                .map(h -> String.format("- ID:%d | %s | %d stars | EGP %.0f/night | rooms:%d | amenities: %s",
                        h.getId(), h.getName(), h.getStars(), h.getPricePerNight(),
                        h.getAvailableRooms(),
                        h.getAmenities() != null ? h.getAmenities() : "N/A"))
                .collect(Collectors.joining("\n"));
    }

    public String getFlightsContext(String origin, String destination) {
        List<Flight> flights = flightRepository.searchFlights(origin, destination);
        if (flights.isEmpty()) return "No flights found from " + origin + " to " + destination + ".";
        return flights.stream().limit(5)
                .map(f -> String.format(
                        "- ID:%d | %s %s | %s(%s) → %s(%s) | Departs: %s | Arrives: %s | Duration: %s | EGP %.0f | Stops: %d | Class: %s | Seats: %d",
                        f.getId(),
                        f.getAirlineName(), f.getFlightNumber(),
                        f.getDepartureCity(), f.getDepartureCityCode(),
                        f.getArrivalCity(), f.getArrivalCityCode(),
                        f.getDepartureTime() != null ? f.getDepartureTime().format(DT_FMT) : "N/A",
                        f.getArrivalTime() != null ? f.getArrivalTime().format(DT_FMT) : "N/A",
                        f.getDuration(),
                        f.getPrice(), f.getStops(), f.getCabinClass(),
                        f.getAvailableSeats()))
                .collect(Collectors.joining("\n"));
    }

    public String getToursContext(String destination) {
        List<Tour> tours = tourRepository.findAll().stream()
                .filter(t -> t.getLocation() != null &&
                        t.getLocation().toLowerCase().contains(destination.toLowerCase()))
                .limit(5)
                .toList();
        if (tours.isEmpty()) return "No tours found for " + destination + ".";
        return tours.stream()
                .map(t -> String.format("- %s (%s, %s, EGP %.0f/person)",
                        t.getTitle(), t.getDuration(),
                        t.getCategory() != null ? t.getCategory() : "General",
                        t.getPrice()))
                .collect(Collectors.joining("\n"));
    }

    public String getPackagesContext(String destination) {
        List<TravelPackage> pkgs = packageRepository.findAll().stream()
                .filter(p -> Boolean.TRUE.equals(p.getActive()) &&
                        p.getDestinationCityCode() != null &&
                        p.getDestinationCityCode().toLowerCase().contains(destination.toLowerCase()))
                .limit(4)
                .toList();
        if (pkgs.isEmpty()) return "No packages found for " + destination + ".";
        return pkgs.stream()
                .map(p -> String.format("- %s (%d nights, EGP %.0f/person, includes: %s)",
                        p.getName(), p.getNights(), p.getPricePerPerson(),
                        String.join(", ", p.getInclusions().stream().limit(3).toList())))
                .collect(Collectors.joining("\n"));
    }

    public String getUserBookingsContext(Long userId) {
        if (userId == null) return "User is not authenticated - no booking history available.";
        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingDateDesc(userId);
        if (bookings.isEmpty()) return "This user has no bookings yet.";
        return bookings.stream().limit(5)
                .map(b -> {
                    String item = b.getHotel() != null ? "Hotel: " + b.getHotel().getName()
                            : b.getTour() != null ? "Tour: " + b.getTour().getTitle()
                            : b.getFlight() != null ? "Flight " + b.getFlight().getFlightNumber()
                            : b.getTravelPackage() != null ? "Package: " + b.getTravelPackage().getName()
                            : "Unknown";
                    return String.format("- %s | Status: %s | Paid: %s | EGP %.0f",
                            item, b.getStatus(), b.getPaid() ? "Yes" : "No", b.getTotalPrice());
                })
                .collect(Collectors.joining("\n"));
    }
}


package com.voyage.backend.service.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.voyage.backend.model.Flight;
import com.voyage.backend.model.Hotel;
import com.voyage.backend.repository.FlightRepository;
import com.voyage.backend.repository.HotelRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);
    private static final DateTimeFormatter DT_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private static final String TRIP_PLANNER_SYSTEM = """
        You are a professional travel itinerary planner for Voyage, a travel booking platform.
        You create detailed, practical day-by-day travel itineraries using REAL data from our platform.

        CRITICAL RULES:
        1. The number of days in your itinerary MUST EXACTLY match the requested trip duration.
        2. Every activity should have an estimated cost. Use 0 for free activities.
        3. Activities should reference real tours from the data when available.
        4. Calculate estimatedTotal: flight price + (hotel pricePerNight × number of nights) + sum of all activity costs.

        IMPORTANT: You MUST respond with ONLY a valid JSON object — no markdown, no explanation, no code fences.
        The JSON must follow this EXACT structure:
        {
          "days": [
            {
              "day": 1,
              "title": "Arrival & Settling In",
              "activities": [
                {"name": "Arrive and check-in", "type": "transport", "cost": 0},
                {"name": "Sunset beach walk", "type": "free", "cost": 0}
              ]
            }
          ],
          "estimatedTotal": {
            "flight": 8500,
            "hotel": 25600,
            "activities": 3200,
            "total": 37300,
            "currency": "EGP"
          }
        }

        Each day should have 3-5 activities. Activities should be specific and actionable.
        The "type" field can be: "transport", "hotel", "tour", "food", "free", "shopping", "sightseeing".
        Do not include any text outside the JSON object.
        """;

    private static final String SUPPORT_SYSTEM = """
        You are a helpful customer support agent for Voyage, a travel booking platform.
        You assist users with questions about bookings, hotels, flights, tours, packages, loyalty points, and cancellations.
        Be concise, friendly, and accurate. If you don't know something specific to their account, guide them to the right page.
        Always respond in 2-4 sentences unless a detailed answer is genuinely needed.
        """;

    private final GeminiClient geminiClient;
    private final RetrievalService retrievalService;
    private final FlightRepository flightRepository;
    private final HotelRepository hotelRepository;
    private final ObjectMapper objectMapper;

    public AiService(GeminiClient geminiClient, RetrievalService retrievalService,
                     FlightRepository flightRepository, HotelRepository hotelRepository,
                     ObjectMapper objectMapper) {
        this.geminiClient = geminiClient;
        this.retrievalService = retrievalService;
        this.flightRepository = flightRepository;
        this.hotelRepository = hotelRepository;
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> generateTripPlan(String origin, String destination, int days,
                                                 List<String> interests,
                                                 String customInstructions,
                                                 String departureDate, String returnDate,
                                                 Long userId) {

        // 1. Query REAL data from the database
        List<Flight> dbFlights = flightRepository.searchFlights(origin, destination);
        List<Hotel> dbHotels = hotelRepository.searchByCityLocationOrName(destination);

        log.info("Trip planner: {} → {} | Found {} flights, {} hotels",
                origin, destination, dbFlights.size(), dbHotels.size());

        // 2. Build context strings for the AI prompt
        String flightsCtx = dbFlights.isEmpty()
                ? "No flights found from " + origin + " to " + destination + "."
                : dbFlights.stream().limit(5).map(f -> String.format(
                        "- %s %s | %s(%s) → %s(%s) | %s | EGP %.0f | %s | %d stops",
                        f.getAirlineName(), f.getFlightNumber(),
                        f.getDepartureCity(), f.getDepartureCityCode(),
                        f.getArrivalCity(), f.getArrivalCityCode(),
                        f.getDuration(), f.getPrice(), f.getCabinClass(), f.getStops()))
                .collect(Collectors.joining("\n"));

        String hotelsCtx = dbHotels.isEmpty()
                ? "No hotels found in " + destination + "."
                : dbHotels.stream().limit(5).map(h -> String.format(
                        "- %s | %d stars | EGP %.0f/night | amenities: %s",
                        h.getName(), h.getStars(), h.getPricePerNight(),
                        h.getAmenities() != null ? h.getAmenities() : "N/A"))
                .collect(Collectors.joining("\n"));

        String toursCtx = retrievalService.getToursContext(destination);

        // 3. Build effective instructions
        String effectiveInstructions = customInstructions;
        if (effectiveInstructions == null || effectiveInstructions.isBlank()) {
            effectiveInstructions = "Trip duration: " + days + " days.";
        } else if (!effectiveInstructions.toLowerCase().contains("day")) {
            effectiveInstructions = "Trip duration: " + days + " days. " + effectiveInstructions.trim();
        }

        String dateInfo = "";
        if (departureDate != null && !departureDate.isBlank()) {
            dateInfo += "Preferred departure date: " + departureDate + ". ";
        }
        if (returnDate != null && !returnDate.isBlank()) {
            dateInfo += "Preferred return date: " + returnDate + ". ";
        }

        // 4. Pick best flight and hotel from DB (price-first)
        Flight bestFlight = dbFlights.stream()
                .min(Comparator.comparingDouble(Flight::getPrice))
                .orElse(null);

        Hotel bestHotel = dbHotels.stream()
                .max(Comparator.comparingDouble(Hotel::getRating))
                .orElse(null);

        // 5. Build prompt for AI (only asking for itinerary + cost estimate)
        String userPrompt = String.format("""
            Create a %d-day travel itinerary.
            Traveling FROM: %s
            Traveling TO: %s
            %sTraveler interests: %s
            Custom instructions: %s

            === AVAILABLE FLIGHTS ===
            %s

            === AVAILABLE HOTELS ===
            %s

            === AVAILABLE TOURS ===
            %s

            INSTRUCTIONS:
            - Create EXACTLY %d days in the itinerary.
            - Use the best available flight price (EGP %.0f) and hotel price (EGP %.0f/night × %d nights) for cost calculations.
            - Reference real tours in day activities when relevant.
            - Every activity must have a realistic cost estimate in EGP.
            - Calculate estimatedTotal = flight + hotel + activities accurately.
            - Return ONLY the JSON object. No markdown. No explanation.
            """,
            days,
            origin,
            destination,
            dateInfo,
            interests.isEmpty() ? "General sightseeing" : String.join(", ", interests),
            effectiveInstructions,
            flightsCtx,
            hotelsCtx,
            toursCtx,
            days,
            bestFlight != null ? bestFlight.getPrice() : 0,
            bestHotel != null ? bestHotel.getPricePerNight() : 0,
            days
        );

        String raw = geminiClient.generate(TRIP_PLANNER_SYSTEM, userPrompt);

        // 6. Parse AI response and INJECT real DB data
        Map<String, Object> plan = parseTripPlan(raw, days, origin, destination);

        // 7. ALWAYS inject real flight/hotel from DB (this is the critical fix)
        if (bestFlight != null) {
            Map<String, Object> flightData = new LinkedHashMap<>();
            flightData.put("id", bestFlight.getId());
            flightData.put("flightNumber", bestFlight.getFlightNumber());
            flightData.put("airline", bestFlight.getAirlineName());
            flightData.put("departureCity", bestFlight.getDepartureCity());
            flightData.put("departureCityCode", bestFlight.getDepartureCityCode());
            flightData.put("arrivalCity", bestFlight.getArrivalCity());
            flightData.put("arrivalCityCode", bestFlight.getArrivalCityCode());
            flightData.put("departureTime", bestFlight.getDepartureTime() != null ? bestFlight.getDepartureTime().format(DT_FMT) : null);
            flightData.put("arrivalTime", bestFlight.getArrivalTime() != null ? bestFlight.getArrivalTime().format(DT_FMT) : null);
            flightData.put("duration", bestFlight.getDuration());
            flightData.put("price", bestFlight.getPrice());
            flightData.put("stops", bestFlight.getStops());
            flightData.put("cabinClass", bestFlight.getCabinClass());
            flightData.put("aircraft", bestFlight.getAircraft());
            flightData.put("refundable", bestFlight.getRefundable());
            flightData.put("availableSeats", bestFlight.getAvailableSeats());
            plan.put("recommendedFlight", flightData);
        } else {
            plan.put("recommendedFlight", null);
        }

        if (bestHotel != null) {
            Map<String, Object> hotelData = new LinkedHashMap<>();
            hotelData.put("id", bestHotel.getId());
            hotelData.put("name", bestHotel.getName());
            hotelData.put("city", bestHotel.getCity());
            hotelData.put("location", bestHotel.getLocation());
            hotelData.put("stars", bestHotel.getStars());
            hotelData.put("pricePerNight", bestHotel.getPricePerNight());
            hotelData.put("totalPrice", bestHotel.getPricePerNight() * days);
            hotelData.put("rating", bestHotel.getRating());
            hotelData.put("amenities", bestHotel.getAmenities());
            hotelData.put("roomType", bestHotel.getRoomType());
            hotelData.put("imageUrl", bestHotel.getImageUrl());
            hotelData.put("availableRooms", bestHotel.getAvailableRooms());
            plan.put("recommendedHotel", hotelData);
        } else {
            plan.put("recommendedHotel", null);
        }

        // 8. Also provide all matching flights/hotels so the user has alternatives
        plan.put("allFlights", dbFlights.stream().limit(5).map(f -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", f.getId());
            m.put("flightNumber", f.getFlightNumber());
            m.put("airline", f.getAirlineName());
            m.put("departureCity", f.getDepartureCity());
            m.put("departureCityCode", f.getDepartureCityCode());
            m.put("arrivalCity", f.getArrivalCity());
            m.put("arrivalCityCode", f.getArrivalCityCode());
            m.put("departureTime", f.getDepartureTime() != null ? f.getDepartureTime().format(DT_FMT) : null);
            m.put("arrivalTime", f.getArrivalTime() != null ? f.getArrivalTime().format(DT_FMT) : null);
            m.put("duration", f.getDuration());
            m.put("price", f.getPrice());
            m.put("stops", f.getStops());
            m.put("cabinClass", f.getCabinClass());
            m.put("refundable", f.getRefundable());
            return m;
        }).toList());

        plan.put("allHotels", dbHotels.stream().limit(5).map(h -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", h.getId());
            m.put("name", h.getName());
            m.put("city", h.getCity());
            m.put("stars", h.getStars());
            m.put("pricePerNight", h.getPricePerNight());
            m.put("totalPrice", h.getPricePerNight() * days);
            m.put("rating", h.getRating());
            m.put("amenities", h.getAmenities());
            m.put("imageUrl", h.getImageUrl());
            return m;
        }).toList());

        return plan;
    }

    public String answerSupport(String message, List<Map<String, String>> history, Long userId) {
        String faqCtx = retrievalService.getFaqContext();
        String bookingsCtx = retrievalService.getUserBookingsContext(userId);

        String historyText = history == null || history.isEmpty() ? "" :
            history.stream().limit(6)
                .map(m -> m.get("role") + ": " + m.get("content"))
                .collect(Collectors.joining("\n"));

        String userPrompt = String.format("""
            RELEVANT FAQs:
            %s

            USER'S BOOKING HISTORY:
            %s

            CONVERSATION SO FAR:
            %s

            USER'S CURRENT MESSAGE:
            %s
            """,
            faqCtx,
            bookingsCtx,
            historyText,
            message
        );

        return geminiClient.generate(SUPPORT_SYSTEM, userPrompt);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseTripPlan(String raw, int days, String origin, String destination) {
        // Strip markdown code fences if the AI ignored the instruction
        String cleaned = raw.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
        }

        try {
            Map<String, Object> parsed = objectMapper.readValue(cleaned,
                new TypeReference<>() {});

            // Ensure the days list doesn't exceed the requested duration
            if (parsed.containsKey("days") && parsed.get("days") instanceof List<?> daysList) {
                parsed.put("days", daysList.stream().limit(days).toList());
            }

            return parsed;
        } catch (Exception e) {
            log.warn("Could not parse AI trip plan JSON, returning fallback. Error: {}", e.getMessage());
            log.debug("Raw AI response: {}", raw);
            return buildFallbackPlan(days, origin, destination);
        }
    }

    private Map<String, Object> buildFallbackPlan(int days, String origin, String destination) {
        List<Map<String, Object>> fallbackDays = java.util.stream.IntStream.rangeClosed(1, days)
            .mapToObj(i -> {
                Map<String, Object> day = new LinkedHashMap<>();
                day.put("day", i);
                day.put("title", "Day " + i + " in " + destination);
                day.put("activities", List.of(
                    Map.of("name", "Explore local highlights", "type", "sightseeing", "cost", 0),
                    Map.of("name", "Visit popular attractions", "type", "sightseeing", "cost", 200),
                    Map.of("name", "Experience local cuisine", "type", "food", "cost", 300)
                ));
                return (Map<String, Object>) day;
            })
            .toList();

        Map<String, Object> fallback = new LinkedHashMap<>();
        fallback.put("days", fallbackDays);
        fallback.put("estimatedTotal", Map.of(
            "flight", 0,
            "hotel", 0,
            "activities", days * 500,
            "total", days * 500,
            "currency", "EGP"
        ));
        return fallback;
    }
}

package com.voyage.backend.repository;

import com.voyage.backend.model.Flight;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
class FlightRepositoryTest {

    @Autowired
    private FlightRepository flightRepository;

    @Test
    void searchFlightsMatchesAirportCodesCaseInsensitively() {
        flightRepository.save(Flight.builder()
                .airlineName("EgyptAir")
                .flightNumber("MS901")
                .departureCity("Cairo")
                .departureCityCode("CAI")
                .arrivalCity("Dubai")
                .arrivalCityCode("DXB")
                .departureTime(LocalDateTime.now().plusDays(1))
                .arrivalTime(LocalDateTime.now().plusDays(1).plusHours(3))
                .duration("3h")
                .price(5200.0)
                .availableSeats(20)
                .build());

        assertThat(flightRepository.searchFlights("cai", "dxb"))
                .extracting(Flight::getFlightNumber)
                .containsExactly("MS901");
    }
}

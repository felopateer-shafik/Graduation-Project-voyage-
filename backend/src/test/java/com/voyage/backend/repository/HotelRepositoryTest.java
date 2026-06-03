package com.voyage.backend.repository;

import com.voyage.backend.model.Hotel;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
class HotelRepositoryTest {

    @Autowired
    private HotelRepository hotelRepository;

    @Test
    void searchByCityAndMaxPriceMatchesCityLocationOrName() {
        hotelRepository.save(Hotel.builder()
                .name("Nile Zamalek Stay")
                .city("Cairo")
                .location("Zamalek")
                .description("Central hotel")
                .pricePerNight(2800.0)
                .rating(4.5)
                .availableRooms(8)
                .stars(4)
                .build());

        assertThat(hotelRepository.searchByCityAndMaxPrice("zamalek", 3000.0))
                .extracting(Hotel::getName)
                .containsExactly("Nile Zamalek Stay");
    }
}

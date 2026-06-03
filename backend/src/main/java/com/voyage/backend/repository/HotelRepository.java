package com.voyage.backend.repository;

import com.voyage.backend.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("SELECT h FROM Hotel h WHERE " +
           "LOWER(h.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Hotel> searchByCityLocationOrName(@Param("query") String query);

    @Query("SELECT h FROM Hotel h WHERE " +
           "(LOWER(h.city) LIKE LOWER(CONCAT('%', :city, '%')) OR " +
           "LOWER(h.location) LIKE LOWER(CONCAT('%', :city, '%')) OR " +
           "LOWER(h.name) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "h.pricePerNight <= :maxPrice")
    List<Hotel> searchByCityAndMaxPrice(@Param("city") String city, @Param("maxPrice") Double maxPrice);

    List<Hotel> findByStarsGreaterThanEqual(Integer stars);
}

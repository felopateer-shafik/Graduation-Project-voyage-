package com.voyage.backend.repository;

import com.voyage.backend.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    @Query("SELECT f FROM Flight f WHERE " +
           "(LOWER(f.departureCity) LIKE LOWER(CONCAT('%', :from, '%')) OR " +
           "LOWER(f.departureCityCode) LIKE LOWER(CONCAT('%', :from, '%'))) AND " +
           "(LOWER(f.arrivalCity) LIKE LOWER(CONCAT('%', :to, '%')) OR " +
           "LOWER(f.arrivalCityCode) LIKE LOWER(CONCAT('%', :to, '%')))")
    List<Flight> searchFlights(@Param("from") String from, @Param("to") String to);

    @Query("SELECT f FROM Flight f WHERE " +
           "LOWER(f.departureCity) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(f.departureCityCode) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Flight> searchByDeparture(@Param("query") String query);

    @Query("SELECT f FROM Flight f WHERE " +
           "LOWER(f.arrivalCity) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(f.arrivalCityCode) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Flight> searchByArrival(@Param("query") String query);
}

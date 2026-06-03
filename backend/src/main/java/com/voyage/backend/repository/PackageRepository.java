package com.voyage.backend.repository;

import com.voyage.backend.model.TravelPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PackageRepository extends JpaRepository<TravelPackage, Long> {
    List<TravelPackage> findByActiveTrueOrderByIdDesc();

    @Query("SELECT p FROM TravelPackage p WHERE p.active = true AND " +
           "LOWER(p.destinationCityCode) LIKE LOWER(CONCAT('%', :destination, '%')) " +
           "ORDER BY p.id DESC")
    List<TravelPackage> searchByDestination(@Param("destination") String destination);

    @Query("SELECT p FROM TravelPackage p WHERE p.active = true AND " +
           "LOWER(p.originCityCode) LIKE LOWER(CONCAT('%', :origin, '%')) AND " +
           "LOWER(p.destinationCityCode) LIKE LOWER(CONCAT('%', :destination, '%')) " +
           "ORDER BY p.id DESC")
    List<TravelPackage> searchByOriginAndDestination(
            @Param("origin") String origin,
            @Param("destination") String destination);

    boolean existsByName(String name);
}

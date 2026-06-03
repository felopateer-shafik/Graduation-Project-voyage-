package com.voyage.backend.repository;

import com.voyage.backend.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {

    List<City> findByCountryCode(String countryCode);

    Optional<City> findByCode(String code);

    Optional<City> findFirstByNameContainingIgnoreCase(String name);

    boolean existsByCode(String code);
}

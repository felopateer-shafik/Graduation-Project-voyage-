package com.voyage.backend.repository;

import com.voyage.backend.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {

    List<Country> findByPopularTrue();

    Optional<Country> findByCode(String code);

    boolean existsByCode(String code);
}

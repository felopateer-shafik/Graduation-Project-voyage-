package com.voyage.backend.repository;

import com.voyage.backend.model.Tour;
import com.voyage.backend.model.enums.TourType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {

    List<Tour> findByFeaturedTrue();

    List<Tour> findByCategoryIgnoreCase(String category);

    List<Tour> findByTourType(TourType tourType);

    @Query("SELECT t FROM Tour t WHERE " +
           "LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Tour> searchTours(@Param("query") String query);
}

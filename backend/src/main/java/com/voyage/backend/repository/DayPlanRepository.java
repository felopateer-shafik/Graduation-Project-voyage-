package com.voyage.backend.repository;

import com.voyage.backend.model.DayPlan;
import com.voyage.backend.model.TravelPackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DayPlanRepository extends JpaRepository<DayPlan, Long> {
    List<DayPlan> findByTravelPackageOrderByDayNumberAsc(TravelPackage travelPackage);
}

package com.voyage.backend.repository;

import com.voyage.backend.model.Landmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LandmarkRepository extends JpaRepository<Landmark, Long> {

    List<Landmark> findByCityCode(String cityCode);

    List<Landmark> findByHiddenGem(boolean hiddenGem);

    List<Landmark> findByCityCodeAndHiddenGem(String cityCode, boolean hiddenGem);

    boolean existsByNameAndCityCode(String name, String cityCode);
}

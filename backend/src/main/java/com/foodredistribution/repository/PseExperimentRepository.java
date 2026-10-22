package com.foodredistribution.repository;

import com.foodredistribution.entity.PseExperiment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PseExperimentRepository extends JpaRepository<PseExperiment, String> {
    List<PseExperiment> findAllByOrderByCreatedAtDesc();
}

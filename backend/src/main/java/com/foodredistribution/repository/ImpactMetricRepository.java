package com.foodredistribution.repository;

import com.foodredistribution.entity.ImpactMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ImpactMetricRepository extends JpaRepository<ImpactMetric, UUID> {
    Optional<ImpactMetric> findTopByOrderByTimestampDesc();
}

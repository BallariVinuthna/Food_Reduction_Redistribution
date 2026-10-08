package com.foodredistribution.repository;

import com.foodredistribution.entity.BaselineMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BaselineMetricRepository extends JpaRepository<BaselineMetric, UUID> {
    Optional<BaselineMetric> findByMetricKey(String metricKey);
}

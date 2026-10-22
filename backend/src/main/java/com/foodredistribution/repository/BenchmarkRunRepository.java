package com.foodredistribution.repository;

import com.foodredistribution.entity.BenchmarkRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BenchmarkRunRepository extends JpaRepository<BenchmarkRun, UUID> {
    List<BenchmarkRun> findAllByOrderByExecutedAtDesc();
    Optional<BenchmarkRun> findByRunId(String runId);
    Optional<BenchmarkRun> findTopByOrderByExecutedAtDesc();
}

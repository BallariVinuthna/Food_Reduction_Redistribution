package com.foodredistribution.repository;

import com.foodredistribution.entity.PrototypeTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PrototypeTestRepository extends JpaRepository<PrototypeTest, UUID> {
    List<PrototypeTest> findAllByOrderByTestTimestampDesc();
    List<PrototypeTest> findByBenchmarkRunIdOrderByTestTimestampAsc(UUID benchmarkRunId);
    List<PrototypeTest> findByRunIdOrderByTestTimestampAsc(String runId);
}

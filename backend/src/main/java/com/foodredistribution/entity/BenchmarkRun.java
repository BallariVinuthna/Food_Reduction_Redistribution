package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "benchmark_runs", indexes = {
    @Index(name = "idx_bench_run_id", columnList = "runId"),
    @Index(name = "idx_bench_executed_at", columnList = "executedAt")
})
public class BenchmarkRun {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String runId; // e.g. SIM-20261019-123456-A1B2

    @Column(nullable = false)
    private LocalDateTime executedAt = LocalDateTime.now();

    @Column(nullable = false)
    private Integer totalScenarios = 20;

    @Column(nullable = false)
    private Integer successfulMatches = 0;

    @Column(nullable = false)
    private Integer failedMatches = 0;

    @Column(nullable = false)
    private Double actualMatchSuccessRate = 0.0;

    @Column(nullable = false)
    private Double actualAverageMatchingTimeSeconds = 0.0;

    @Column(nullable = false)
    private Double actualNotificationSuccessRate = 0.0;

    @Column(nullable = false)
    private Double actualDataStorageIntegrityRate = 100.0;

    @Column(nullable = false)
    private Double actualWorkflowSuccessRate = 0.0;

    @Column(nullable = false)
    private String validationOutcome = "PASS"; // PASS, PARTIAL, FAIL

    @Column(length = 1000)
    private String recommendation;

    @Column(nullable = false)
    private boolean isSimulation = true; // Explicitly labelled as simulation

    public BenchmarkRun() {}

    public BenchmarkRun(String runId, Integer totalScenarios, Integer successfulMatches, Integer failedMatches,
                        Double actualMatchSuccessRate, Double actualAverageMatchingTimeSeconds,
                        Double actualNotificationSuccessRate, Double actualDataStorageIntegrityRate,
                        Double actualWorkflowSuccessRate, String validationOutcome, String recommendation) {
        this.runId = runId;
        this.executedAt = LocalDateTime.now();
        this.totalScenarios = totalScenarios;
        this.successfulMatches = successfulMatches;
        this.failedMatches = failedMatches;
        this.actualMatchSuccessRate = actualMatchSuccessRate;
        this.actualAverageMatchingTimeSeconds = actualAverageMatchingTimeSeconds;
        this.actualNotificationSuccessRate = actualNotificationSuccessRate;
        this.actualDataStorageIntegrityRate = actualDataStorageIntegrityRate;
        this.actualWorkflowSuccessRate = actualWorkflowSuccessRate;
        this.validationOutcome = validationOutcome;
        this.recommendation = recommendation;
        this.isSimulation = true;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getRunId() { return runId; }
    public void setRunId(String runId) { this.runId = runId; }

    public LocalDateTime getExecutedAt() { return executedAt; }
    public void setExecutedAt(LocalDateTime executedAt) { this.executedAt = executedAt; }

    public Integer getTotalScenarios() { return totalScenarios; }
    public void setTotalScenarios(Integer totalScenarios) { this.totalScenarios = totalScenarios; }

    public Integer getSuccessfulMatches() { return successfulMatches; }
    public void setSuccessfulMatches(Integer successfulMatches) { this.successfulMatches = successfulMatches; }

    public Integer getFailedMatches() { return failedMatches; }
    public void setFailedMatches(Integer failedMatches) { this.failedMatches = failedMatches; }

    public Double getActualMatchSuccessRate() { return actualMatchSuccessRate; }
    public void setActualMatchSuccessRate(Double actualMatchSuccessRate) { this.actualMatchSuccessRate = actualMatchSuccessRate; }

    public Double getActualAverageMatchingTimeSeconds() { return actualAverageMatchingTimeSeconds; }
    public void setActualAverageMatchingTimeSeconds(Double actualAverageMatchingTimeSeconds) { this.actualAverageMatchingTimeSeconds = actualAverageMatchingTimeSeconds; }

    public Double getActualNotificationSuccessRate() { return actualNotificationSuccessRate; }
    public void setActualNotificationSuccessRate(Double actualNotificationSuccessRate) { this.actualNotificationSuccessRate = actualNotificationSuccessRate; }

    public Double getActualDataStorageIntegrityRate() { return actualDataStorageIntegrityRate; }
    public void setActualDataStorageIntegrityRate(Double actualDataStorageIntegrityRate) { this.actualDataStorageIntegrityRate = actualDataStorageIntegrityRate; }

    public Double getActualWorkflowSuccessRate() { return actualWorkflowSuccessRate; }
    public void setActualWorkflowSuccessRate(Double actualWorkflowSuccessRate) { this.actualWorkflowSuccessRate = actualWorkflowSuccessRate; }

    public String getValidationOutcome() { return validationOutcome; }
    public void setValidationOutcome(String validationOutcome) { this.validationOutcome = validationOutcome; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public boolean isSimulation() { return isSimulation; }
    public void setSimulation(boolean simulation) { isSimulation = simulation; }
}

package com.foodredistribution.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class BenchmarkRunDto {
    private UUID id;
    private String runId;
    private LocalDateTime executedAt;
    private Integer totalScenarios;
    private Integer successfulMatches;
    private Integer failedMatches;
    private Double actualMatchSuccessRate;
    private Double actualAverageMatchingTimeSeconds;
    private Double actualNotificationSuccessRate;
    private Double actualDataStorageIntegrityRate;
    private Double actualWorkflowSuccessRate;
    private String validationOutcome;
    private String recommendation;
    private boolean isSimulation;

    public BenchmarkRunDto() {}

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

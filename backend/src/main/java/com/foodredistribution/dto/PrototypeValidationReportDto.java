package com.foodredistribution.dto;

import com.foodredistribution.entity.PrototypeTest;
import java.time.LocalDateTime;
import java.util.List;

public class PrototypeValidationReportDto {
    private String runId;
    private boolean isSimulation = true;
    private String criticalAssumption = "The system can successfully match an available surplus-food listing with a suitable receiver within the food's available redistribution time.";
    private int totalTestCases;
    private int successfulMatches;
    private int failedMatches;

    // Actual calculated rates
    private double actualMatchSuccessRate;
    private double actualAverageMatchingTimeSeconds;
    private double actualNotificationSuccessRate;
    private double actualDataStorageIntegrityRate;
    private double actualWorkflowSuccessRate;

    // Targets
    private double targetMatchSuccessRate = 80.0;
    private double targetAverageMatchingTimeSeconds = 30.0;
    private double targetNotificationSuccessRate = 90.0;
    private double targetDataStorageIntegrityRate = 100.0;
    private double targetWorkflowSuccessRate = 90.0;

    private String validationOutcome; // PASS, PARTIAL, FAIL
    private String nextInterventionRecommendation;
    private LocalDateTime benchmarkTimestamp;
    private List<PrototypeTest> scenarios;

    public PrototypeValidationReportDto() {
        this.benchmarkTimestamp = LocalDateTime.now();
    }

    public String getRunId() { return runId; }
    public void setRunId(String runId) { this.runId = runId; }

    public boolean isSimulation() { return isSimulation; }
    public void setSimulation(boolean simulation) { isSimulation = simulation; }

    public String getCriticalAssumption() { return criticalAssumption; }
    public void setCriticalAssumption(String criticalAssumption) { this.criticalAssumption = criticalAssumption; }

    public int getTotalTestCases() { return totalTestCases; }
    public void setTotalTestCases(int totalTestCases) { this.totalTestCases = totalTestCases; }

    public int getSuccessfulMatches() { return successfulMatches; }
    public void setSuccessfulMatches(int successfulMatches) { this.successfulMatches = successfulMatches; }

    public int getFailedMatches() { return failedMatches; }
    public void setFailedMatches(int failedMatches) { this.failedMatches = failedMatches; }

    public double getActualMatchSuccessRate() { return actualMatchSuccessRate; }
    public void setActualMatchSuccessRate(double actualMatchSuccessRate) { this.actualMatchSuccessRate = actualMatchSuccessRate; }

    public double getActualAverageMatchingTimeSeconds() { return actualAverageMatchingTimeSeconds; }
    public void setActualAverageMatchingTimeSeconds(double actualAverageMatchingTimeSeconds) { this.actualAverageMatchingTimeSeconds = actualAverageMatchingTimeSeconds; }

    public double getActualNotificationSuccessRate() { return actualNotificationSuccessRate; }
    public void setActualNotificationSuccessRate(double actualNotificationSuccessRate) { this.actualNotificationSuccessRate = actualNotificationSuccessRate; }

    public double getActualDataStorageIntegrityRate() { return actualDataStorageIntegrityRate; }
    public void setActualDataStorageIntegrityRate(double actualDataStorageIntegrityRate) { this.actualDataStorageIntegrityRate = actualDataStorageIntegrityRate; }

    public double getActualWorkflowSuccessRate() { return actualWorkflowSuccessRate; }
    public void setActualWorkflowSuccessRate(double actualWorkflowSuccessRate) { this.actualWorkflowSuccessRate = actualWorkflowSuccessRate; }

    public double getTargetMatchSuccessRate() { return targetMatchSuccessRate; }
    public void setTargetMatchSuccessRate(double targetMatchSuccessRate) { this.targetMatchSuccessRate = targetMatchSuccessRate; }

    public double getTargetAverageMatchingTimeSeconds() { return targetAverageMatchingTimeSeconds; }
    public void setTargetAverageMatchingTimeSeconds(double targetAverageMatchingTimeSeconds) { this.targetAverageMatchingTimeSeconds = targetAverageMatchingTimeSeconds; }

    public double getTargetNotificationSuccessRate() { return targetNotificationSuccessRate; }
    public void setTargetNotificationSuccessRate(double targetNotificationSuccessRate) { this.targetNotificationSuccessRate = targetNotificationSuccessRate; }

    public double getTargetDataStorageIntegrityRate() { return targetDataStorageIntegrityRate; }
    public void setTargetDataStorageIntegrityRate(double targetDataStorageIntegrityRate) { this.targetDataStorageIntegrityRate = targetDataStorageIntegrityRate; }

    public double getTargetWorkflowSuccessRate() { return targetWorkflowSuccessRate; }
    public void setTargetWorkflowSuccessRate(double targetWorkflowSuccessRate) { this.targetWorkflowSuccessRate = targetWorkflowSuccessRate; }

    public String getValidationOutcome() { return validationOutcome; }
    public void setValidationOutcome(String validationOutcome) { this.validationOutcome = validationOutcome; }

    public String getNextInterventionRecommendation() { return nextInterventionRecommendation; }
    public void setNextInterventionRecommendation(String nextInterventionRecommendation) { this.nextInterventionRecommendation = nextInterventionRecommendation; }

    public LocalDateTime getBenchmarkTimestamp() { return benchmarkTimestamp; }
    public void setBenchmarkTimestamp(LocalDateTime benchmarkTimestamp) { this.benchmarkTimestamp = benchmarkTimestamp; }

    public List<PrototypeTest> getScenarios() { return scenarios; }
    public void setScenarios(List<PrototypeTest> scenarios) { this.scenarios = scenarios; }
}

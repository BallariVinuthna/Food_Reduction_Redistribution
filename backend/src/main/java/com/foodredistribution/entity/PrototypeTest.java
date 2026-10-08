package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "prototype_tests")
public class PrototypeTest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String scenarioName;

    private String foodType;
    private Double quantity;
    private Integer availableMinutes;
    private String locationName;
    private Double distanceKm;

    private String matchedReceiverName;
    private Double matchScore;
    private Long executionTimeMs;

    @Column(nullable = false)
    private boolean matchSuccess;

    private boolean notificationSuccess;
    private boolean storageSuccess;
    private boolean workflowSuccess;

    private String failureReason;

    @Column(name = "test_timestamp", nullable = false)
    private LocalDateTime testTimestamp = LocalDateTime.now();

    public PrototypeTest() {}

    public PrototypeTest(String scenarioName, String foodType, Double quantity, Integer availableMinutes,
                         String locationName, Double distanceKm, String matchedReceiverName, Double matchScore,
                         Long executionTimeMs, boolean matchSuccess, boolean notificationSuccess,
                         boolean storageSuccess, boolean workflowSuccess, String failureReason) {
        this.scenarioName = scenarioName;
        this.foodType = foodType;
        this.quantity = quantity;
        this.availableMinutes = availableMinutes;
        this.locationName = locationName;
        this.distanceKm = distanceKm;
        this.matchedReceiverName = matchedReceiverName;
        this.matchScore = matchScore;
        this.executionTimeMs = executionTimeMs;
        this.matchSuccess = matchSuccess;
        this.notificationSuccess = notificationSuccess;
        this.storageSuccess = storageSuccess;
        this.workflowSuccess = workflowSuccess;
        this.failureReason = failureReason;
        this.testTimestamp = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getScenarioName() { return scenarioName; }
    public void setScenarioName(String scenarioName) { this.scenarioName = scenarioName; }

    public String getFoodType() { return foodType; }
    public void setFoodType(String foodType) { this.foodType = foodType; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public Integer getAvailableMinutes() { return availableMinutes; }
    public void setAvailableMinutes(Integer availableMinutes) { this.availableMinutes = availableMinutes; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public String getMatchedReceiverName() { return matchedReceiverName; }
    public void setMatchedReceiverName(String matchedReceiverName) { this.matchedReceiverName = matchedReceiverName; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }

    public Long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(Long executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    public boolean isMatchSuccess() { return matchSuccess; }
    public void setMatchSuccess(boolean matchSuccess) { this.matchSuccess = matchSuccess; }

    public boolean isNotificationSuccess() { return notificationSuccess; }
    public void setNotificationSuccess(boolean notificationSuccess) { this.notificationSuccess = notificationSuccess; }

    public boolean isStorageSuccess() { return storageSuccess; }
    public void setStorageSuccess(boolean storageSuccess) { this.storageSuccess = storageSuccess; }

    public boolean isWorkflowSuccess() { return workflowSuccess; }
    public void setWorkflowSuccess(boolean workflowSuccess) { this.workflowSuccess = workflowSuccess; }

    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }

    public LocalDateTime getTestTimestamp() { return testTimestamp; }
    public void setTestTimestamp(LocalDateTime testTimestamp) { this.testTimestamp = testTimestamp; }
}

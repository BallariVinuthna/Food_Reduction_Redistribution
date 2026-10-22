package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pse_experiments")
public class PseExperiment {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(name = "experiment_name", length = 255, nullable = false)
    private String experimentName;

    @Column(name = "hypothesis", length = 1000, nullable = false)
    private String hypothesis;

    @Column(name = "participating_providers", length = 500)
    private String participatingProviders;

    @Column(name = "participating_receivers", length = 500)
    private String participatingReceivers;

    @Column(name = "baseline_period_start")
    private LocalDate baselinePeriodStart;

    @Column(name = "baseline_period_end")
    private LocalDate baselinePeriodEnd;

    @Column(name = "intervention_period_start")
    private LocalDate interventionPeriodStart;

    @Column(name = "intervention_period_end")
    private LocalDate interventionPeriodEnd;

    @Column(name = "data_collection_method", length = 255)
    private String dataCollectionMethod = "PLATFORM_AUDIT_LOGS_AND_PHYSICAL_SCALES";

    @Column(name = "success_criteria", length = 500)
    private String successCriteria;

    // Evaluated Metric Results
    @Column(name = "baseline_waste_discarded_kg")
    private Double baselineWasteDiscardedKg;

    @Column(name = "intervention_waste_discarded_kg")
    private Double interventionWasteDiscardedKg;

    @Column(name = "waste_reduction_pct")
    private Double wasteReductionPct;

    @Column(name = "completed_pickup_rate_pct")
    private Double completedPickupRatePct;

    @Column(name = "delivery_success_rate_pct")
    private Double deliverySuccessRatePct;

    @Column(name = "average_transit_time_minutes")
    private Double averageTransitTimeMinutes;

    @Column(name = "total_meals_redistributed")
    private Double totalMealsRedistributed;

    @Column(name = "sample_size_observations")
    private Integer sampleSizeObservations = 0;

    @Column(name = "outcome_status", length = 50) // PASS, PARTIAL, IN_PROGRESS, INSUFFICIENT_DATA
    private String outcomeStatus = "IN_PROGRESS";

    @Column(name = "limitations_and_notes", length = 1000)
    private String limitationsAndNotes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public PseExperiment() {
        this.id = UUID.randomUUID().toString();
    }

    public PseExperiment(String experimentName, String hypothesis, String participatingProviders,
                         String participatingReceivers, LocalDate baselinePeriodStart, LocalDate baselinePeriodEnd,
                         LocalDate interventionPeriodStart, LocalDate interventionPeriodEnd, String successCriteria) {
        this();
        this.experimentName = experimentName;
        this.hypothesis = hypothesis;
        this.participatingProviders = participatingProviders;
        this.participatingReceivers = participatingReceivers;
        this.baselinePeriodStart = baselinePeriodStart;
        this.baselinePeriodEnd = baselinePeriodEnd;
        this.interventionPeriodStart = interventionPeriodStart;
        this.interventionPeriodEnd = interventionPeriodEnd;
        this.successCriteria = successCriteria;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getExperimentName() { return experimentName; }
    public void setExperimentName(String experimentName) { this.experimentName = experimentName; }

    public String getHypothesis() { return hypothesis; }
    public void setHypothesis(String hypothesis) { this.hypothesis = hypothesis; }

    public String getParticipatingProviders() { return participatingProviders; }
    public void setParticipatingProviders(String participatingProviders) { this.participatingProviders = participatingProviders; }

    public String getParticipatingReceivers() { return participatingReceivers; }
    public void setParticipatingReceivers(String participatingReceivers) { this.participatingReceivers = participatingReceivers; }

    public LocalDate getBaselinePeriodStart() { return baselinePeriodStart; }
    public void setBaselinePeriodStart(LocalDate baselinePeriodStart) { this.baselinePeriodStart = baselinePeriodStart; }

    public LocalDate getBaselinePeriodEnd() { return baselinePeriodEnd; }
    public void setBaselinePeriodEnd(LocalDate baselinePeriodEnd) { this.baselinePeriodEnd = baselinePeriodEnd; }

    public LocalDate getInterventionPeriodStart() { return interventionPeriodStart; }
    public void setInterventionPeriodStart(LocalDate interventionPeriodStart) { this.interventionPeriodStart = interventionPeriodStart; }

    public LocalDate getInterventionPeriodEnd() { return interventionPeriodEnd; }
    public void setInterventionPeriodEnd(LocalDate interventionPeriodEnd) { this.interventionPeriodEnd = interventionPeriodEnd; }

    public String getDataCollectionMethod() { return dataCollectionMethod; }
    public void setDataCollectionMethod(String dataCollectionMethod) { this.dataCollectionMethod = dataCollectionMethod; }

    public String getSuccessCriteria() { return successCriteria; }
    public void setSuccessCriteria(String successCriteria) { this.successCriteria = successCriteria; }

    public Double getBaselineWasteDiscardedKg() { return baselineWasteDiscardedKg; }
    public void setBaselineWasteDiscardedKg(Double baselineWasteDiscardedKg) { this.baselineWasteDiscardedKg = baselineWasteDiscardedKg; }

    public Double getInterventionWasteDiscardedKg() { return interventionWasteDiscardedKg; }
    public void setInterventionWasteDiscardedKg(Double interventionWasteDiscardedKg) { this.interventionWasteDiscardedKg = interventionWasteDiscardedKg; }

    public Double getWasteReductionPct() { return wasteReductionPct; }
    public void setWasteReductionPct(Double wasteReductionPct) { this.wasteReductionPct = wasteReductionPct; }

    public Double getCompletedPickupRatePct() { return completedPickupRatePct; }
    public void setCompletedPickupRatePct(Double completedPickupRatePct) { this.completedPickupRatePct = completedPickupRatePct; }

    public Double getDeliverySuccessRatePct() { return deliverySuccessRatePct; }
    public void setDeliverySuccessRatePct(Double deliverySuccessRatePct) { this.deliverySuccessRatePct = deliverySuccessRatePct; }

    public Double getAverageTransitTimeMinutes() { return averageTransitTimeMinutes; }
    public void setAverageTransitTimeMinutes(Double averageTransitTimeMinutes) { this.averageTransitTimeMinutes = averageTransitTimeMinutes; }

    public Double getTotalMealsRedistributed() { return totalMealsRedistributed; }
    public void setTotalMealsRedistributed(Double totalMealsRedistributed) { this.totalMealsRedistributed = totalMealsRedistributed; }

    public Integer getSampleSizeObservations() { return sampleSizeObservations; }
    public void setSampleSizeObservations(Integer sampleSizeObservations) { this.sampleSizeObservations = sampleSizeObservations; }

    public String getOutcomeStatus() { return outcomeStatus; }
    public void setOutcomeStatus(String outcomeStatus) { this.outcomeStatus = outcomeStatus; }

    public String getLimitationsAndNotes() { return limitationsAndNotes; }
    public void setLimitationsAndNotes(String limitationsAndNotes) { this.limitationsAndNotes = limitationsAndNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

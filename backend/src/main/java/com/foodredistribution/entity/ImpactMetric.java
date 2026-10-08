package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "impact_metrics")
public class ImpactMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Long totalListings = 0L;
    private Double totalQuantityListed = 0.0;
    private Double totalQuantityAccepted = 0.0;
    private Double totalQuantityCollected = 0.0;
    private Double totalQuantityRedistributed = 0.0;
    private Double totalQuantityExpired = 0.0;
    private Double totalQuantityCancelled = 0.0;

    private Double redistributionRate = 0.0;
    private Double matchSuccessRate = 0.0;
    private Double foodWasteAvoidedKg = 0.0;
    private Double estimatedValueSavedInr = 0.0;

    private Double avgMatchingTimeSeconds = 0.0;
    private Double avgPickupTimeMinutes = 0.0;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public ImpactMetric() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Long getTotalListings() { return totalListings; }
    public void setTotalListings(Long totalListings) { this.totalListings = totalListings; }

    public Double getTotalQuantityListed() { return totalQuantityListed; }
    public void setTotalQuantityListed(Double totalQuantityListed) { this.totalQuantityListed = totalQuantityListed; }

    public Double getTotalQuantityAccepted() { return totalQuantityAccepted; }
    public void setTotalQuantityAccepted(Double totalQuantityAccepted) { this.totalQuantityAccepted = totalQuantityAccepted; }

    public Double getTotalQuantityCollected() { return totalQuantityCollected; }
    public void setTotalQuantityCollected(Double totalQuantityCollected) { this.totalQuantityCollected = totalQuantityCollected; }

    public Double getTotalQuantityRedistributed() { return totalQuantityRedistributed; }
    public void setTotalQuantityRedistributed(Double totalQuantityRedistributed) { this.totalQuantityRedistributed = totalQuantityRedistributed; }

    public Double getTotalQuantityExpired() { return totalQuantityExpired; }
    public void setTotalQuantityExpired(Double totalQuantityExpired) { this.totalQuantityExpired = totalQuantityExpired; }

    public Double getTotalQuantityCancelled() { return totalQuantityCancelled; }
    public void setTotalQuantityCancelled(Double totalQuantityCancelled) { this.totalQuantityCancelled = totalQuantityCancelled; }

    public Double getRedistributionRate() { return redistributionRate; }
    public void setRedistributionRate(Double redistributionRate) { this.redistributionRate = redistributionRate; }

    public Double getMatchSuccessRate() { return matchSuccessRate; }
    public void setMatchSuccessRate(Double matchSuccessRate) { this.matchSuccessRate = matchSuccessRate; }

    public Double getFoodWasteAvoidedKg() { return foodWasteAvoidedKg; }
    public void setFoodWasteAvoidedKg(Double foodWasteAvoidedKg) { this.foodWasteAvoidedKg = foodWasteAvoidedKg; }

    public Double getEstimatedValueSavedInr() { return estimatedValueSavedInr; }
    public void setEstimatedValueSavedInr(Double estimatedValueSavedInr) { this.estimatedValueSavedInr = estimatedValueSavedInr; }

    public Double getAvgMatchingTimeSeconds() { return avgMatchingTimeSeconds; }
    public void setAvgMatchingTimeSeconds(Double avgMatchingTimeSeconds) { this.avgMatchingTimeSeconds = avgMatchingTimeSeconds; }

    public Double getAvgPickupTimeMinutes() { return avgPickupTimeMinutes; }
    public void setAvgPickupTimeMinutes(Double avgPickupTimeMinutes) { this.avgPickupTimeMinutes = avgPickupTimeMinutes; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

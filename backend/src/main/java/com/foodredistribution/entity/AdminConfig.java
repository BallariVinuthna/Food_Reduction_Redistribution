package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "admin_configs")
public class AdminConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private Double weightDistance = 0.30;

    @Column(nullable = false)
    private Double weightQuantity = 0.20;

    @Column(nullable = false)
    private Double weightUrgency = 0.20;

    @Column(nullable = false)
    private Double weightFoodType = 0.15;

    @Column(nullable = false)
    private Double weightCapacity = 0.10;

    @Column(nullable = false)
    private Double weightAvailability = 0.05;

    @Column(nullable = false)
    private Double maxSearchRadiusKm = 25.0;

    @Column(nullable = false)
    private Integer urgencyCriticalMinutes = 60;

    @Column(nullable = false)
    private Integer urgencyHighMinutes = 120;

    @Column(nullable = false)
    private Integer urgencyMediumMinutes = 240;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public AdminConfig() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Double getWeightDistance() { return weightDistance; }
    public void setWeightDistance(Double weightDistance) { this.weightDistance = weightDistance; }

    public Double getWeightQuantity() { return weightQuantity; }
    public void setWeightQuantity(Double weightQuantity) { this.weightQuantity = weightQuantity; }

    public Double getWeightUrgency() { return weightUrgency; }
    public void setWeightUrgency(Double weightUrgency) { this.weightUrgency = weightUrgency; }

    public Double getFoodTypeScoreWeight() { return weightFoodType; }
    public Double getWeightFoodType() { return weightFoodType; }
    public void setWeightFoodType(Double weightFoodType) { this.weightFoodType = weightFoodType; }

    public Double getWeightCapacity() { return weightCapacity; }
    public void setWeightCapacity(Double weightCapacity) { this.weightCapacity = weightCapacity; }

    public Double getWeightAvailability() { return weightAvailability; }
    public void setWeightAvailability(Double weightAvailability) { this.weightAvailability = weightAvailability; }

    public Double getMaxSearchRadiusKm() { return maxSearchRadiusKm; }
    public void setMaxSearchRadiusKm(Double maxSearchRadiusKm) { this.maxSearchRadiusKm = maxSearchRadiusKm; }

    public Integer getUrgencyCriticalMinutes() { return urgencyCriticalMinutes; }
    public void setUrgencyCriticalMinutes(Integer urgencyCriticalMinutes) { this.urgencyCriticalMinutes = urgencyCriticalMinutes; }

    public Integer getUrgencyHighMinutes() { return urgencyHighMinutes; }
    public void setUrgencyHighMinutes(Integer urgencyHighMinutes) { this.urgencyHighMinutes = urgencyHighMinutes; }

    public Integer getUrgencyMediumMinutes() { return urgencyMediumMinutes; }
    public void setUrgencyMediumMinutes(Integer urgencyMediumMinutes) { this.urgencyMediumMinutes = urgencyMediumMinutes; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

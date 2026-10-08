package com.foodredistribution.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class AdminConfigDto {
    private UUID id;
    private Double weightDistance;
    private Double weightQuantity;
    private Double weightUrgency;
    private Double weightFoodType;
    private Double weightCapacity;
    private Double weightAvailability;
    private Double maxSearchRadiusKm;
    private Integer urgencyCriticalMinutes;
    private Integer urgencyHighMinutes;
    private Integer urgencyMediumMinutes;
    private LocalDateTime updatedAt;

    public AdminConfigDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Double getWeightDistance() { return weightDistance; }
    public void setWeightDistance(Double weightDistance) { this.weightDistance = weightDistance; }

    public Double getWeightQuantity() { return weightQuantity; }
    public void setWeightQuantity(Double weightQuantity) { this.weightQuantity = weightQuantity; }

    public Double getWeightUrgency() { return weightUrgency; }
    public void setWeightUrgency(Double weightUrgency) { this.weightUrgency = weightUrgency; }

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

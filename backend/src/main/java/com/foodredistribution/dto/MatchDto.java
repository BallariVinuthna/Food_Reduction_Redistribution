package com.foodredistribution.dto;

import com.foodredistribution.entity.MatchStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public class MatchDto {
    private UUID id;
    private UUID foodListingId;
    private String foodName;
    private Double quantity;
    private String unit;
    private UUID receiverId;
    private String receiverOrganizationName;
    private String receiverAddress;
    private Double receiverLatitude;
    private Double receiverLongitude;
    private String receiverPhone;
    private Double matchScore;
    private Double locationScore;
    private Double quantityScore;
    private Double urgencyScore;
    private Double foodTypeScore;
    private Double capacityScore;
    private Double reliabilityScore;
    private Double distanceKm;
    private Integer estimatedPickupMinutes;
    private MatchStatus status;
    private LocalDateTime proposedAt;
    private LocalDateTime respondedAt;
    private String responseNotes;

    public MatchDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getFoodListingId() { return foodListingId; }
    public void setFoodListingId(UUID foodListingId) { this.foodListingId = foodListingId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public UUID getReceiverId() { return receiverId; }
    public void setReceiverId(UUID receiverId) { this.receiverId = receiverId; }

    public String getReceiverOrganizationName() { return receiverOrganizationName; }
    public void setReceiverOrganizationName(String receiverOrganizationName) { this.receiverOrganizationName = receiverOrganizationName; }

    public String getReceiverAddress() { return receiverAddress; }
    public void setReceiverAddress(String receiverAddress) { this.receiverAddress = receiverAddress; }

    public Double getReceiverLatitude() { return receiverLatitude; }
    public void setReceiverLatitude(Double receiverLatitude) { this.receiverLatitude = receiverLatitude; }

    public Double getReceiverLongitude() { return receiverLongitude; }
    public void setReceiverLongitude(Double receiverLongitude) { this.receiverLongitude = receiverLongitude; }

    public String getReceiverPhone() { return receiverPhone; }
    public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }

    public Double getLocationScore() { return locationScore; }
    public void setLocationScore(Double locationScore) { this.locationScore = locationScore; }

    public Double getQuantityScore() { return quantityScore; }
    public void setQuantityScore(Double quantityScore) { this.quantityScore = quantityScore; }

    public Double getUrgencyScore() { return urgencyScore; }
    public void setUrgencyScore(Double urgencyScore) { this.urgencyScore = urgencyScore; }

    public Double getFoodTypeScore() { return foodTypeScore; }
    public void setFoodTypeScore(Double foodTypeScore) { this.foodTypeScore = foodTypeScore; }

    public Double getCapacityScore() { return capacityScore; }
    public void setCapacityScore(Double capacityScore) { this.capacityScore = capacityScore; }

    public Double getReliabilityScore() { return reliabilityScore; }
    public void setReliabilityScore(Double reliabilityScore) { this.reliabilityScore = reliabilityScore; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getEstimatedPickupMinutes() { return estimatedPickupMinutes; }
    public void setEstimatedPickupMinutes(Integer estimatedPickupMinutes) { this.estimatedPickupMinutes = estimatedPickupMinutes; }

    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }

    public LocalDateTime getProposedAt() { return proposedAt; }
    public void setProposedAt(LocalDateTime proposedAt) { this.proposedAt = proposedAt; }

    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }

    public String getResponseNotes() { return responseNotes; }
    public void setResponseNotes(String responseNotes) { this.responseNotes = responseNotes; }
}

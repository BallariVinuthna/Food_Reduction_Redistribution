package com.foodredistribution.dto;

import com.foodredistribution.entity.PickupStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public class PickupEventDto {
    private UUID id;
    private UUID pickupAssignmentId;
    private String eventType;
    private PickupStatus previousStatus;
    private PickupStatus newStatus;
    private String actorEmail;
    private String actorRole;
    private Double actualQuantity;
    private String verificationMethod;
    private String cancellationReason;
    private String failedReason;
    private LocalDateTime timestamp;
    private Double latitude;
    private Double longitude;
    private String description;

    public PickupEventDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getPickupAssignmentId() { return pickupAssignmentId; }
    public void setPickupAssignmentId(UUID pickupAssignmentId) { this.pickupAssignmentId = pickupAssignmentId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public PickupStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(PickupStatus previousStatus) { this.previousStatus = previousStatus; }

    public PickupStatus getNewStatus() { return newStatus; }
    public void setNewStatus(PickupStatus newStatus) { this.newStatus = newStatus; }

    public String getActorEmail() { return actorEmail; }
    public void setActorEmail(String actorEmail) { this.actorEmail = actorEmail; }

    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }

    public Double getActualQuantity() { return actualQuantity; }
    public void setActualQuantity(Double actualQuantity) { this.actualQuantity = actualQuantity; }

    public String getVerificationMethod() { return verificationMethod; }
    public void setVerificationMethod(String verificationMethod) { this.verificationMethod = verificationMethod; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public String getFailedReason() { return failedReason; }
    public void setFailedReason(String failedReason) { this.failedReason = failedReason; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

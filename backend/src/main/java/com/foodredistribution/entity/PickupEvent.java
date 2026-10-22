package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pickup_events", indexes = {
    @Index(name = "idx_event_pickup", columnList = "pickup_assignment_id"),
    @Index(name = "idx_event_timestamp", columnList = "timestamp")
})
public class PickupEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pickup_assignment_id", nullable = false)
    private PickupAssignment pickupAssignment;

    @Column(nullable = false)
    private String eventType; // ASSIGNED, EN_ROUTE, ARRIVED, COLLECTED, DELIVERED, CANCELLED, FAILED

    @Enumerated(EnumType.STRING)
    private PickupStatus previousStatus;

    @Enumerated(EnumType.STRING)
    private PickupStatus newStatus;

    private String actorEmail;
    private String actorRole;
    private Double actualQuantity;
    private String verificationMethod; // OTP, GEO_LOCATION, MANUAL_CONFIRMATION, SYSTEM
    private String cancellationReason;
    private String failedReason;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    private Double latitude;
    private Double longitude;
    private String description;

    public PickupEvent() {}

    public PickupEvent(PickupAssignment pickupAssignment, String eventType, Double latitude, Double longitude, String description) {
        this.pickupAssignment = pickupAssignment;
        this.eventType = eventType;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.timestamp = LocalDateTime.now();
    }

    public PickupEvent(PickupAssignment pickupAssignment, String actorEmail, String actorRole,
                       PickupStatus previousStatus, PickupStatus newStatus,
                       Double actualQuantity, String verificationMethod,
                       Double latitude, Double longitude, String description) {
        this.pickupAssignment = pickupAssignment;
        this.eventType = newStatus != null ? newStatus.name() : "UPDATE";
        this.actorEmail = actorEmail;
        this.actorRole = actorRole;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.actualQuantity = actualQuantity;
        this.verificationMethod = verificationMethod;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.timestamp = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public PickupAssignment getPickupAssignment() { return pickupAssignment; }
    public void setPickupAssignment(PickupAssignment pickupAssignment) { this.pickupAssignment = pickupAssignment; }

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

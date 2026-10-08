package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pickup_events")
public class PickupEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pickup_assignment_id", nullable = false)
    private PickupAssignment pickupAssignment;

    @Column(nullable = false)
    private String eventType; // ASSIGNED, EN_ROUTE, ARRIVED, COLLECTED, DELIVERED, FAILED

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

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public PickupAssignment getPickupAssignment() { return pickupAssignment; }
    public void setPickupAssignment(PickupAssignment pickupAssignment) { this.pickupAssignment = pickupAssignment; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

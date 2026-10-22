package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pickup_assignments")
public class PickupAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "volunteer_id")
    private Volunteer volunteer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PickupStatus status = PickupStatus.ASSIGNED;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt = LocalDateTime.now();

    private LocalDateTime enRouteAt;
    private LocalDateTime arrivedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    @Column(length = 10)
    private String pickupOtp;

    @Column(length = 10)
    private String deliveryOtp;

    @Column(nullable = false)
    private boolean pickupOtpVerified = false;

    @Column(nullable = false)
    private boolean deliveryOtpVerified = false;

    private Double actualQuantityCollected;
    private Double actualQuantityDelivered;
    private String cancellationReason;
    private String failedReason;

    private String proofNotes;
    private String proofPhotoUrl;

    public PickupAssignment() {}

    public PickupAssignment(Match match, Volunteer volunteer) {
        this.match = match;
        this.volunteer = volunteer;
        this.status = PickupStatus.ASSIGNED;
        this.assignedAt = LocalDateTime.now();
        // Generate random 6-digit OTPs
        this.pickupOtp = String.format("%06d", (int)(Math.random() * 900000) + 100000);
        this.deliveryOtp = String.format("%06d", (int)(Math.random() * 900000) + 100000);
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Match getMatch() { return match; }
    public void setMatch(Match match) { this.match = match; }

    public Volunteer getVolunteer() { return volunteer; }
    public void setVolunteer(Volunteer volunteer) { this.volunteer = volunteer; }

    public PickupStatus getStatus() { return status; }
    public void setStatus(PickupStatus status) { this.status = status; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getEnRouteAt() { return enRouteAt; }
    public void setEnRouteAt(LocalDateTime enRouteAt) { this.enRouteAt = enRouteAt; }

    public LocalDateTime getArrivedAt() { return arrivedAt; }
    public void setArrivedAt(LocalDateTime arrivedAt) { this.arrivedAt = arrivedAt; }

    public LocalDateTime getPickedUpAt() { return pickedUpAt; }
    public void setPickedUpAt(LocalDateTime pickedUpAt) { this.pickedUpAt = pickedUpAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public String getPickupOtp() { return pickupOtp; }
    public void setPickupOtp(String pickupOtp) { this.pickupOtp = pickupOtp; }

    public String getDeliveryOtp() { return deliveryOtp; }
    public void setDeliveryOtp(String deliveryOtp) { this.deliveryOtp = deliveryOtp; }

    public boolean isPickupOtpVerified() { return pickupOtpVerified; }
    public void setPickupOtpVerified(boolean pickupOtpVerified) { this.pickupOtpVerified = pickupOtpVerified; }

    public boolean isDeliveryOtpVerified() { return deliveryOtpVerified; }
    public void setDeliveryOtpVerified(boolean deliveryOtpVerified) { this.deliveryOtpVerified = deliveryOtpVerified; }

    public Double getActualQuantityCollected() { return actualQuantityCollected; }
    public void setActualQuantityCollected(Double actualQuantityCollected) { this.actualQuantityCollected = actualQuantityCollected; }

    public Double getActualQuantityDelivered() { return actualQuantityDelivered; }
    public void setActualQuantityDelivered(Double actualQuantityDelivered) { this.actualQuantityDelivered = actualQuantityDelivered; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public String getFailedReason() { return failedReason; }
    public void setFailedReason(String failedReason) { this.failedReason = failedReason; }

    public String getProofNotes() { return proofNotes; }
    public void setProofNotes(String proofNotes) { this.proofNotes = proofNotes; }

    public String getProofPhotoUrl() { return proofPhotoUrl; }
    public void setProofPhotoUrl(String proofPhotoUrl) { this.proofPhotoUrl = proofPhotoUrl; }
}

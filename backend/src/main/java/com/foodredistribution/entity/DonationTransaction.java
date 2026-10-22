package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "donation_transactions", indexes = {
    @Index(name = "idx_tx_listing", columnList = "food_listing_id"),
    @Index(name = "idx_tx_provider", columnList = "provider_id"),
    @Index(name = "idx_tx_receiver", columnList = "receiver_id"),
    @Index(name = "idx_tx_volunteer", columnList = "volunteer_id"),
    @Index(name = "idx_tx_status", columnList = "status"),
    @Index(name = "idx_tx_created", columnList = "created_at")
})
public class DonationTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Version
    @Column(nullable = false)
    private Long version = 0L;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "food_listing_id", nullable = false)
    private FoodListing foodListing;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "provider_id", nullable = false)
    private FoodProvider provider;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id", nullable = false)
    private Receiver receiver;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "volunteer_id")
    private Volunteer volunteer;

    @Column(nullable = false)
    private Double quantityListed;

    @Column(nullable = false)
    private Double quantityReserved;

    private Double quantityCollected;
    private Double quantityDelivered;

    @Column(nullable = false)
    private String unit = "MEALS";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status = TransactionStatus.RESERVED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus = VerificationStatus.UNVERIFIED;

    @Column(length = 10)
    private String pickupOtp;

    @Column(length = 10)
    private String deliveryOtp;

    @Column(nullable = false)
    private boolean pickupOtpVerified = false;

    @Column(nullable = false)
    private boolean deliveryOtpVerified = false;

    @Column(name = "reserved_at", nullable = false)
    private LocalDateTime reservedAt = LocalDateTime.now();

    private LocalDateTime assignedAt;
    private LocalDateTime enRouteAt;
    private LocalDateTime arrivedAt;
    private LocalDateTime collectedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime cancelledAt;

    private String cancellationReason;
    private String failedReason;
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public DonationTransaction() {}

    public DonationTransaction(FoodListing foodListing, FoodProvider provider, Receiver receiver,
                               Double quantityReserved, String unit) {
        this.foodListing = foodListing;
        this.provider = provider;
        this.receiver = receiver;
        this.quantityListed = foodListing != null ? foodListing.getQuantity() : quantityReserved;
        this.quantityReserved = quantityReserved;
        this.unit = unit != null ? unit : "MEALS";
        this.status = TransactionStatus.RESERVED;
        this.verificationStatus = VerificationStatus.UNVERIFIED;
        this.reservedAt = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public FoodListing getFoodListing() { return foodListing; }
    public void setFoodListing(FoodListing foodListing) { this.foodListing = foodListing; }

    public FoodProvider getProvider() { return provider; }
    public void setProvider(FoodProvider provider) { this.provider = provider; }

    public Receiver getReceiver() { return receiver; }
    public void setReceiver(Receiver receiver) { this.receiver = receiver; }

    public Volunteer getVolunteer() { return volunteer; }
    public void setVolunteer(Volunteer volunteer) { this.volunteer = volunteer; }

    public Double getQuantityListed() { return quantityListed; }
    public void setQuantityListed(Double quantityListed) { this.quantityListed = quantityListed; }

    public Double getQuantityReserved() { return quantityReserved; }
    public void setQuantityReserved(Double quantityReserved) { this.quantityReserved = quantityReserved; }

    public Double getQuantityCollected() { return quantityCollected; }
    public void setQuantityCollected(Double quantityCollected) { this.quantityCollected = quantityCollected; }

    public Double getQuantityDelivered() { return quantityDelivered; }
    public void setQuantityDelivered(Double quantityDelivered) { this.quantityDelivered = quantityDelivered; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }

    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getPickupOtp() { return pickupOtp; }
    public void setPickupOtp(String pickupOtp) { this.pickupOtp = pickupOtp; }

    public String getDeliveryOtp() { return deliveryOtp; }
    public void setDeliveryOtp(String deliveryOtp) { this.deliveryOtp = deliveryOtp; }

    public boolean isPickupOtpVerified() { return pickupOtpVerified; }
    public void setPickupOtpVerified(boolean pickupOtpVerified) { this.pickupOtpVerified = pickupOtpVerified; }

    public boolean isDeliveryOtpVerified() { return deliveryOtpVerified; }
    public void setDeliveryOtpVerified(boolean deliveryOtpVerified) { this.deliveryOtpVerified = deliveryOtpVerified; }

    public LocalDateTime getReservedAt() { return reservedAt; }
    public void setReservedAt(LocalDateTime reservedAt) { this.reservedAt = reservedAt; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getEnRouteAt() { return enRouteAt; }
    public void setEnRouteAt(LocalDateTime enRouteAt) { this.enRouteAt = enRouteAt; }

    public LocalDateTime getArrivedAt() { return arrivedAt; }
    public void setArrivedAt(LocalDateTime arrivedAt) { this.arrivedAt = arrivedAt; }

    public LocalDateTime getCollectedAt() { return collectedAt; }
    public void setCollectedAt(LocalDateTime collectedAt) { this.collectedAt = collectedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public LocalDateTime getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public String getFailedReason() { return failedReason; }
    public void setFailedReason(String failedReason) { this.failedReason = failedReason; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

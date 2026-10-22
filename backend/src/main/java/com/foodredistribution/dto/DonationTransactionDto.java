package com.foodredistribution.dto;

import com.foodredistribution.entity.TransactionStatus;
import com.foodredistribution.entity.VerificationStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public class DonationTransactionDto {
    private UUID id;
    private UUID foodListingId;
    private String foodName;
    private UUID providerId;
    private String providerOrganizationName;
    private UUID receiverId;
    private String receiverOrganizationName;
    private UUID volunteerId;
    private String volunteerName;
    private Double quantityListed;
    private Double quantityReserved;
    private Double quantityCollected;
    private Double quantityDelivered;
    private String unit;
    private TransactionStatus status;
    private VerificationStatus verificationStatus;
    private String pickupOtp;
    private String deliveryOtp;
    private boolean pickupOtpVerified;
    private boolean deliveryOtpVerified;
    private LocalDateTime reservedAt;
    private LocalDateTime collectedAt;
    private LocalDateTime deliveredAt;
    private String cancellationReason;
    private String failedReason;
    private String notes;

    public DonationTransactionDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getFoodListingId() { return foodListingId; }
    public void setFoodListingId(UUID foodListingId) { this.foodListingId = foodListingId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public UUID getProviderId() { return providerId; }
    public void setProviderId(UUID providerId) { this.providerId = providerId; }

    public String getProviderOrganizationName() { return providerOrganizationName; }
    public void setProviderOrganizationName(String providerOrganizationName) { this.providerOrganizationName = providerOrganizationName; }

    public UUID getReceiverId() { return receiverId; }
    public void setReceiverId(UUID receiverId) { this.receiverId = receiverId; }

    public String getReceiverOrganizationName() { return receiverOrganizationName; }
    public void setReceiverOrganizationName(String receiverOrganizationName) { this.receiverOrganizationName = receiverOrganizationName; }

    public UUID getVolunteerId() { return volunteerId; }
    public void setVolunteerId(UUID volunteerId) { this.volunteerId = volunteerId; }

    public String getVolunteerName() { return volunteerName; }
    public void setVolunteerName(String volunteerName) { this.volunteerName = volunteerName; }

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

    public LocalDateTime getCollectedAt() { return collectedAt; }
    public void setCollectedAt(LocalDateTime collectedAt) { this.collectedAt = collectedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public String getFailedReason() { return failedReason; }
    public void setFailedReason(String failedReason) { this.failedReason = failedReason; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

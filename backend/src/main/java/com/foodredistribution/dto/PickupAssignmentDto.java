package com.foodredistribution.dto;

import com.foodredistribution.entity.PickupStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class PickupAssignmentDto {
    private UUID id;
    private UUID matchId;
    private UUID foodListingId;
    private String foodName;
    private Double quantity;
    private String unit;
    private String providerOrganizationName;
    private String providerAddress;
    private Double providerLatitude;
    private Double providerLongitude;
    private String providerPhone;
    private String receiverOrganizationName;
    private String receiverAddress;
    private Double receiverLatitude;
    private Double receiverLongitude;
    private String receiverPhone;
    private UUID volunteerId;
    private String volunteerName;
    private String volunteerPhone;
    private PickupStatus status;
    private String pickupOtp;
    private String deliveryOtp;
    private boolean pickupOtpVerified;
    private boolean deliveryOtpVerified;
    private Double actualQuantityCollected;
    private Double actualQuantityDelivered;
    private String cancellationReason;
    private String failedReason;
    private LocalDateTime assignedAt;
    private LocalDateTime enRouteAt;
    private LocalDateTime arrivedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private String proofNotes;
    private String proofPhotoUrl;
    private List<PickupEventDto> events;

    public PickupAssignmentDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getMatchId() { return matchId; }
    public void setMatchId(UUID matchId) { this.matchId = matchId; }

    public UUID getFoodListingId() { return foodListingId; }
    public void setFoodListingId(UUID foodListingId) { this.foodListingId = foodListingId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getProviderOrganizationName() { return providerOrganizationName; }
    public void setProviderOrganizationName(String providerOrganizationName) { this.providerOrganizationName = providerOrganizationName; }

    public String getProviderAddress() { return providerAddress; }
    public void setProviderAddress(String providerAddress) { this.providerAddress = providerAddress; }

    public Double getProviderLatitude() { return providerLatitude; }
    public void setProviderLatitude(Double providerLatitude) { this.providerLatitude = providerLatitude; }

    public Double getProviderLongitude() { return providerLongitude; }
    public void setProviderLongitude(Double providerLongitude) { this.providerLongitude = providerLongitude; }

    public String getProviderPhone() { return providerPhone; }
    public void setProviderPhone(String providerPhone) { this.providerPhone = providerPhone; }

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

    public UUID getVolunteerId() { return volunteerId; }
    public void setVolunteerId(UUID volunteerId) { this.volunteerId = volunteerId; }

    public String getVolunteerName() { return volunteerName; }
    public void setVolunteerName(String volunteerName) { this.volunteerName = volunteerName; }

    public String getVolunteerPhone() { return volunteerPhone; }
    public void setVolunteerPhone(String volunteerPhone) { this.volunteerPhone = volunteerPhone; }

    public PickupStatus getStatus() { return status; }
    public void setStatus(PickupStatus status) { this.status = status; }

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

    public String getProofNotes() { return proofNotes; }
    public void setProofNotes(String proofNotes) { this.proofNotes = proofNotes; }

    public String getProofPhotoUrl() { return proofPhotoUrl; }
    public void setProofPhotoUrl(String proofPhotoUrl) { this.proofPhotoUrl = proofPhotoUrl; }

    public List<PickupEventDto> getEvents() { return events; }
    public void setEvents(List<PickupEventDto> events) { this.events = events; }
}

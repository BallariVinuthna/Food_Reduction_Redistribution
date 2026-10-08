package com.foodredistribution.dto;

import com.foodredistribution.entity.PickupStatus;
import jakarta.validation.constraints.NotNull;

public class UpdatePickupStatusRequest {
    @NotNull(message = "Pickup status is required")
    private PickupStatus status;

    private Double currentLatitude;
    private Double currentLongitude;
    private String proofNotes;
    private String proofPhotoUrl;

    public UpdatePickupStatusRequest() {}

    public PickupStatus getStatus() { return status; }
    public void setStatus(PickupStatus status) { this.status = status; }

    public Double getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(Double currentLatitude) { this.currentLatitude = currentLatitude; }

    public Double getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(Double currentLongitude) { this.currentLongitude = currentLongitude; }

    public String getProofNotes() { return proofNotes; }
    public void setProofNotes(String proofNotes) { this.proofNotes = proofNotes; }

    public String getProofPhotoUrl() { return proofPhotoUrl; }
    public void setProofPhotoUrl(String proofPhotoUrl) { this.proofPhotoUrl = proofPhotoUrl; }
}

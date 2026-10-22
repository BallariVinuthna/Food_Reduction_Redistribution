package com.foodredistribution.dto;

import com.foodredistribution.entity.VerificationStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public class FieldWasteRecordDto {
    private UUID id;
    private String venueName;
    private String venueType;
    private String locality;
    private String foodCategory;
    private Double quantity;
    private String unit;
    private LocalDateTime observationPeriodStart;
    private LocalDateTime observationPeriodEnd;
    private String observationShift;
    private String dataSource;
    private String auditorName;
    private VerificationStatus verificationStatus;
    private LocalDateTime verifiedAt;
    private String verifiedBy;
    private boolean isDemo;
    private String notes;
    private LocalDateTime createdAt;

    public FieldWasteRecordDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }

    public String getVenueType() { return venueType; }
    public void setVenueType(String venueType) { this.venueType = venueType; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getFoodCategory() { return foodCategory; }
    public void setFoodCategory(String foodCategory) { this.foodCategory = foodCategory; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDateTime getObservationPeriodStart() { return observationPeriodStart; }
    public void setObservationPeriodStart(LocalDateTime observationPeriodStart) { this.observationPeriodStart = observationPeriodStart; }

    public LocalDateTime getObservationPeriodEnd() { return observationPeriodEnd; }
    public void setObservationPeriodEnd(LocalDateTime observationPeriodEnd) { this.observationPeriodEnd = observationPeriodEnd; }

    public String getObservationShift() { return observationShift; }
    public void setObservationShift(String observationShift) { this.observationShift = observationShift; }

    public String getDataSource() { return dataSource; }
    public void setDataSource(String dataSource) { this.dataSource = dataSource; }

    public String getAuditorName() { return auditorName; }
    public void setAuditorName(String auditorName) { this.auditorName = auditorName; }

    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

    public boolean isDemo() { return isDemo; }
    public void setDemo(boolean demo) { isDemo = demo; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

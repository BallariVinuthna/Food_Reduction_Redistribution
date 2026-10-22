package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "field_waste_records", indexes = {
    @Index(name = "idx_waste_venue_type", columnList = "venueType"),
    @Index(name = "idx_waste_locality", columnList = "locality"),
    @Index(name = "idx_waste_category", columnList = "foodCategory"),
    @Index(name = "idx_waste_verification", columnList = "verificationStatus"),
    @Index(name = "idx_waste_demo", columnList = "isDemo"),
    @Index(name = "idx_waste_period_start", columnList = "observationPeriodStart")
})
public class FieldWasteRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String venueName;

    @Column(nullable = false)
    private String venueType; // RESTAURANT, HOTEL, BANQUET_HALL, COLLEGE_CANTEEN, CORPORATE_CAFETERIA, SUPERMARKET, MARRIAGE_HALL, COMMUNITY_KITCHEN

    @Column(nullable = false)
    private String locality; // Banjara Hills, Hitec City, Gachibowli, Secunderabad, Jubilee Hills, Begumpet, etc.

    @Column(nullable = false)
    private String foodCategory; // COOKED_MEALS, RAW_PRODUCE, BAKERY_BREAD, PACKAGED_GROCERIES, DAIRY

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private String unit = "KG"; // KG, MEALS

    @Column(name = "observation_period_start", nullable = false)
    private LocalDateTime observationPeriodStart;

    @Column(name = "observation_period_end", nullable = false)
    private LocalDateTime observationPeriodEnd;

    private String observationShift; // LUNCH_BUFFET, DINNER_SERVICE, CLOSING_INVENTORY, BANQUET_SURPLUS

    @Column(nullable = false)
    private String dataSource; // PHYSICAL_AUDIT_SCALE, KITCHEN_LOG_SHEET, FSSAI_SURVEY

    private String auditorName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus = VerificationStatus.UNVERIFIED;

    private LocalDateTime verifiedAt;
    private String verifiedBy;

    @Column(nullable = false)
    private boolean isDemo = false; // Real field observations have isDemo=false!

    @Column(length = 1000)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public FieldWasteRecord() {}

    public FieldWasteRecord(String venueName, String venueType, String locality, String foodCategory,
                            Double quantity, String unit, LocalDateTime observationPeriodStart,
                            LocalDateTime observationPeriodEnd, String observationShift,
                            String dataSource, String auditorName, boolean isDemo, String notes) {
        this.venueName = venueName;
        this.venueType = venueType;
        this.locality = locality;
        this.foodCategory = foodCategory;
        this.quantity = quantity;
        this.unit = unit != null ? unit : "KG";
        this.observationPeriodStart = observationPeriodStart;
        this.observationPeriodEnd = observationPeriodEnd;
        this.observationShift = observationShift;
        this.dataSource = dataSource;
        this.auditorName = auditorName;
        this.isDemo = isDemo;
        this.notes = notes;
        this.verificationStatus = isDemo ? VerificationStatus.VERIFIED : VerificationStatus.UNVERIFIED;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

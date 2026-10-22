package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "waste_diary_entries")
public class WasteDiaryEntry {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(name = "provider_id", length = 36, nullable = false)
    private String providerId;

    @Column(name = "provider_name", length = 255)
    private String providerName;

    @Column(name = "food_item_name", length = 255, nullable = false)
    private String foodItemName;

    @Column(name = "food_category", length = 100, nullable = false)
    private String foodCategory;

    @Column(name = "quantity_prepared", nullable = false)
    private Double quantityPrepared;

    @Column(name = "quantity_sold_or_consumed", nullable = false)
    private Double quantitySoldOrConsumed;

    @Column(name = "quantity_donated", nullable = false)
    private Double quantityDonated;

    @Column(name = "quantity_reused_safely")
    private Double quantityReusedSafely = 0.0;

    @Column(name = "quantity_discarded", nullable = false)
    private Double quantityDiscarded;

    @Column(name = "unit", length = 50, nullable = false)
    private String unit = "MEALS";

    @Column(name = "waste_reason", length = 100, nullable = false) // OVER_PREPARATION, WEATHER_RAIN, ORDER_CANCELLATION, BUFFET_RESIDUAL, SPOILAGE
    private String wasteReason;

    @Column(name = "meal_period", length = 50, nullable = false) // LUNCH, DINNER, BANQUET, BREAKFAST
    private String mealPeriod;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate = LocalDate.now();

    @Column(name = "is_measured")
    private Boolean isMeasured = true; // true if weighed on physical scale, false if estimated

    @Column(name = "preventive_action_recommendation", length = 500)
    private String preventiveActionRecommendation;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public WasteDiaryEntry() {
        this.id = UUID.randomUUID().toString();
    }

    public WasteDiaryEntry(String providerId, String providerName, String foodItemName, String foodCategory,
                           Double quantityPrepared, Double quantitySoldOrConsumed, Double quantityDonated,
                           Double quantityReusedSafely, Double quantityDiscarded, String unit,
                           String wasteReason, String mealPeriod, LocalDate entryDate, Boolean isMeasured) {
        this();
        this.providerId = providerId;
        this.providerName = providerName;
        this.foodItemName = foodItemName;
        this.foodCategory = foodCategory;
        this.quantityPrepared = quantityPrepared;
        this.quantitySoldOrConsumed = quantitySoldOrConsumed;
        this.quantityDonated = quantityDonated;
        this.quantityReusedSafely = quantityReusedSafely != null ? quantityReusedSafely : 0.0;
        this.quantityDiscarded = quantityDiscarded;
        this.unit = unit;
        this.wasteReason = wasteReason;
        this.mealPeriod = mealPeriod;
        this.entryDate = entryDate != null ? entryDate : LocalDate.now();
        this.isMeasured = isMeasured != null ? isMeasured : true;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getFoodItemName() { return foodItemName; }
    public void setFoodItemName(String foodItemName) { this.foodItemName = foodItemName; }

    public String getFoodCategory() { return foodCategory; }
    public void setFoodCategory(String foodCategory) { this.foodCategory = foodCategory; }

    public Double getQuantityPrepared() { return quantityPrepared; }
    public void setQuantityPrepared(Double quantityPrepared) { this.quantityPrepared = quantityPrepared; }

    public Double getQuantitySoldOrConsumed() { return quantitySoldOrConsumed; }
    public void setQuantitySoldOrConsumed(Double quantitySoldOrConsumed) { this.quantitySoldOrConsumed = quantitySoldOrConsumed; }

    public Double getQuantityDonated() { return quantityDonated; }
    public void setQuantityDonated(Double quantityDonated) { this.quantityDonated = quantityDonated; }

    public Double getQuantityReusedSafely() { return quantityReusedSafely; }
    public void setQuantityReusedSafely(Double quantityReusedSafely) { this.quantityReusedSafely = quantityReusedSafely; }

    public Double getQuantityDiscarded() { return quantityDiscarded; }
    public void setQuantityDiscarded(Double quantityDiscarded) { this.quantityDiscarded = quantityDiscarded; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getWasteReason() { return wasteReason; }
    public void setWasteReason(String wasteReason) { this.wasteReason = wasteReason; }

    public String getMealPeriod() { return mealPeriod; }
    public void setMealPeriod(String mealPeriod) { this.mealPeriod = mealPeriod; }

    public LocalDate getEntryDate() { return entryDate; }
    public void setEntryDate(LocalDate entryDate) { this.entryDate = entryDate; }

    public Boolean getIsMeasured() { return isMeasured; }
    public void setIsMeasured(Boolean isMeasured) { this.isMeasured = isMeasured; }

    public String getPreventiveActionRecommendation() { return preventiveActionRecommendation; }
    public void setPreventiveActionRecommendation(String preventiveActionRecommendation) { this.preventiveActionRecommendation = preventiveActionRecommendation; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

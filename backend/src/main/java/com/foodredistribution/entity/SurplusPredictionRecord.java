package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "surplus_prediction_records")
public class SurplusPredictionRecord {

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

    @Column(name = "day_of_week", length = 20, nullable = false)
    private String dayOfWeek;

    @Column(name = "meal_period", length = 50, nullable = false) // LUNCH, DINNER, BREAKFAST, BANQUET
    private String mealPeriod;

    @Column(name = "quantity_prepared", nullable = false)
    private Double quantityPrepared;

    @Column(name = "quantity_consumed")
    private Double quantityConsumed;

    @Column(name = "quantity_donated")
    private Double quantityDonated;

    @Column(name = "quantity_discarded")
    private Double quantityDiscarded;

    @Column(name = "unit", length = 50, nullable = false)
    private String unit = "MEALS";

    // Forecast Outputs
    @Column(name = "predicted_demand")
    private Double predictedDemand;

    @Column(name = "predicted_surplus")
    private Double predictedSurplus;

    @Column(name = "confidence_min")
    private Double confidenceMin;

    @Column(name = "confidence_max")
    private Double confidenceMax;

    @Column(name = "suggested_prep_quantity")
    private Double suggestedPrepQuantity;

    @Column(name = "forecast_accuracy_pct")
    private Double forecastAccuracyPct;

    @Column(name = "influencing_factors", length = 500)
    private String influencingFactors;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate = LocalDate.now();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public SurplusPredictionRecord() {
        this.id = UUID.randomUUID().toString();
    }

    public SurplusPredictionRecord(String providerId, String providerName, String foodItemName, String foodCategory,
                                   String dayOfWeek, String mealPeriod, Double quantityPrepared, Double quantityConsumed,
                                   Double quantityDonated, Double quantityDiscarded, String unit) {
        this();
        this.providerId = providerId;
        this.providerName = providerName;
        this.foodItemName = foodItemName;
        this.foodCategory = foodCategory;
        this.dayOfWeek = dayOfWeek;
        this.mealPeriod = mealPeriod;
        this.quantityPrepared = quantityPrepared;
        this.quantityConsumed = quantityConsumed;
        this.quantityDonated = quantityDonated;
        this.quantityDiscarded = quantityDiscarded;
        this.unit = unit;
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

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public String getMealPeriod() { return mealPeriod; }
    public void setMealPeriod(String mealPeriod) { this.mealPeriod = mealPeriod; }

    public Double getQuantityPrepared() { return quantityPrepared; }
    public void setQuantityPrepared(Double quantityPrepared) { this.quantityPrepared = quantityPrepared; }

    public Double getQuantityConsumed() { return quantityConsumed; }
    public void setQuantityConsumed(Double quantityConsumed) { this.quantityConsumed = quantityConsumed; }

    public Double getQuantityDonated() { return quantityDonated; }
    public void setQuantityDonated(Double quantityDonated) { this.quantityDonated = quantityDonated; }

    public Double getQuantityDiscarded() { return quantityDiscarded; }
    public void setQuantityDiscarded(Double quantityDiscarded) { this.quantityDiscarded = quantityDiscarded; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Double getPredictedDemand() { return predictedDemand; }
    public void setPredictedDemand(Double predictedDemand) { this.predictedDemand = predictedDemand; }

    public Double getPredictedSurplus() { return predictedSurplus; }
    public void setPredictedSurplus(Double predictedSurplus) { this.predictedSurplus = predictedSurplus; }

    public Double getConfidenceMin() { return confidenceMin; }
    public void setConfidenceMin(Double confidenceMin) { this.confidenceMin = confidenceMin; }

    public Double getConfidenceMax() { return confidenceMax; }
    public void setConfidenceMax(Double confidenceMax) { this.confidenceMax = confidenceMax; }

    public Double getSuggestedPrepQuantity() { return suggestedPrepQuantity; }
    public void setSuggestedPrepQuantity(Double suggestedPrepQuantity) { this.suggestedPrepQuantity = suggestedPrepQuantity; }

    public Double getForecastAccuracyPct() { return forecastAccuracyPct; }
    public void setForecastAccuracyPct(Double forecastAccuracyPct) { this.forecastAccuracyPct = forecastAccuracyPct; }

    public String getInfluencingFactors() { return influencingFactors; }
    public void setInfluencingFactors(String influencingFactors) { this.influencingFactors = influencingFactors; }

    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

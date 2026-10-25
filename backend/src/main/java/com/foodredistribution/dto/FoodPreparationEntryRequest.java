package com.foodredistribution.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class FoodPreparationEntryRequest {

    @NotBlank(message = "Food item name is required.")
    private String foodItemName;

    @NotBlank(message = "Food category is required.")
    private String foodCategory;

    @NotNull(message = "Record date is required.")
    private LocalDate recordDate;

    @NotBlank(message = "Meal period is required (e.g., BREAKFAST, LUNCH, SNACKS, DINNER).")
    private String mealPeriod;

    @NotNull(message = "Quantity prepared is required.")
    @Min(value = 0, message = "Quantity prepared must not be negative.")
    private Double quantityPrepared;

    @NotNull(message = "Quantity served/sold is required.")
    @Min(value = 0, message = "Quantity served must not be negative.")
    private Double quantityConsumed;

    @Min(value = 0, message = "Quantity donated must not be negative.")
    private Double quantityDonated = 0.0;

    @Min(value = 0, message = "Quantity discarded must not be negative.")
    private Double quantityDiscarded = 0.0;

    @Min(value = 0, message = "Customers served count must not be negative.")
    private Integer customersServed;

    @NotBlank(message = "Unit of measurement is required (e.g., PORTIONS, PLATES, KG, MEALS).")
    private String unit = "PORTIONS";

    private String notes;

    @Min(value = 0, message = "Safety margin percentage must not be negative.")
    private Double safetyMarginPct = 10.0;

    public FoodPreparationEntryRequest() {}

    public String getFoodItemName() { return foodItemName; }
    public void setFoodItemName(String foodItemName) { this.foodItemName = foodItemName; }

    public String getFoodCategory() { return foodCategory; }
    public void setFoodCategory(String foodCategory) { this.foodCategory = foodCategory; }

    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }

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

    public Integer getCustomersServed() { return customersServed; }
    public void setCustomersServed(Integer customersServed) { this.customersServed = customersServed; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Double getSafetyMarginPct() { return safetyMarginPct; }
    public void setSafetyMarginPct(Double safetyMarginPct) { this.safetyMarginPct = safetyMarginPct; }
}

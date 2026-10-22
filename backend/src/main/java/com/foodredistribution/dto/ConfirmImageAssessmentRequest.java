package com.foodredistribution.dto;

public class ConfirmImageAssessmentRequest {

    private String confirmedFoodName;
    private String confirmedCategory;
    private Double confirmedQuantity;
    private String confirmedUnit;
    private String confirmedStorage;
    private String confirmedAllergens;
    private Integer confirmedMinutes;
    private Boolean applyToListing;

    public ConfirmImageAssessmentRequest() {}

    public String getConfirmedFoodName() {
        return confirmedFoodName;
    }

    public void setConfirmedFoodName(String confirmedFoodName) {
        this.confirmedFoodName = confirmedFoodName;
    }

    public String getConfirmedCategory() {
        return confirmedCategory;
    }

    public void setConfirmedCategory(String confirmedCategory) {
        this.confirmedCategory = confirmedCategory;
    }

    public Double getConfirmedQuantity() {
        return confirmedQuantity;
    }

    public void setConfirmedQuantity(Double confirmedQuantity) {
        this.confirmedQuantity = confirmedQuantity;
    }

    public String getConfirmedUnit() {
        return confirmedUnit;
    }

    public void setConfirmedUnit(String confirmedUnit) {
        this.confirmedUnit = confirmedUnit;
    }

    public String getConfirmedStorage() {
        return confirmedStorage;
    }

    public void setConfirmedStorage(String confirmedStorage) {
        this.confirmedStorage = confirmedStorage;
    }

    public String getConfirmedAllergens() {
        return confirmedAllergens;
    }

    public void setConfirmedAllergens(String confirmedAllergens) {
        this.confirmedAllergens = confirmedAllergens;
    }

    public Integer getConfirmedMinutes() {
        return confirmedMinutes;
    }

    public void setConfirmedMinutes(Integer confirmedMinutes) {
        this.confirmedMinutes = confirmedMinutes;
    }

    public Boolean getApplyToListing() {
        return applyToListing;
    }

    public void setApplyToListing(Boolean applyToListing) {
        this.applyToListing = applyToListing;
    }
}

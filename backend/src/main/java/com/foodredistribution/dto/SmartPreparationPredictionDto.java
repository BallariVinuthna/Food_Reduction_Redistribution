package com.foodredistribution.dto;

import java.time.LocalDate;
import java.util.List;

public class SmartPreparationPredictionDto {

    private String providerId;
    private String providerName;
    private String foodItemName;
    private String mealPeriod;
    private LocalDate targetDate;
    private String dayOfWeek;
    private String unit;

    // Predictions & Recommendations
    private double predictedDemand;
    private double recommendedPreparation;
    private double safetyMarginPct;
    private double previouslyPreparedAvg;
    private double averageQuantityServed;
    private double averageLeftoverQuantity;
    private double estimatedAvoidableSurplus;

    // Confidence & Methodology
    private String confidenceLevel; // NO_DATA, LOW, MODERATE, HIGH
    private double confidenceMin;
    private double confidenceMax;
    private int historicalObservationsCount;
    private int dayOfWeekObservationsCount;
    private double forecastAccuracyPct;

    // Explanations & Actionable Advice
    private String explanation;
    private List<String> wastePreventionRecommendations;
    private String cautionNotice;
    private boolean isSufficientData;

    public SmartPreparationPredictionDto() {}

    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getFoodItemName() { return foodItemName; }
    public void setFoodItemName(String foodItemName) { this.foodItemName = foodItemName; }

    public String getMealPeriod() { return mealPeriod; }
    public void setMealPeriod(String mealPeriod) { this.mealPeriod = mealPeriod; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public double getPredictedDemand() { return predictedDemand; }
    public void setPredictedDemand(double predictedDemand) { this.predictedDemand = predictedDemand; }

    public double getRecommendedPreparation() { return recommendedPreparation; }
    public void setRecommendedPreparation(double recommendedPreparation) { this.recommendedPreparation = recommendedPreparation; }

    public double getSafetyMarginPct() { return safetyMarginPct; }
    public void setSafetyMarginPct(double safetyMarginPct) { this.safetyMarginPct = safetyMarginPct; }

    public double getPreviouslyPreparedAvg() { return previouslyPreparedAvg; }
    public void setPreviouslyPreparedAvg(double previouslyPreparedAvg) { this.previouslyPreparedAvg = previouslyPreparedAvg; }

    public double getAverageQuantityServed() { return averageQuantityServed; }
    public void setAverageQuantityServed(double averageQuantityServed) { this.averageQuantityServed = averageQuantityServed; }

    public double getAverageLeftoverQuantity() { return averageLeftoverQuantity; }
    public void setAverageLeftoverQuantity(double averageLeftoverQuantity) { this.averageLeftoverQuantity = averageLeftoverQuantity; }

    public double getEstimatedAvoidableSurplus() { return estimatedAvoidableSurplus; }
    public void setEstimatedAvoidableSurplus(double estimatedAvoidableSurplus) { this.estimatedAvoidableSurplus = estimatedAvoidableSurplus; }

    public String getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(String confidenceLevel) { this.confidenceLevel = confidenceLevel; }

    public double getConfidenceMin() { return confidenceMin; }
    public void setConfidenceMin(double confidenceMin) { this.confidenceMin = confidenceMin; }

    public double getConfidenceMax() { return confidenceMax; }
    public void setConfidenceMax(double confidenceMax) { this.confidenceMax = confidenceMax; }

    public int getHistoricalObservationsCount() { return historicalObservationsCount; }
    public void setHistoricalObservationsCount(int historicalObservationsCount) { this.historicalObservationsCount = historicalObservationsCount; }

    public int getDayOfWeekObservationsCount() { return dayOfWeekObservationsCount; }
    public void setDayOfWeekObservationsCount(int dayOfWeekObservationsCount) { this.dayOfWeekObservationsCount = dayOfWeekObservationsCount; }

    public double getForecastAccuracyPct() { return forecastAccuracyPct; }
    public void setForecastAccuracyPct(double forecastAccuracyPct) { this.forecastAccuracyPct = forecastAccuracyPct; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public List<String> getWastePreventionRecommendations() { return wastePreventionRecommendations; }
    public void setWastePreventionRecommendations(List<String> wastePreventionRecommendations) { this.wastePreventionRecommendations = wastePreventionRecommendations; }

    public String getCautionNotice() { return cautionNotice; }
    public void setCautionNotice(String cautionNotice) { this.cautionNotice = cautionNotice; }

    public boolean isSufficientData() { return isSufficientData; }
    public void setSufficientData(boolean sufficientData) { isSufficientData = sufficientData; }
}

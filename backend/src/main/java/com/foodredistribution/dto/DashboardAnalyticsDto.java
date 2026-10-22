package com.foodredistribution.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class DashboardAnalyticsDto {
    private boolean hasData = false;

    private long totalListings;
    private long activeListings;
    private long reservedListings;
    private long completedRedistributions;
    private long expiredListings;
    private long cancelledListings;
    private long failedPickups;

    private double totalQuantityListedMeals;
    private double totalQuantityRedistributedMeals;
    private double actualVerifiedDeliveredMeals;

    // Explicitly labeled estimates with formulas
    private double estimatedFoodWasteAvoidedKg;
    private double estimatedValueSavedInr;
    private String environmentalFormulaExplanation = "Estimated: 0.40 kg food waste avoided per edible meal redistributed (FAO/UNEP standard)";
    private String monetaryFormulaExplanation = "Estimated: ₹60 per standard cooked meal saved based on Telangana commercial catering cost index";

    // Empirical field audit records (distinct from operational estimates)
    private double fieldObservedWasteKg;
    private long fieldAuditRecordsCount;

    private double redistributionRatePercentage;
    private double matchSuccessRatePercentage;

    private Double averageMatchingTimeSeconds; // null or actual persisted value
    private Double averageListingToAcceptanceMinutes; // null or actual persisted value
    private Double averagePickupTimeMinutes; // null or actual persisted value
    private Double averageDeliveryTimeMinutes; // null or actual persisted value

    private double dataCompletenessPercentage; // percentage of completed records with verified OTP/audits

    private long totalProviders;
    private long totalReceivers;
    private long totalVolunteers;

    private Map<String, Long> categoryBreakdown;
    private Map<String, Long> statusBreakdown;
    private Map<String, Long> urgencyBreakdown;
    private List<Map<String, Object>> trendData;
    private List<Map<String, Object>> locationBreakdown;

    // Filter context echoed back
    private LocalDateTime filterStartDate;
    private LocalDateTime filterEndDate;
    private String filterLocality;
    private String filterCategory;

    public DashboardAnalyticsDto() {}

    public boolean isHasData() { return hasData; }
    public void setHasData(boolean hasData) { this.hasData = hasData; }

    public long getTotalListings() { return totalListings; }
    public void setTotalListings(long totalListings) { this.totalListings = totalListings; }

    public long getActiveListings() { return activeListings; }
    public void setActiveListings(long activeListings) { this.activeListings = activeListings; }

    public long getReservedListings() { return reservedListings; }
    public void setReservedListings(long reservedListings) { this.reservedListings = reservedListings; }

    public long getCompletedRedistributions() { return completedRedistributions; }
    public void setCompletedRedistributions(long completedRedistributions) { this.completedRedistributions = completedRedistributions; }

    public long getExpiredListings() { return expiredListings; }
    public void setExpiredListings(long expiredListings) { this.expiredListings = expiredListings; }

    public long getCancelledListings() { return cancelledListings; }
    public void setCancelledListings(long cancelledListings) { this.cancelledListings = cancelledListings; }

    public long getFailedPickups() { return failedPickups; }
    public void setFailedPickups(long failedPickups) { this.failedPickups = failedPickups; }

    public double getTotalQuantityListedMeals() { return totalQuantityListedMeals; }
    public void setTotalQuantityListedMeals(double totalQuantityListedMeals) { this.totalQuantityListedMeals = totalQuantityListedMeals; }

    public double getTotalQuantityRedistributedMeals() { return totalQuantityRedistributedMeals; }
    public void setTotalQuantityRedistributedMeals(double totalQuantityRedistributedMeals) { this.totalQuantityRedistributedMeals = totalQuantityRedistributedMeals; }

    public double getActualVerifiedDeliveredMeals() { return actualVerifiedDeliveredMeals; }
    public void setActualVerifiedDeliveredMeals(double actualVerifiedDeliveredMeals) { this.actualVerifiedDeliveredMeals = actualVerifiedDeliveredMeals; }

    public double getEstimatedFoodWasteAvoidedKg() { return estimatedFoodWasteAvoidedKg; }
    public void setEstimatedFoodWasteAvoidedKg(double estimatedFoodWasteAvoidedKg) { this.estimatedFoodWasteAvoidedKg = estimatedFoodWasteAvoidedKg; }

    public double getEstimatedValueSavedInr() { return estimatedValueSavedInr; }
    public void setEstimatedValueSavedInr(double estimatedValueSavedInr) { this.estimatedValueSavedInr = estimatedValueSavedInr; }

    public String getEnvironmentalFormulaExplanation() { return environmentalFormulaExplanation; }
    public void setEnvironmentalFormulaExplanation(String environmentalFormulaExplanation) { this.environmentalFormulaExplanation = environmentalFormulaExplanation; }

    public String getMonetaryFormulaExplanation() { return monetaryFormulaExplanation; }
    public void setMonetaryFormulaExplanation(String monetaryFormulaExplanation) { this.monetaryFormulaExplanation = monetaryFormulaExplanation; }

    public double getFieldObservedWasteKg() { return fieldObservedWasteKg; }
    public void setFieldObservedWasteKg(double fieldObservedWasteKg) { this.fieldObservedWasteKg = fieldObservedWasteKg; }

    public long getFieldAuditRecordsCount() { return fieldAuditRecordsCount; }
    public void setFieldAuditRecordsCount(long fieldAuditRecordsCount) { this.fieldAuditRecordsCount = fieldAuditRecordsCount; }

    public double getRedistributionRatePercentage() { return redistributionRatePercentage; }
    public void setRedistributionRatePercentage(double redistributionRatePercentage) { this.redistributionRatePercentage = redistributionRatePercentage; }

    public double getMatchSuccessRatePercentage() { return matchSuccessRatePercentage; }
    public void setMatchSuccessRatePercentage(double matchSuccessRatePercentage) { this.matchSuccessRatePercentage = matchSuccessRatePercentage; }

    public Double getAverageMatchingTimeSeconds() { return averageMatchingTimeSeconds; }
    public void setAverageMatchingTimeSeconds(Double averageMatchingTimeSeconds) { this.averageMatchingTimeSeconds = averageMatchingTimeSeconds; }

    public Double getAverageListingToAcceptanceMinutes() { return averageListingToAcceptanceMinutes; }
    public void setAverageListingToAcceptanceMinutes(Double averageListingToAcceptanceMinutes) { this.averageListingToAcceptanceMinutes = averageListingToAcceptanceMinutes; }

    public Double getAveragePickupTimeMinutes() { return averagePickupTimeMinutes; }
    public void setAveragePickupTimeMinutes(Double averagePickupTimeMinutes) { this.averagePickupTimeMinutes = averagePickupTimeMinutes; }

    public Double getAverageDeliveryTimeMinutes() { return averageDeliveryTimeMinutes; }
    public void setAverageDeliveryTimeMinutes(Double averageDeliveryTimeMinutes) { this.averageDeliveryTimeMinutes = averageDeliveryTimeMinutes; }

    public double getDataCompletenessPercentage() { return dataCompletenessPercentage; }
    public void setDataCompletenessPercentage(double dataCompletenessPercentage) { this.dataCompletenessPercentage = dataCompletenessPercentage; }

    public long getTotalProviders() { return totalProviders; }
    public void setTotalProviders(long totalProviders) { this.totalProviders = totalProviders; }

    public long getTotalReceivers() { return totalReceivers; }
    public void setTotalReceivers(long totalReceivers) { this.totalReceivers = totalReceivers; }

    public long getTotalVolunteers() { return totalVolunteers; }
    public void setTotalVolunteers(long totalVolunteers) { this.totalVolunteers = totalVolunteers; }

    public Map<String, Long> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(Map<String, Long> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public Map<String, Long> getStatusBreakdown() { return statusBreakdown; }
    public void setStatusBreakdown(Map<String, Long> statusBreakdown) { this.statusBreakdown = statusBreakdown; }

    public Map<String, Long> getUrgencyBreakdown() { return urgencyBreakdown; }
    public void setUrgencyBreakdown(Map<String, Long> urgencyBreakdown) { this.urgencyBreakdown = urgencyBreakdown; }

    public List<Map<String, Object>> getTrendData() { return trendData; }
    public void setTrendData(List<Map<String, Object>> trendData) { this.trendData = trendData; }

    public List<Map<String, Object>> getLocationBreakdown() { return locationBreakdown; }
    public void setLocationBreakdown(List<Map<String, Object>> locationBreakdown) { this.locationBreakdown = locationBreakdown; }

    public LocalDateTime getFilterStartDate() { return filterStartDate; }
    public void setFilterStartDate(LocalDateTime filterStartDate) { this.filterStartDate = filterStartDate; }

    public LocalDateTime getFilterEndDate() { return filterEndDate; }
    public void setFilterEndDate(LocalDateTime filterEndDate) { this.filterEndDate = filterEndDate; }

    public String getFilterLocality() { return filterLocality; }
    public void setFilterLocality(String filterLocality) { this.filterLocality = filterLocality; }

    public String getFilterCategory() { return filterCategory; }
    public void setFilterCategory(String filterCategory) { this.filterCategory = filterCategory; }

    // Compatibility getters for frontend charts if needed
    public double getFoodWasteAvoidedKg() { return estimatedFoodWasteAvoidedKg; }
    public void setFoodWasteAvoidedKg(double kg) { this.estimatedFoodWasteAvoidedKg = kg; }
}

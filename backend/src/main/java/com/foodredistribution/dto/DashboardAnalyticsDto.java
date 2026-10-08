package com.foodredistribution.dto;

import java.util.List;
import java.util.Map;

public class DashboardAnalyticsDto {
    private long totalListings;
    private long activeListings;
    private long reservedListings;
    private long completedRedistributions;
    private long expiredListings;
    private long cancelledListings;

    private double totalQuantityListedMeals;
    private double totalQuantityRedistributedMeals;
    private double foodWasteAvoidedKg;
    private double estimatedValueSavedInr;

    private double redistributionRatePercentage;
    private double matchSuccessRatePercentage;
    private double averageMatchingTimeSeconds;
    private double averagePickupTimeMinutes;

    private long totalProviders;
    private long totalReceivers;
    private long totalVolunteers;

    private Map<String, Long> categoryBreakdown;
    private Map<String, Long> statusBreakdown;
    private Map<String, Long> urgencyBreakdown;
    private List<Map<String, Object>> trendData;
    private List<Map<String, Object>> locationBreakdown;

    public DashboardAnalyticsDto() {}

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

    public double getTotalQuantityListedMeals() { return totalQuantityListedMeals; }
    public void setTotalQuantityListedMeals(double totalQuantityListedMeals) { this.totalQuantityListedMeals = totalQuantityListedMeals; }

    public double getTotalQuantityRedistributedMeals() { return totalQuantityRedistributedMeals; }
    public void setTotalQuantityRedistributedMeals(double totalQuantityRedistributedMeals) { this.totalQuantityRedistributedMeals = totalQuantityRedistributedMeals; }

    public double getFoodWasteAvoidedKg() { return foodWasteAvoidedKg; }
    public void setFoodWasteAvoidedKg(double foodWasteAvoidedKg) { this.foodWasteAvoidedKg = foodWasteAvoidedKg; }

    public double getEstimatedValueSavedInr() { return estimatedValueSavedInr; }
    public void setEstimatedValueSavedInr(double estimatedValueSavedInr) { this.estimatedValueSavedInr = estimatedValueSavedInr; }

    public double getRedistributionRatePercentage() { return redistributionRatePercentage; }
    public void setRedistributionRatePercentage(double redistributionRatePercentage) { this.redistributionRatePercentage = redistributionRatePercentage; }

    public double getMatchSuccessRatePercentage() { return matchSuccessRatePercentage; }
    public void setMatchSuccessRatePercentage(double matchSuccessRatePercentage) { this.matchSuccessRatePercentage = matchSuccessRatePercentage; }

    public double getAverageMatchingTimeSeconds() { return averageMatchingTimeSeconds; }
    public void setAverageMatchingTimeSeconds(double averageMatchingTimeSeconds) { this.averageMatchingTimeSeconds = averageMatchingTimeSeconds; }

    public double getAveragePickupTimeMinutes() { return averagePickupTimeMinutes; }
    public void setAveragePickupTimeMinutes(double averagePickupTimeMinutes) { this.averagePickupTimeMinutes = averagePickupTimeMinutes; }

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
}

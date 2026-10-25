package com.foodredistribution.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class PreparationAdvisorDashboardSummaryDto {

    private String providerId;
    private String providerName;

    // High Level Aggregations
    private double totalPrepared;
    private double totalServed;
    private double totalDonated;
    private double totalDiscarded;
    private double totalRemaining;
    private double estimatedAvoidableSurplus;
    private double overallLeftoverRatePct;
    private int totalRecordsLogged;
    private int daysWithDataCount;

    // Recurring Leftovers Analysis
    private List<RecurringLeftoverItemDto> recurringLeftoverItems;

    // Daily / Weekly Trends
    private List<DailyPreparationSummaryDto> dailyTrends;

    // Category & Meal Period Breakdowns
    private Map<String, Double> mealPeriodDistribution;
    private Map<String, Double> categoryDistribution;

    // Evaluation & Model Performance (Section 10)
    private EvaluationMetricsDto evaluationMetrics;

    // Actionable Recommendations
    private List<AdvisorInsightDto> actionableInsights;

    public PreparationAdvisorDashboardSummaryDto() {}

    public static class RecurringLeftoverItemDto {
        private String foodItemName;
        private String foodCategory;
        private String primaryMealPeriod;
        private double averagePrepared;
        private double averageServed;
        private double averageLeftover;
        private double leftoverRatePct;
        private double suggestedTrimQuantity;
        private String recommendation;
        private String severity; // HIGH, MEDIUM, LOW

        public RecurringLeftoverItemDto() {}

        public RecurringLeftoverItemDto(String foodItemName, String foodCategory, String primaryMealPeriod,
                                        double averagePrepared, double averageServed, double averageLeftover,
                                        double leftoverRatePct, double suggestedTrimQuantity,
                                        String recommendation, String severity) {
            this.foodItemName = foodItemName;
            this.foodCategory = foodCategory;
            this.primaryMealPeriod = primaryMealPeriod;
            this.averagePrepared = averagePrepared;
            this.averageServed = averageServed;
            this.averageLeftover = averageLeftover;
            this.leftoverRatePct = leftoverRatePct;
            this.suggestedTrimQuantity = suggestedTrimQuantity;
            this.recommendation = recommendation;
            this.severity = severity;
        }

        public String getFoodItemName() { return foodItemName; }
        public void setFoodItemName(String foodItemName) { this.foodItemName = foodItemName; }

        public String getFoodCategory() { return foodCategory; }
        public void setFoodCategory(String foodCategory) { this.foodCategory = foodCategory; }

        public String getPrimaryMealPeriod() { return primaryMealPeriod; }
        public void setPrimaryMealPeriod(String primaryMealPeriod) { this.primaryMealPeriod = primaryMealPeriod; }

        public double getAveragePrepared() { return averagePrepared; }
        public void setAveragePrepared(double averagePrepared) { this.averagePrepared = averagePrepared; }

        public double getAverageServed() { return averageServed; }
        public void setAverageServed(double averageServed) { this.averageServed = averageServed; }

        public double getAverageLeftover() { return averageLeftover; }
        public void setAverageLeftover(double averageLeftover) { this.averageLeftover = averageLeftover; }

        public double getLeftoverRatePct() { return leftoverRatePct; }
        public void setLeftoverRatePct(double leftoverRatePct) { this.leftoverRatePct = leftoverRatePct; }

        public double getSuggestedTrimQuantity() { return suggestedTrimQuantity; }
        public void setSuggestedTrimQuantity(double suggestedTrimQuantity) { this.suggestedTrimQuantity = suggestedTrimQuantity; }

        public String getRecommendation() { return recommendation; }
        public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
    }

    public static class DailyPreparationSummaryDto {
        private LocalDate date;
        private String dayOfWeek;
        private double prepared;
        private double served;
        private double leftover;
        private double donated;
        private double discarded;

        public DailyPreparationSummaryDto() {}

        public DailyPreparationSummaryDto(LocalDate date, String dayOfWeek, double prepared, double served, double leftover, double donated, double discarded) {
            this.date = date;
            this.dayOfWeek = dayOfWeek;
            this.prepared = prepared;
            this.served = served;
            this.leftover = leftover;
            this.donated = donated;
            this.discarded = discarded;
        }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public String getDayOfWeek() { return dayOfWeek; }
        public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

        public double getPrepared() { return prepared; }
        public void setPrepared(double prepared) { this.prepared = prepared; }

        public double getServed() { return served; }
        public void setServed(double served) { this.served = served; }

        public double getLeftover() { return leftover; }
        public void setLeftover(double leftover) { this.leftover = leftover; }

        public double getDonated() { return donated; }
        public void setDonated(double donated) { this.donated = donated; }

        public double getDiscarded() { return discarded; }
        public void setDiscarded(double discarded) { this.discarded = discarded; }
    }

    public static class EvaluationMetricsDto {
        private double meanAbsoluteError;
        private double meanAbsolutePercentageError;
        private double forecastAccuracyPct;
        private int evaluatedRecordsCount;
        private boolean isSufficientEvaluationData;
        private String interpretationMessage;
        private List<ActualVsPredictedPointDto> recentComparisons;

        public EvaluationMetricsDto() {}

        public double getMeanAbsoluteError() { return meanAbsoluteError; }
        public void setMeanAbsoluteError(double meanAbsoluteError) { this.meanAbsoluteError = meanAbsoluteError; }

        public double getMeanAbsolutePercentageError() { return meanAbsolutePercentageError; }
        public void setMeanAbsolutePercentageError(double meanAbsolutePercentageError) { this.meanAbsolutePercentageError = meanAbsolutePercentageError; }

        public double getForecastAccuracyPct() { return forecastAccuracyPct; }
        public void setForecastAccuracyPct(double forecastAccuracyPct) { this.forecastAccuracyPct = forecastAccuracyPct; }

        public int getEvaluatedRecordsCount() { return evaluatedRecordsCount; }
        public void setEvaluatedRecordsCount(int evaluatedRecordsCount) { this.evaluatedRecordsCount = evaluatedRecordsCount; }

        public boolean isSufficientEvaluationData() { return isSufficientEvaluationData; }
        public void setSufficientEvaluationData(boolean sufficientEvaluationData) { isSufficientEvaluationData = sufficientEvaluationData; }

        public String getInterpretationMessage() { return interpretationMessage; }
        public void setInterpretationMessage(String interpretationMessage) { this.interpretationMessage = interpretationMessage; }

        public List<ActualVsPredictedPointDto> getRecentComparisons() { return recentComparisons; }
        public void setRecentComparisons(List<ActualVsPredictedPointDto> recentComparisons) { this.recentComparisons = recentComparisons; }
    }

    public static class ActualVsPredictedPointDto {
        private LocalDate date;
        private String foodItemName;
        private double actualDemand;
        private double predictedDemand;
        private double absoluteError;

        public ActualVsPredictedPointDto() {}

        public ActualVsPredictedPointDto(LocalDate date, String foodItemName, double actualDemand, double predictedDemand, double absoluteError) {
            this.date = date;
            this.foodItemName = foodItemName;
            this.actualDemand = actualDemand;
            this.predictedDemand = predictedDemand;
            this.absoluteError = absoluteError;
        }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public String getFoodItemName() { return foodItemName; }
        public void setFoodItemName(String foodItemName) { this.foodItemName = foodItemName; }

        public double getActualDemand() { return actualDemand; }
        public void setActualDemand(double actualDemand) { this.actualDemand = actualDemand; }

        public double getPredictedDemand() { return predictedDemand; }
        public void setPredictedDemand(double predictedDemand) { this.predictedDemand = predictedDemand; }

        public double getAbsoluteError() { return absoluteError; }
        public void setAbsoluteError(double absoluteError) { this.absoluteError = absoluteError; }
    }

    public static class AdvisorInsightDto {
        private String title;
        private String description;
        private String category; // REDUCE_PREP, STOCKOUT_RISK, SCHEDULE_VARIATION, INSUFFICIENT_DATA, SUCCESS
        private String severity; // WARNING, TIP, SUCCESS, INFO

        public AdvisorInsightDto() {}

        public AdvisorInsightDto(String title, String description, String category, String severity) {
            this.title = title;
            this.description = description;
            this.category = category;
            this.severity = severity;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
    }

    // Getters and Setters for Main Class
    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public double getTotalPrepared() { return totalPrepared; }
    public void setTotalPrepared(double totalPrepared) { this.totalPrepared = totalPrepared; }

    public double getTotalServed() { return totalServed; }
    public void setTotalServed(double totalServed) { this.totalServed = totalServed; }

    public double getTotalDonated() { return totalDonated; }
    public void setTotalDonated(double totalDonated) { this.totalDonated = totalDonated; }

    public double getTotalDiscarded() { return totalDiscarded; }
    public void setTotalDiscarded(double totalDiscarded) { this.totalDiscarded = totalDiscarded; }

    public double getTotalRemaining() { return totalRemaining; }
    public void setTotalRemaining(double totalRemaining) { this.totalRemaining = totalRemaining; }

    public double getEstimatedAvoidableSurplus() { return estimatedAvoidableSurplus; }
    public void setEstimatedAvoidableSurplus(double estimatedAvoidableSurplus) { this.estimatedAvoidableSurplus = estimatedAvoidableSurplus; }

    public double getOverallLeftoverRatePct() { return overallLeftoverRatePct; }
    public void setOverallLeftoverRatePct(double overallLeftoverRatePct) { this.overallLeftoverRatePct = overallLeftoverRatePct; }

    public int getTotalRecordsLogged() { return totalRecordsLogged; }
    public void setTotalRecordsLogged(int totalRecordsLogged) { this.totalRecordsLogged = totalRecordsLogged; }

    public int getDaysWithDataCount() { return daysWithDataCount; }
    public void setDaysWithDataCount(int daysWithDataCount) { this.daysWithDataCount = daysWithDataCount; }

    public List<RecurringLeftoverItemDto> getRecurringLeftoverItems() { return recurringLeftoverItems; }
    public void setRecurringLeftoverItems(List<RecurringLeftoverItemDto> recurringLeftoverItems) { this.recurringLeftoverItems = recurringLeftoverItems; }

    public List<DailyPreparationSummaryDto> getDailyTrends() { return dailyTrends; }
    public void setDailyTrends(List<DailyPreparationSummaryDto> dailyTrends) { this.dailyTrends = dailyTrends; }

    public Map<String, Double> getMealPeriodDistribution() { return mealPeriodDistribution; }
    public void setMealPeriodDistribution(Map<String, Double> mealPeriodDistribution) { this.mealPeriodDistribution = mealPeriodDistribution; }

    public Map<String, Double> getCategoryDistribution() { return categoryDistribution; }
    public void setCategoryDistribution(Map<String, Double> categoryDistribution) { this.categoryDistribution = categoryDistribution; }

    public EvaluationMetricsDto getEvaluationMetrics() { return evaluationMetrics; }
    public void setEvaluationMetrics(EvaluationMetricsDto evaluationMetrics) { this.evaluationMetrics = evaluationMetrics; }

    public List<AdvisorInsightDto> getActionableInsights() { return actionableInsights; }
    public void setActionableInsights(List<AdvisorInsightDto> actionableInsights) { this.actionableInsights = actionableInsights; }
}

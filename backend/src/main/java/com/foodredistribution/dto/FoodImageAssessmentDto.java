package com.foodredistribution.dto;

import java.time.LocalDateTime;
import java.util.List;

public class FoodImageAssessmentDto {

    private String id;
    private String imageUrl;
    private String imageFormat;
    private Long fileSizeBytes;
    private String detectedFoodName;
    private String detectedCategory;
    private Double confidenceScore;
    private List<String> visibleCharacteristics;
    private List<String> visualConcerns;
    private List<String> recommendedNextSteps;
    private String storageRecommendation;
    private String suggestedSafeWindow;
    private String advisoryDisclaimer;
    private String reviewStatus;
    private LocalDateTime createdAt;

    // Confirmed fields if already confirmed
    private String donorConfirmedFoodName;
    private String donorConfirmedCategory;
    private Double donorConfirmedQuantity;
    private String donorConfirmedUnit;
    private String donorConfirmedStorage;
    private String donorConfirmedAllergens;
    private Integer donorConfirmedMinutes;

    public FoodImageAssessmentDto() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getImageFormat() {
        return imageFormat;
    }

    public void setImageFormat(String imageFormat) {
        this.imageFormat = imageFormat;
    }

    public Long getFileSizeBytes() {
        return fileSizeBytes;
    }

    public void setFileSizeBytes(Long fileSizeBytes) {
        this.fileSizeBytes = fileSizeBytes;
    }

    public String getDetectedFoodName() {
        return detectedFoodName;
    }

    public void setDetectedFoodName(String detectedFoodName) {
        this.detectedFoodName = detectedFoodName;
    }

    public String getDetectedCategory() {
        return detectedCategory;
    }

    public void setDetectedCategory(String detectedCategory) {
        this.detectedCategory = detectedCategory;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public List<String> getVisibleCharacteristics() {
        return visibleCharacteristics;
    }

    public void setVisibleCharacteristics(List<String> visibleCharacteristics) {
        this.visibleCharacteristics = visibleCharacteristics;
    }

    public List<String> getVisualConcerns() {
        return visualConcerns;
    }

    public void setVisualConcerns(List<String> visualConcerns) {
        this.visualConcerns = visualConcerns;
    }

    public List<String> getRecommendedNextSteps() {
        return recommendedNextSteps;
    }

    public void setRecommendedNextSteps(List<String> recommendedNextSteps) {
        this.recommendedNextSteps = recommendedNextSteps;
    }

    public String getStorageRecommendation() {
        return storageRecommendation;
    }

    public void setStorageRecommendation(String storageRecommendation) {
        this.storageRecommendation = storageRecommendation;
    }

    public String getSuggestedSafeWindow() {
        return suggestedSafeWindow;
    }

    public void setSuggestedSafeWindow(String suggestedSafeWindow) {
        this.suggestedSafeWindow = suggestedSafeWindow;
    }

    public String getAdvisoryDisclaimer() {
        return advisoryDisclaimer;
    }

    public void setAdvisoryDisclaimer(String advisoryDisclaimer) {
        this.advisoryDisclaimer = advisoryDisclaimer;
    }

    public String getReviewStatus() {
        return reviewStatus;
    }

    public void setReviewStatus(String reviewStatus) {
        this.reviewStatus = reviewStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getDonorConfirmedFoodName() {
        return donorConfirmedFoodName;
    }

    public void setDonorConfirmedFoodName(String donorConfirmedFoodName) {
        this.donorConfirmedFoodName = donorConfirmedFoodName;
    }

    public String getDonorConfirmedCategory() {
        return donorConfirmedCategory;
    }

    public void setDonorConfirmedCategory(String donorConfirmedCategory) {
        this.donorConfirmedCategory = donorConfirmedCategory;
    }

    public Double getDonorConfirmedQuantity() {
        return donorConfirmedQuantity;
    }

    public void setDonorConfirmedQuantity(Double donorConfirmedQuantity) {
        this.donorConfirmedQuantity = donorConfirmedQuantity;
    }

    public String getDonorConfirmedUnit() {
        return donorConfirmedUnit;
    }

    public void setDonorConfirmedUnit(String donorConfirmedUnit) {
        this.donorConfirmedUnit = donorConfirmedUnit;
    }

    public String getDonorConfirmedStorage() {
        return donorConfirmedStorage;
    }

    public void setDonorConfirmedStorage(String donorConfirmedStorage) {
        this.donorConfirmedStorage = donorConfirmedStorage;
    }

    public String getDonorConfirmedAllergens() {
        return donorConfirmedAllergens;
    }

    public void setDonorConfirmedAllergens(String donorConfirmedAllergens) {
        this.donorConfirmedAllergens = donorConfirmedAllergens;
    }

    public Integer getDonorConfirmedMinutes() {
        return donorConfirmedMinutes;
    }

    public void setDonorConfirmedMinutes(Integer donorConfirmedMinutes) {
        this.donorConfirmedMinutes = donorConfirmedMinutes;
    }
}

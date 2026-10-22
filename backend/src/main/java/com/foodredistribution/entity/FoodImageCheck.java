package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "food_image_checks")
public class FoodImageCheck {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(name = "user_id", length = 36)
    private String userId;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "image_url", length = 1000, nullable = false)
    private String imageUrl;

    @Column(name = "image_format", length = 50)
    private String imageFormat;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "detected_food_name", length = 255)
    private String detectedFoodName;

    @Column(name = "detected_category", length = 100)
    private String detectedCategory;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Lob
    @Column(name = "visible_characteristics", columnDefinition = "TEXT")
    private String visibleCharacteristics;

    @Lob
    @Column(name = "visual_concerns", columnDefinition = "TEXT")
    private String visualConcerns;

    @Lob
    @Column(name = "recommended_steps", columnDefinition = "TEXT")
    private String recommendedSteps;

    @Lob
    @Column(name = "advisory_disclaimer", columnDefinition = "TEXT")
    private String advisoryDisclaimer;

    // Donor confirmed details
    @Column(name = "donor_confirmed_food_name", length = 255)
    private String donorConfirmedFoodName;

    @Column(name = "donor_confirmed_category", length = 100)
    private String donorConfirmedCategory;

    @Column(name = "donor_confirmed_quantity")
    private Double donorConfirmedQuantity;

    @Column(name = "donor_confirmed_unit", length = 50)
    private String donorConfirmedUnit;

    @Column(name = "donor_confirmed_storage", length = 100)
    private String donorConfirmedStorage;

    @Column(name = "donor_confirmed_allergens", length = 500)
    private String donorConfirmedAllergens;

    @Column(name = "donor_confirmed_minutes")
    private Integer donorConfirmedMinutes;

    @Column(name = "review_status", length = 50, nullable = false)
    private String reviewStatus = "PENDING_CONFIRMATION";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public FoodImageCheck() {
        this.id = UUID.randomUUID().toString();
    }

    public FoodImageCheck(String userEmail, String imageUrl, String imageFormat, Long fileSizeBytes) {
        this();
        this.userEmail = userEmail;
        this.imageUrl = imageUrl;
        this.imageFormat = imageFormat;
        this.fileSizeBytes = fileSizeBytes;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
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

    public String getVisibleCharacteristics() {
        return visibleCharacteristics;
    }

    public void setVisibleCharacteristics(String visibleCharacteristics) {
        this.visibleCharacteristics = visibleCharacteristics;
    }

    public String getVisualConcerns() {
        return visualConcerns;
    }

    public void setVisualConcerns(String visualConcerns) {
        this.visualConcerns = visualConcerns;
    }

    public String getRecommendedSteps() {
        return recommendedSteps;
    }

    public void setRecommendedSteps(String recommendedSteps) {
        this.recommendedSteps = recommendedSteps;
    }

    public String getAdvisoryDisclaimer() {
        return advisoryDisclaimer;
    }

    public void setAdvisoryDisclaimer(String advisoryDisclaimer) {
        this.advisoryDisclaimer = advisoryDisclaimer;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

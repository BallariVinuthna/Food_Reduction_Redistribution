package com.foodredistribution.dto;

import com.foodredistribution.entity.FoodStatus;
import com.foodredistribution.entity.UrgencyLevel;
import java.time.LocalDateTime;
import java.util.UUID;

public class FoodListingDto {
    private UUID id;
    private UUID providerId;
    private String providerOrganizationName;
    private String foodName;
    private String foodCategory;
    private Long version;
    private Double quantity;
    private Double reservedQuantity;
    private Double remainingQuantity;
    private String unit;
    private LocalDateTime preparationTime;
    private LocalDateTime availableFrom;
    private LocalDateTime availableUntil;
    private String address;
    private Double latitude;
    private Double longitude;
    private String foodCondition;
    private boolean isVegetarian;
    private String allergenInfo;
    private String storageCondition;
    private String pickupInstructions;
    private String photoUrl;
    private String contactPhone;
    private FoodStatus status;
    private UrgencyLevel urgencyLevel;
    private Long availableMinutesRemaining;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private FoodSafetyCheckDto safetyCheck;

    public FoodListingDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getProviderId() { return providerId; }
    public void setProviderId(UUID providerId) { this.providerId = providerId; }

    public String getProviderOrganizationName() { return providerOrganizationName; }
    public void setProviderOrganizationName(String providerOrganizationName) { this.providerOrganizationName = providerOrganizationName; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public String getFoodCategory() { return foodCategory; }
    public void setFoodCategory(String foodCategory) { this.foodCategory = foodCategory; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDateTime getPreparationTime() { return preparationTime; }
    public void setPreparationTime(LocalDateTime preparationTime) { this.preparationTime = preparationTime; }

    public LocalDateTime getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(LocalDateTime availableFrom) { this.availableFrom = availableFrom; }

    public LocalDateTime getAvailableUntil() { return availableUntil; }
    public void setAvailableUntil(LocalDateTime availableUntil) { this.availableUntil = availableUntil; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getFoodCondition() { return foodCondition; }
    public void setFoodCondition(String foodCondition) { this.foodCondition = foodCondition; }

    public boolean isVegetarian() { return isVegetarian; }
    public void setVegetarian(boolean vegetarian) { isVegetarian = vegetarian; }

    public String getAllergenInfo() { return allergenInfo; }
    public void setAllergenInfo(String allergenInfo) { this.allergenInfo = allergenInfo; }

    public String getStorageCondition() { return storageCondition; }
    public void setStorageCondition(String storageCondition) { this.storageCondition = storageCondition; }

    public String getPickupInstructions() { return pickupInstructions; }
    public void setPickupInstructions(String pickupInstructions) { this.pickupInstructions = pickupInstructions; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public FoodStatus getStatus() { return status; }
    public void setStatus(FoodStatus status) { this.status = status; }

    public UrgencyLevel getUrgencyLevel() { return urgencyLevel; }
    public void setUrgencyLevel(UrgencyLevel urgencyLevel) { this.urgencyLevel = urgencyLevel; }

    public Long getAvailableMinutesRemaining() { return availableMinutesRemaining; }
    public void setAvailableMinutesRemaining(Long availableMinutesRemaining) { this.availableMinutesRemaining = availableMinutesRemaining; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public FoodSafetyCheckDto getSafetyCheck() { return safetyCheck; }
    public void setSafetyCheck(FoodSafetyCheckDto safetyCheck) { this.safetyCheck = safetyCheck; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public Double getReservedQuantity() { return reservedQuantity; }
    public void setReservedQuantity(Double reservedQuantity) { this.reservedQuantity = reservedQuantity; }

    public Double getRemainingQuantity() { return remainingQuantity; }
    public void setRemainingQuantity(Double remainingQuantity) { this.remainingQuantity = remainingQuantity; }
}

package com.foodredistribution.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CreateFoodListingRequest {
    @NotBlank(message = "Food name is required")
    private String foodName;

    @NotBlank(message = "Food category is required")
    private String foodCategory; // COOKED_MEALS, BAKERY_BREAD, PACKAGED_GROCERIES, FRESH_PRODUCE, DAIRY, BEVERAGES

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Double quantity;

    private String unit = "MEALS";

    @NotNull(message = "Preparation time is required")
    private LocalDateTime preparationTime;

    private LocalDateTime availableFrom;

    @NotNull(message = "Available until time is required")
    private LocalDateTime availableUntil;

    @NotBlank(message = "Location address is required")
    private String address;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String foodCondition = "FRESHLY_PREPARED";
    private boolean isVegetarian = true;
    private String allergenInfo;
    private String storageCondition = "ROOM_TEMP";
    private String pickupInstructions;
    private String photoUrl;
    private String contactPhone;

    // Food safety checklist fields
    private boolean temperatureSafe = true;
    private boolean cleanPackaging = true;
    private boolean preparedWithinSafeWindow = true;
    private boolean allergenDeclared = true;
    private boolean providerCertified = true;
    private String safetyNotes;

    public CreateFoodListingRequest() {}

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

    public boolean isTemperatureSafe() { return temperatureSafe; }
    public void setTemperatureSafe(boolean temperatureSafe) { this.temperatureSafe = temperatureSafe; }

    public boolean isCleanPackaging() { return cleanPackaging; }
    public void setCleanPackaging(boolean cleanPackaging) { this.cleanPackaging = cleanPackaging; }

    public boolean isPreparedWithinSafeWindow() { return preparedWithinSafeWindow; }
    public void setPreparedWithinSafeWindow(boolean preparedWithinSafeWindow) { this.preparedWithinSafeWindow = preparedWithinSafeWindow; }

    public boolean isAllergenDeclared() { return allergenDeclared; }
    public void setAllergenDeclared(boolean allergenDeclared) { this.allergenDeclared = allergenDeclared; }

    public boolean isProviderCertified() { return providerCertified; }
    public void setProviderCertified(boolean providerCertified) { this.providerCertified = providerCertified; }

    public String getSafetyNotes() { return safetyNotes; }
    public void setSafetyNotes(String safetyNotes) { this.safetyNotes = safetyNotes; }
}

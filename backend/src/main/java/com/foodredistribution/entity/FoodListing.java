package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Entity
@Table(name = "food_listings", indexes = {
    @Index(name = "idx_food_status", columnList = "status"),
    @Index(name = "idx_food_urgency", columnList = "urgencyLevel"),
    @Index(name = "idx_food_available_until", columnList = "available_until"),
    @Index(name = "idx_food_category", columnList = "foodCategory"),
    @Index(name = "idx_food_location", columnList = "latitude, longitude")
})
public class FoodListing {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "provider_id", nullable = false)
    private FoodProvider provider;

    @Column(nullable = false)
    private String foodName;

    @Column(nullable = false)
    private String foodCategory; // COOKED_MEALS, BAKERY_BREAD, PACKAGED_GROCERIES, FRESH_PRODUCE, DAIRY, BEVERAGES

    @Version
    @Column(nullable = false)
    private Long version = 0L;

    @Column(nullable = false)
    private Double quantity;

    @Column(name = "reserved_quantity", nullable = false)
    private Double reservedQuantity = 0.0;

    @Column(name = "remaining_quantity", nullable = false)
    private Double remainingQuantity = 0.0;

    @Column(nullable = false)
    private String unit = "MEALS"; // MEALS, KG, PACKETS

    @Column(name = "preparation_time", nullable = false)
    private LocalDateTime preparationTime;

    @Column(name = "available_from", nullable = false)
    private LocalDateTime availableFrom;

    @Column(name = "available_until", nullable = false)
    private LocalDateTime availableUntil;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private String foodCondition; // FRESHLY_PREPARED, BUFFER_SURPLUS, SHELF_STABLE, CHILLED

    @Column(nullable = false)
    private boolean isVegetarian = true;

    private String allergenInfo;
    private String storageCondition; // ROOM_TEMP, REFRIGERATED, HEATED_CONTAINER, DRY_STORAGE
    private String pickupInstructions;
    private String photoUrl;
    private String contactPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodStatus status = FoodStatus.AVAILABLE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UrgencyLevel urgencyLevel = UrgencyLevel.LOW;

    private Long availableMinutesRemaining;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public FoodListing() {}

    public FoodListing(FoodProvider provider, String foodName, String foodCategory, Double quantity, String unit,
                       LocalDateTime preparationTime, LocalDateTime availableFrom, LocalDateTime availableUntil,
                       String address, Double latitude, Double longitude, String foodCondition, boolean isVegetarian,
                       String allergenInfo, String storageCondition, String pickupInstructions, String photoUrl, String contactPhone) {
        this.provider = provider;
        this.foodName = foodName;
        this.foodCategory = foodCategory;
        this.quantity = quantity;
        this.unit = unit != null ? unit : "MEALS";
        this.preparationTime = preparationTime;
        this.availableFrom = availableFrom != null ? availableFrom : LocalDateTime.now();
        this.availableUntil = availableUntil;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.foodCondition = foodCondition != null ? foodCondition : "FRESHLY_PREPARED";
        this.isVegetarian = isVegetarian;
        this.allergenInfo = allergenInfo;
        this.storageCondition = storageCondition != null ? storageCondition : "ROOM_TEMP";
        this.pickupInstructions = pickupInstructions;
        this.photoUrl = photoUrl;
        this.contactPhone = contactPhone;
        this.status = FoodStatus.AVAILABLE;
        this.reservedQuantity = 0.0;
        this.remainingQuantity = quantity != null ? quantity : 0.0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        recalculateUrgency();
    }

    @PrePersist
    public void onPrePersist() {
        if (this.reservedQuantity == null) this.reservedQuantity = 0.0;
        if (this.remainingQuantity == null) {
            this.remainingQuantity = Math.max(0.0, (quantity != null ? quantity : 0.0) - this.reservedQuantity);
        }
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        recalculateUrgency();
    }

    @PreUpdate
    public void onUpdate() {
        if (this.reservedQuantity == null) this.reservedQuantity = 0.0;
        if (this.remainingQuantity == null) {
            this.remainingQuantity = Math.max(0.0, (quantity != null ? quantity : 0.0) - this.reservedQuantity);
        }
        this.updatedAt = LocalDateTime.now();
        recalculateUrgency();
    }

    public void recalculateUrgency() {
        if (availableUntil != null) {
            LocalDateTime now = LocalDateTime.now();
            long minutes = ChronoUnit.MINUTES.between(now, availableUntil);
            this.availableMinutesRemaining = Math.max(0, minutes);

            if (minutes <= 0) {
                if (this.status == FoodStatus.AVAILABLE || this.status == FoodStatus.RESERVED) {
                    this.status = FoodStatus.EXPIRED;
                }
                this.urgencyLevel = UrgencyLevel.CRITICAL;
            } else if (minutes < 60) {
                this.urgencyLevel = UrgencyLevel.CRITICAL;
            } else if (minutes < 120) {
                this.urgencyLevel = UrgencyLevel.HIGH;
            } else if (minutes < 240) {
                this.urgencyLevel = UrgencyLevel.MEDIUM;
            } else {
                this.urgencyLevel = UrgencyLevel.LOW;
            }
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public FoodProvider getProvider() { return provider; }
    public void setProvider(FoodProvider provider) { this.provider = provider; }

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
    public void setAvailableUntil(LocalDateTime availableUntil) {
        this.availableUntil = availableUntil;
        recalculateUrgency();
    }

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

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public Double getReservedQuantity() { return reservedQuantity != null ? reservedQuantity : 0.0; }
    public void setReservedQuantity(Double reservedQuantity) {
        this.reservedQuantity = reservedQuantity != null ? reservedQuantity : 0.0;
        this.remainingQuantity = Math.max(0.0, (quantity != null ? quantity : 0.0) - this.reservedQuantity);
    }

    public Double getRemainingQuantity() {
        if (remainingQuantity == null) {
            remainingQuantity = Math.max(0.0, (quantity != null ? quantity : 0.0) - (reservedQuantity != null ? reservedQuantity : 0.0));
        }
        return remainingQuantity;
    }
    public void setRemainingQuantity(Double remainingQuantity) { this.remainingQuantity = remainingQuantity; }

    public synchronized boolean reserveQuantity(double amount) {
        if (amount <= 0.0) return false;
        double currentRemaining = getRemainingQuantity();
        if (currentRemaining >= amount) {
            this.reservedQuantity = (this.reservedQuantity != null ? this.reservedQuantity : 0.0) + amount;
            this.remainingQuantity = Math.max(0.0, this.quantity - this.reservedQuantity);
            if (this.remainingQuantity <= 0.001) {
                this.status = FoodStatus.RESERVED;
            }
            return true;
        }
        return false;
    }

    public synchronized void releaseQuantity(double amount) {
        if (amount <= 0.0) return;
        this.reservedQuantity = Math.max(0.0, (this.reservedQuantity != null ? this.reservedQuantity : 0.0) - amount);
        this.remainingQuantity = Math.max(0.0, this.quantity - this.reservedQuantity);
        if (this.remainingQuantity > 0.0 && this.status == FoodStatus.RESERVED) {
            this.status = FoodStatus.AVAILABLE;
        }
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

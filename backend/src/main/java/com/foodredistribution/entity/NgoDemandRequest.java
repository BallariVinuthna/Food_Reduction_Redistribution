package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ngo_demand_requests")
public class NgoDemandRequest {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(name = "receiver_id", length = 36, nullable = false)
    private String receiverId;

    @Column(name = "receiver_name", length = 255, nullable = false)
    private String receiverName;

    @Column(name = "requested_date", nullable = false)
    private LocalDate requestedDate;

    @Column(name = "meal_period", length = 50, nullable = false) // LUNCH, DINNER, BREAKFAST
    private String mealPeriod;

    @Column(name = "food_category", length = 100, nullable = false) // COOKED_MEALS, BAKERY_BREAD, ANY
    private String foodCategory;

    @Column(name = "people_count", nullable = false)
    private Integer peopleCount;

    @Column(name = "servings_required", nullable = false)
    private Double servingsRequired;

    @Column(name = "unit", length = 50, nullable = false)
    private String unit = "MEALS";

    @Column(name = "dietary_preference", length = 50) // VEGETARIAN, NON_VEG, ANY
    private String dietaryPreference = "ANY";

    @Column(name = "logistics_preference", length = 50) // VOLUNTEER_DELIVERY, RECEIVER_PICKUP
    private String logisticsPreference = "VOLUNTEER_DELIVERY";

    @Column(name = "storage_capacity_available")
    private Integer storageCapacityAvailable;

    @Column(name = "recurring_weekly")
    private Boolean recurringWeekly = false;

    @Column(name = "fulfilled_servings")
    private Double fulfilledServings = 0.0;

    @Column(name = "matched_listing_id", length = 36)
    private String matchedListingId;

    @Column(name = "status", length = 50, nullable = false) // OPEN, PARTIALLY_MATCHED, FULFILLED, CANCELLED
    private String status = "OPEN";

    @Column(name = "contact_person", length = 255)
    private String contactPerson;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public NgoDemandRequest() {
        this.id = UUID.randomUUID().toString();
    }

    public NgoDemandRequest(String receiverId, String receiverName, LocalDate requestedDate, String mealPeriod,
                            String foodCategory, Integer peopleCount, Double servingsRequired, String unit,
                            String dietaryPreference, String contactPerson, String contactPhone) {
        this();
        this.receiverId = receiverId;
        this.receiverName = receiverName;
        this.requestedDate = requestedDate;
        this.mealPeriod = mealPeriod;
        this.foodCategory = foodCategory;
        this.peopleCount = peopleCount;
        this.servingsRequired = servingsRequired;
        this.unit = unit;
        this.dietaryPreference = dietaryPreference;
        this.contactPerson = contactPerson;
        this.contactPhone = contactPhone;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReceiverId() { return receiverId; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public LocalDate getRequestedDate() { return requestedDate; }
    public void setRequestedDate(LocalDate requestedDate) { this.requestedDate = requestedDate; }

    public String getMealPeriod() { return mealPeriod; }
    public void setMealPeriod(String mealPeriod) { this.mealPeriod = mealPeriod; }

    public String getFoodCategory() { return foodCategory; }
    public void setFoodCategory(String foodCategory) { this.foodCategory = foodCategory; }

    public Integer getPeopleCount() { return peopleCount; }
    public void setPeopleCount(Integer peopleCount) { this.peopleCount = peopleCount; }

    public Double getServingsRequired() { return servingsRequired; }
    public void setServingsRequired(Double servingsRequired) { this.servingsRequired = servingsRequired; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getDietaryPreference() { return dietaryPreference; }
    public void setDietaryPreference(String dietaryPreference) { this.dietaryPreference = dietaryPreference; }

    public String getLogisticsPreference() { return logisticsPreference; }
    public void setLogisticsPreference(String logisticsPreference) { this.logisticsPreference = logisticsPreference; }

    public Integer getStorageCapacityAvailable() { return storageCapacityAvailable; }
    public void setStorageCapacityAvailable(Integer storageCapacityAvailable) { this.storageCapacityAvailable = storageCapacityAvailable; }

    public Boolean getRecurringWeekly() { return recurringWeekly; }
    public void setRecurringWeekly(Boolean recurringWeekly) { this.recurringWeekly = recurringWeekly; }

    public Double getFulfilledServings() { return fulfilledServings; }
    public void setFulfilledServings(Double fulfilledServings) { this.fulfilledServings = fulfilledServings; }

    public String getMatchedListingId() { return matchedListingId; }
    public void setMatchedListingId(String matchedListingId) { this.matchedListingId = matchedListingId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

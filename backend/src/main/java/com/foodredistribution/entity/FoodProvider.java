package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "food_providers")
public class FoodProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String organizationName;

    @Column(nullable = false)
    private String organizationType; // RESTAURANT, HOTEL, HOSTEL, COLLEGE_CANTEEN, CORPORATE_CAFETERIA, SUPERMARKET, MARRIAGE_HALL, CATERING, EVENT_VENUE, HOUSEHOLD

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String contactPerson;
    private String contactPhone;

    @Column(nullable = false)
    private Double reliabilityScore = 95.0;

    private Integer activeListingsCount = 0;
    private Integer totalDonatedMeals = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public FoodProvider() {}

    public FoodProvider(User user, String organizationName, String organizationType, String address, Double latitude, Double longitude, String contactPerson, String contactPhone) {
        this.user = user;
        this.organizationName = organizationName;
        this.organizationType = organizationType;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.contactPerson = contactPerson;
        this.contactPhone = contactPhone;
        this.reliabilityScore = 95.0;
        this.activeListingsCount = 0;
        this.totalDonatedMeals = 0;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public String getOrganizationType() { return organizationType; }
    public void setOrganizationType(String organizationType) { this.organizationType = organizationType; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public Double getReliabilityScore() { return reliabilityScore; }
    public void setReliabilityScore(Double reliabilityScore) { this.reliabilityScore = reliabilityScore; }

    public Integer getActiveListingsCount() { return activeListingsCount; }
    public void setActiveListingsCount(Integer activeListingsCount) { this.activeListingsCount = activeListingsCount; }

    public Integer getTotalDonatedMeals() { return totalDonatedMeals; }
    public void setTotalDonatedMeals(Integer totalDonatedMeals) { this.totalDonatedMeals = totalDonatedMeals; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

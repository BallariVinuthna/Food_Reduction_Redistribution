package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "receivers")
public class Receiver {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String organizationName;

    @Column(nullable = false)
    private String organizationType; // NGO, SHELTER, COMMUNITY_ORG, ORPHANAGE, OLD_AGE_HOME

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String contactPerson;
    private String contactPhone;

    @Column(nullable = false)
    private Integer capacityMeals = 50;

    private String dietaryPreference = "ANY"; // ANY, VEG_ONLY

    @Column(nullable = false)
    private boolean isAvailable = true;

    @Column(nullable = false)
    private Double reliabilityScore = 96.0;

    private Integer totalReceivedMeals = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Receiver() {}

    public Receiver(User user, String organizationName, String organizationType, String address, Double latitude, Double longitude, String contactPerson, String contactPhone, Integer capacityMeals, String dietaryPreference) {
        this.user = user;
        this.organizationName = organizationName;
        this.organizationType = organizationType;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.contactPerson = contactPerson;
        this.contactPhone = contactPhone;
        this.capacityMeals = capacityMeals != null ? capacityMeals : 50;
        this.dietaryPreference = dietaryPreference != null ? dietaryPreference : "ANY";
        this.isAvailable = true;
        this.reliabilityScore = 96.0;
        this.totalReceivedMeals = 0;
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

    public Integer getCapacityMeals() { return capacityMeals; }
    public void setCapacityMeals(Integer capacityMeals) { this.capacityMeals = capacityMeals; }

    public String getDietaryPreference() { return dietaryPreference; }
    public void setDietaryPreference(String dietaryPreference) { this.dietaryPreference = dietaryPreference; }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }

    public Double getReliabilityScore() { return reliabilityScore; }
    public void setReliabilityScore(Double reliabilityScore) { this.reliabilityScore = reliabilityScore; }

    public Integer getTotalReceivedMeals() { return totalReceivedMeals; }
    public void setTotalReceivedMeals(Integer totalReceivedMeals) { this.totalReceivedMeals = totalReceivedMeals; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

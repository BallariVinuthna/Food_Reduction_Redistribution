package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "volunteers")
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String phone;

    private String vehicleType = "TWO_WHEELER"; // TWO_WHEELER, THREE_WHEELER, FOUR_WHEELER, VAN

    private Double currentLatitude;
    private Double currentLongitude;

    @Column(nullable = false)
    private boolean isAvailable = true;

    private Integer activePickupsCount = 0;
    private Integer totalCompletedPickups = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Volunteer() {}

    public Volunteer(User user, String fullName, String phone, String vehicleType, Double currentLatitude, Double currentLongitude) {
        this.user = user;
        this.fullName = fullName;
        this.phone = phone;
        this.vehicleType = vehicleType != null ? vehicleType : "TWO_WHEELER";
        this.currentLatitude = currentLatitude;
        this.currentLongitude = currentLongitude;
        this.isAvailable = true;
        this.activePickupsCount = 0;
        this.totalCompletedPickups = 0;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public Double getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(Double currentLatitude) { this.currentLatitude = currentLatitude; }

    public Double getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(Double currentLongitude) { this.currentLongitude = currentLongitude; }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }

    public Integer getActivePickupsCount() { return activePickupsCount; }
    public void setActivePickupsCount(Integer activePickupsCount) { this.activePickupsCount = activePickupsCount; }

    public Integer getTotalCompletedPickups() { return totalCompletedPickups; }
    public void setTotalCompletedPickups(Integer totalCompletedPickups) { this.totalCompletedPickups = totalCompletedPickups; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

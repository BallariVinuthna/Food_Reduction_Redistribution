package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "food_safety_checks")
public class FoodSafetyCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_listing_id", nullable = false)
    private FoodListing foodListing;

    @Column(nullable = false)
    private boolean temperatureSafe = true;

    @Column(nullable = false)
    private boolean cleanPackaging = true;

    @Column(nullable = false)
    private boolean preparedWithinSafeWindow = true;

    @Column(nullable = false)
    private boolean allergenDeclared = true;

    @Column(nullable = false)
    private boolean providerCertified = true;

    private String notes;

    @Column(name = "checked_at", nullable = false)
    private LocalDateTime checkedAt = LocalDateTime.now();

    public FoodSafetyCheck() {}

    public FoodSafetyCheck(FoodListing foodListing, boolean temperatureSafe, boolean cleanPackaging,
                           boolean preparedWithinSafeWindow, boolean allergenDeclared, boolean providerCertified, String notes) {
        this.foodListing = foodListing;
        this.temperatureSafe = temperatureSafe;
        this.cleanPackaging = cleanPackaging;
        this.preparedWithinSafeWindow = preparedWithinSafeWindow;
        this.allergenDeclared = allergenDeclared;
        this.providerCertified = providerCertified;
        this.notes = notes;
        this.checkedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public FoodListing getFoodListing() { return foodListing; }
    public void setFoodListing(FoodListing foodListing) { this.foodListing = foodListing; }

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

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCheckedAt() { return checkedAt; }
    public void setCheckedAt(LocalDateTime checkedAt) { this.checkedAt = checkedAt; }
}

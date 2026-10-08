package com.foodredistribution.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class FoodSafetyCheckDto {
    private UUID id;
    private boolean temperatureSafe;
    private boolean cleanPackaging;
    private boolean preparedWithinSafeWindow;
    private boolean allergenDeclared;
    private boolean providerCertified;
    private String notes;
    private LocalDateTime checkedAt;

    public FoodSafetyCheckDto() {}

    public FoodSafetyCheckDto(UUID id, boolean temperatureSafe, boolean cleanPackaging,
                              boolean preparedWithinSafeWindow, boolean allergenDeclared,
                              boolean providerCertified, String notes, LocalDateTime checkedAt) {
        this.id = id;
        this.temperatureSafe = temperatureSafe;
        this.cleanPackaging = cleanPackaging;
        this.preparedWithinSafeWindow = preparedWithinSafeWindow;
        this.allergenDeclared = allergenDeclared;
        this.providerCertified = providerCertified;
        this.notes = notes;
        this.checkedAt = checkedAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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

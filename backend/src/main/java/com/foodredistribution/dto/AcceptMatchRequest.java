package com.foodredistribution.dto;

import java.util.UUID;

public class AcceptMatchRequest {
    private String notes;
    private UUID volunteerId; // Optional: volunteer selected or system assigned

    public AcceptMatchRequest() {}

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public UUID getVolunteerId() { return volunteerId; }
    public void setVolunteerId(UUID volunteerId) { this.volunteerId = volunteerId; }
}

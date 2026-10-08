package com.foodredistribution.dto;

import com.foodredistribution.entity.NotificationType;
import java.time.LocalDateTime;
import java.util.UUID;

public class NotificationDto {
    private UUID id;
    private String title;
    private String message;
    private NotificationType type;
    private boolean isRead;
    private String referenceId;
    private LocalDateTime createdAt;

    public NotificationDto() {}

    public NotificationDto(UUID id, String title, String message, NotificationType type, boolean isRead, String referenceId, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
        this.referenceId = referenceId;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

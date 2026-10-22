package com.foodredistribution.service;

import com.foodredistribution.dto.NotificationDto;
import com.foodredistribution.entity.Notification;
import com.foodredistribution.entity.NotificationType;
import com.foodredistribution.entity.User;
import com.foodredistribution.exception.ResourceNotFoundException;
import com.foodredistribution.repository.NotificationRepository;
import com.foodredistribution.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ExternalNotificationService externalNotificationService;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               SimpMessagingTemplate messagingTemplate,
                               ExternalNotificationService externalNotificationService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
        this.externalNotificationService = externalNotificationService;
    }

    @Transactional
    public NotificationDto createAndSend(User recipient, String title, String message, NotificationType type, String referenceId) {
        Notification notification = new Notification(recipient, title, message, type, referenceId);
        notification = notificationRepository.save(notification);

        NotificationDto dto = mapToDto(notification);

        // Push real-time alert via WebSocket STOMP
        try {
            messagingTemplate.convertAndSend("/topic/notifications/" + recipient.getId(), dto);
            messagingTemplate.convertAndSend("/topic/notifications/broadcast", dto);
        } catch (Exception ignored) {}

        // Dispatch via Resend Email and Twilio SMS
        try {
            if (recipient != null && recipient.getEmail() != null && !recipient.getEmail().endsWith(".local")) {
                externalNotificationService.sendEmail(
                        recipient.getEmail(),
                        title + " - SurplusFlow",
                        "<div style='font-family:sans-serif;padding:16px;'><h3>" + title + "</h3><p>" + message + "</p></div>"
                );
            }
            if (recipient != null && recipient.getPhone() != null && !recipient.getPhone().isBlank()) {
                externalNotificationService.sendSms(recipient.getPhone(), title + ": " + message);
            }
        } catch (Exception ignored) {}

        return dto;
    }

    public List<NotificationDto> getUserNotifications(UUID userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<NotificationDto> getUnreadNotifications(UUID userId) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public NotificationDto mapToDto(Notification n) {
        return new NotificationDto(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getType(),
                n.isRead(),
                n.getReferenceId(),
                n.getCreatedAt()
        );
    }
}

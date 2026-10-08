package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.dto.NotificationDto;
import com.foodredistribution.entity.User;
import com.foodredistribution.repository.UserRepository;
import com.foodredistribution.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(ApiResponse.ok(Collections.emptyList()));
        }
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.ok(ApiResponse.ok(Collections.emptyList()));
        }
        List<NotificationDto> notifications = notificationService.getUserNotifications(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(notifications));
    }

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getUnreadNotifications(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(ApiResponse.ok(Collections.emptyList()));
        }
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.ok(ApiResponse.ok(Collections.emptyList()));
        }
        List<NotificationDto> notifications = notificationService.getUnreadNotifications(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(notifications));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", null));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(Authentication authentication) {
        if (authentication != null) {
            userRepository.findByEmail(authentication.getName()).ifPresent(u -> notificationService.markAllAsRead(u.getId()));
        }
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read", null));
    }
}

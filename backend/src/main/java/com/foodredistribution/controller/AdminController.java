package com.foodredistribution.controller;

import com.foodredistribution.dto.AdminConfigDto;
import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.entity.*;
import com.foodredistribution.exception.ResourceNotFoundException;
import com.foodredistribution.repository.AdminConfigRepository;
import com.foodredistribution.repository.FoodProviderRepository;
import com.foodredistribution.repository.ReceiverRepository;
import com.foodredistribution.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminConfigRepository adminConfigRepository;
    private final AuditService auditService;
    private final FoodProviderRepository foodProviderRepository;
    private final ReceiverRepository receiverRepository;

    public AdminController(AdminConfigRepository adminConfigRepository,
                           AuditService auditService,
                           FoodProviderRepository foodProviderRepository,
                           ReceiverRepository receiverRepository) {
        this.adminConfigRepository = adminConfigRepository;
        this.auditService = auditService;
        this.foodProviderRepository = foodProviderRepository;
        this.receiverRepository = receiverRepository;
    }

    @GetMapping("/config")
    public ResponseEntity<ApiResponse<AdminConfig>> getConfig() {
        AdminConfig config = adminConfigRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseGet(() -> {
                    AdminConfig c = new AdminConfig();
                    return adminConfigRepository.save(c);
                });
        return ResponseEntity.ok(ApiResponse.ok(config));
    }

    @PutMapping("/config")
    public ResponseEntity<ApiResponse<AdminConfig>> updateConfig(@RequestBody AdminConfigDto dto) {
        AdminConfig config = adminConfigRepository.findFirstByOrderByUpdatedAtDesc()
                .orElse(new AdminConfig());

        if (dto.getWeightDistance() != null) config.setWeightDistance(dto.getWeightDistance());
        if (dto.getWeightQuantity() != null) config.setWeightQuantity(dto.getWeightQuantity());
        if (dto.getWeightUrgency() != null) config.setWeightUrgency(dto.getWeightUrgency());
        if (dto.getWeightFoodType() != null) config.setWeightFoodType(dto.getWeightFoodType());
        if (dto.getWeightCapacity() != null) config.setWeightCapacity(dto.getWeightCapacity());
        if (dto.getWeightAvailability() != null) config.setWeightAvailability(dto.getWeightAvailability());
        if (dto.getMaxSearchRadiusKm() != null) config.setMaxSearchRadiusKm(dto.getMaxSearchRadiusKm());
        if (dto.getUrgencyCriticalMinutes() != null) config.setUrgencyCriticalMinutes(dto.getUrgencyCriticalMinutes());
        if (dto.getUrgencyHighMinutes() != null) config.setUrgencyHighMinutes(dto.getUrgencyHighMinutes());
        if (dto.getUrgencyMediumMinutes() != null) config.setUrgencyMediumMinutes(dto.getUrgencyMediumMinutes());
        config.setUpdatedAt(LocalDateTime.now());

        config = adminConfigRepository.save(config);
        auditService.log("ADMIN", "UPDATE_CONFIG", "AdminConfig", config.getId().toString(), "Updated matching weights and parameters");

        return ResponseEntity.ok(ApiResponse.ok("Configuration updated successfully", config));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.ok(auditService.getRecentLogs()));
    }

    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<List<FoodProvider>>> getAllProviders() {
        return ResponseEntity.ok(ApiResponse.ok(foodProviderRepository.findAll()));
    }

    @PutMapping("/providers/{id}/verify")
    public ResponseEntity<ApiResponse<FoodProvider>> verifyProvider(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        FoodProvider provider = foodProviderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found: " + id));

        String statusStr = body.getOrDefault("status", "VERIFIED");
        VerificationStatus status = VerificationStatus.valueOf(statusStr.toUpperCase());
        String adminEmail = authentication != null ? authentication.getName() : "admin@demo.local";

        provider.setVerificationStatus(status);
        provider.setVerifiedAt(LocalDateTime.now());
        provider.setVerifiedBy(adminEmail);
        provider = foodProviderRepository.save(provider);

        auditService.log(adminEmail, "VERIFY_PROVIDER", "FoodProvider", provider.getId().toString(),
                "Provider verification status set to: " + status);

        return ResponseEntity.ok(ApiResponse.ok("Provider verification status updated", provider));
    }

    @GetMapping("/receivers")
    public ResponseEntity<ApiResponse<List<Receiver>>> getAllReceivers() {
        return ResponseEntity.ok(ApiResponse.ok(receiverRepository.findAll()));
    }

    @PutMapping("/receivers/{id}/verify")
    public ResponseEntity<ApiResponse<Receiver>> verifyReceiver(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        Receiver receiver = receiverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found: " + id));

        String statusStr = body.getOrDefault("status", "VERIFIED");
        VerificationStatus status = VerificationStatus.valueOf(statusStr.toUpperCase());
        String adminEmail = authentication != null ? authentication.getName() : "admin@demo.local";

        receiver.setVerificationStatus(status);
        receiver.setVerifiedAt(LocalDateTime.now());
        receiver.setVerifiedBy(adminEmail);
        receiver = receiverRepository.save(receiver);

        auditService.log(adminEmail, "VERIFY_RECEIVER", "Receiver", receiver.getId().toString(),
                "Receiver verification status set to: " + status);

        return ResponseEntity.ok(ApiResponse.ok("Receiver verification status updated", receiver));
    }
}

package com.foodredistribution.controller;

import com.foodredistribution.dto.AdminConfigDto;
import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.entity.AdminConfig;
import com.foodredistribution.entity.AuditLog;
import com.foodredistribution.repository.AdminConfigRepository;
import com.foodredistribution.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminConfigRepository adminConfigRepository;
    private final AuditService auditService;

    public AdminController(AdminConfigRepository adminConfigRepository, AuditService auditService) {
        this.adminConfigRepository = adminConfigRepository;
        this.auditService = auditService;
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
}

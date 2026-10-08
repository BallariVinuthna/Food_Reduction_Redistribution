package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.dto.PickupAssignmentDto;
import com.foodredistribution.dto.UpdatePickupStatusRequest;
import com.foodredistribution.entity.PickupStatus;
import com.foodredistribution.service.PickupService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/pickups")
public class PickupController {

    private final PickupService pickupService;

    public PickupController(PickupService pickupService) {
        this.pickupService = pickupService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PickupAssignmentDto>>> getAllPickups(
            @RequestParam(required = false) PickupStatus status) {
        List<PickupAssignmentDto> pickups = pickupService.getAllPickups(status);
        return ResponseEntity.ok(ApiResponse.ok(pickups));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PickupAssignmentDto>> getPickupById(@PathVariable UUID id) {
        PickupAssignmentDto dto = pickupService.getPickupById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<ApiResponse<List<PickupAssignmentDto>>> getVolunteerPickups(@PathVariable UUID volunteerId) {
        List<PickupAssignmentDto> pickups = pickupService.getVolunteerPickups(volunteerId);
        return ResponseEntity.ok(ApiResponse.ok(pickups));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<PickupAssignmentDto>> assignVolunteer(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        UUID volunteerId = UUID.fromString(body.get("volunteerId"));
        PickupAssignmentDto dto = pickupService.assignVolunteer(id, volunteerId);
        return ResponseEntity.ok(ApiResponse.ok("Volunteer assigned successfully", dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PickupAssignmentDto>> updatePickupStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePickupStatusRequest req,
            Authentication authentication) {
        String userEmail = authentication != null ? authentication.getName() : "volunteer@demo.local";
        PickupAssignmentDto dto = pickupService.updatePickupStatus(id, req, userEmail);
        return ResponseEntity.ok(ApiResponse.ok("Pickup status updated successfully", dto));
    }
}

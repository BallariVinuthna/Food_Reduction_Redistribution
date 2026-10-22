package com.foodredistribution.controller;

import com.foodredistribution.dto.AcceptMatchRequest;
import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.dto.MatchDto;
import com.foodredistribution.service.MatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @PostMapping({ "/{foodListingId}", "/generate/{foodListingId}" })
    public ResponseEntity<ApiResponse<List<MatchDto>>> generateMatches(@PathVariable UUID foodListingId) {
        List<MatchDto> matches = matchingService.generateMatchesForListing(foodListingId);
        return ResponseEntity.ok(ApiResponse.ok("Smart matches generated successfully", matches));
    }

    @PostMapping("/{foodListingId}/claim")
    public ResponseEntity<ApiResponse<MatchDto>> claimListing(
            @PathVariable UUID foodListingId,
            @RequestBody(required = false) Map<String, Object> req,
            Authentication authentication) {
        String userEmail = authentication != null ? authentication.getName() : "receiver@demo.local";
        MatchDto match = matchingService.claimListing(foodListingId, req, userEmail);
        return ResponseEntity.ok(ApiResponse.ok("Surplus food successfully claimed and assigned", match));
    }

    @GetMapping("/{foodListingId}")
    public ResponseEntity<ApiResponse<List<MatchDto>>> getMatchesForListing(@PathVariable UUID foodListingId) {
        List<MatchDto> matches = matchingService.getMatchesForListing(foodListingId);
        return ResponseEntity.ok(ApiResponse.ok(matches));
    }

    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<ApiResponse<List<MatchDto>>> getReceiverMatches(@PathVariable UUID receiverId) {
        List<MatchDto> matches = matchingService.getReceiverMatches(receiverId);
        return ResponseEntity.ok(ApiResponse.ok(matches));
    }

    @PostMapping("/{matchId}/accept")
    public ResponseEntity<ApiResponse<MatchDto>> acceptMatch(
            @PathVariable UUID matchId,
            @RequestBody(required = false) AcceptMatchRequest req,
            Authentication authentication) {
        String userEmail = authentication != null ? authentication.getName() : "receiver@demo.local";
        MatchDto match = matchingService.acceptMatch(matchId, req, userEmail);
        return ResponseEntity.ok(ApiResponse.ok("Match accepted and pickup coordinated", match));
    }

    @PostMapping("/{matchId}/reject")
    public ResponseEntity<ApiResponse<MatchDto>> rejectMatch(
            @PathVariable UUID matchId,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication) {
        String userEmail = authentication != null ? authentication.getName() : "receiver@demo.local";
        String reason = (body != null && body.containsKey("reason")) ? body.get("reason") : "Capacity temporarily full";
        MatchDto match = matchingService.rejectMatch(matchId, reason, userEmail);
        return ResponseEntity.ok(ApiResponse.ok("Match rejected; next ranked receiver notified", match));
    }

    @PostMapping("/{foodListingId}/split-allocate")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> splitAllocate(
            @PathVariable UUID foodListingId,
            @RequestBody List<Map<String, Object>> allocations,
            Authentication authentication) {
        String userEmail = authentication != null ? authentication.getName() : "receiver@demo.local";
        List<Map<String, Object>> results = new java.util.ArrayList<>();
        for (Map<String, Object> alloc : allocations) {
            MatchDto match = matchingService.claimListing(foodListingId, alloc, userEmail);
            results.add(Map.of(
                    "matchId", match.getId(),
                    "receiverName", match.getReceiverOrganizationName(),
                    "quantityAllocated", alloc.getOrDefault("quantity", match.getQuantity()),
                    "status", match.getStatus()
            ));
        }
        return ResponseEntity.ok(ApiResponse.ok("Split donation successfully allocated across receivers", results));
    }
}

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

    @PostMapping("/{foodListingId}")
    public ResponseEntity<ApiResponse<List<MatchDto>>> generateMatches(@PathVariable UUID foodListingId) {
        List<MatchDto> matches = matchingService.generateMatchesForListing(foodListingId);
        return ResponseEntity.ok(ApiResponse.ok("Smart matches generated successfully", matches));
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
}

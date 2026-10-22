package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.dto.CreateFoodListingRequest;
import com.foodredistribution.dto.FoodListingDto;
import com.foodredistribution.entity.FoodStatus;
import com.foodredistribution.service.FoodListingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/food-listings")
public class FoodListingController {

    private final FoodListingService foodListingService;
    private final com.foodredistribution.service.MatchingService matchingService;

    public FoodListingController(FoodListingService foodListingService, com.foodredistribution.service.MatchingService matchingService) {
        this.foodListingService = foodListingService;
        this.matchingService = matchingService;
    }

    @PostMapping("/{id}/claim")
    public ResponseEntity<ApiResponse<com.foodredistribution.dto.MatchDto>> claimListing(
            @PathVariable UUID id,
            @RequestBody(required = false) java.util.Map<String, Object> req,
            Authentication authentication) {
        String userEmail = authentication != null ? authentication.getName() : "receiver@demo.local";
        com.foodredistribution.dto.MatchDto match = matchingService.claimListing(id, req, userEmail);
        return ResponseEntity.ok(ApiResponse.ok("Surplus food successfully claimed and assigned", match));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FoodListingDto>> createListing(
            @Valid @RequestBody CreateFoodListingRequest req,
            Authentication authentication) {
        FoodListingDto dto = foodListingService.createListing(authentication.getName(), req);
        return ResponseEntity.ok(ApiResponse.ok("Surplus food listing published successfully", dto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodListingDto>>> getAllListings(
            @RequestParam(required = false) FoodStatus status,
            @RequestParam(required = false) String category) {
        List<FoodListingDto> listings = foodListingService.getAllListings(status, category);
        return ResponseEntity.ok(ApiResponse.ok(listings));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<FoodListingDto>>> getActiveSurplus() {
        List<FoodListingDto> listings = foodListingService.getActiveListings();
        return ResponseEntity.ok(ApiResponse.ok(listings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodListingDto>> getListingById(@PathVariable UUID id) {
        FoodListingDto dto = foodListingService.getListingById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse<List<FoodListingDto>>> getProviderListings(@PathVariable UUID providerId) {
        List<FoodListingDto> listings = foodListingService.getProviderListings(providerId);
        return ResponseEntity.ok(ApiResponse.ok(listings));
    }
}

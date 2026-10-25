package com.foodredistribution.controller;

import com.foodredistribution.dto.*;
import com.foodredistribution.entity.SurplusPredictionRecord;
import com.foodredistribution.service.SurplusPredictionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prediction")
public class SurplusPredictionController {

    private final SurplusPredictionService service;

    public SurplusPredictionController(SurplusPredictionService service) {
        this.service = service;
    }

    /**
     * 1. Food Preparation Tracker - Log a new meal preparation & consumption record
     */
    @PostMapping("/preparation-records")
    public ResponseEntity<ApiResponse<SurplusPredictionRecord>> createPreparationRecord(
            @Valid @RequestBody FoodPreparationEntryRequest request,
            Authentication authentication) {
        try {
            SurplusPredictionRecord saved = service.createPreparationRecord(request, authentication);
            return ResponseEntity.ok(ApiResponse.ok("Preparation record saved successfully.", saved));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 2. Food Preparation Tracker - Update an existing preparation record
     */
    @PutMapping("/preparation-records/{id}")
    public ResponseEntity<ApiResponse<SurplusPredictionRecord>> updatePreparationRecord(
            @PathVariable String id,
            @Valid @RequestBody FoodPreparationEntryRequest request,
            Authentication authentication) {
        try {
            SurplusPredictionRecord updated = service.updatePreparationRecord(id, request, authentication);
            return ResponseEntity.ok(ApiResponse.ok("Preparation record updated.", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 3. Food Preparation Tracker - Filtered history of preparation records
     */
    @GetMapping("/preparation-records")
    public ResponseEntity<ApiResponse<List<SurplusPredictionRecord>>> getPreparationRecords(
            @RequestParam(required = false) String providerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String mealPeriod,
            Authentication authentication) {
        List<SurplusPredictionRecord> records = service.getFilteredRecords(providerId, startDate, endDate, category, mealPeriod, authentication);
        return ResponseEntity.ok(ApiResponse.ok(records));
    }

    /**
     * 4. Smart Preparation Advisor - Dynamic demand prediction for upcoming meals
     */
    @GetMapping("/advisor/forecast")
    public ResponseEntity<ApiResponse<SmartPreparationPredictionDto>> getSmartDemandPrediction(
            @RequestParam(required = false) String providerId,
            @RequestParam(defaultValue = "Veg Biryani & Rice") String foodItem,
            @RequestParam(defaultValue = "LUNCH") String mealPeriod,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate targetDate,
            @RequestParam(defaultValue = "10.0") Double safetyMarginPct,
            Authentication authentication) {
        SmartPreparationPredictionDto forecast = service.getSmartDemandPrediction(
                providerId, foodItem, mealPeriod, targetDate, safetyMarginPct, authentication);
        return ResponseEntity.ok(ApiResponse.ok(forecast));
    }

    /**
     * 5. Smart Preparation Advisor - Comprehensive dashboard summary & evaluation metrics
     */
    @GetMapping("/advisor/dashboard")
    public ResponseEntity<ApiResponse<PreparationAdvisorDashboardSummaryDto>> getDashboardSummary(
            @RequestParam(required = false) String providerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String mealPeriod,
            Authentication authentication) {
        PreparationAdvisorDashboardSummaryDto summary = service.getDashboardSummary(
                providerId, startDate, endDate, category, mealPeriod, authentication);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    /**
     * 6. Surplus Redistribution Handoff - Pre-fill remaining surplus for CreateListingWizard
     */
    @PostMapping("/preparation-records/{id}/donate-handoff")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDonationHandoff(
            @PathVariable String id,
            Authentication authentication) {
        try {
            Map<String, Object> handoff = service.prepareDonationHandoff(id, authentication);
            return ResponseEntity.ok(ApiResponse.ok("Donation handoff details prepared.", handoff));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 7. Surplus Redistribution Handoff - Confirm listing creation and update record
     */
    @PostMapping("/preparation-records/{id}/mark-donated")
    public ResponseEntity<ApiResponse<SurplusPredictionRecord>> markDonated(
            @PathVariable String id,
            @RequestParam double quantity,
            @RequestParam(required = false) String listingId,
            Authentication authentication) {
        try {
            SurplusPredictionRecord record = service.markLeftoverAsDonated(id, quantity, listingId, authentication);
            return ResponseEntity.ok(ApiResponse.ok("Record marked as donated.", record));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Backward Compatible Endpoints ---

    @GetMapping("/forecast")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getForecast(
            @RequestParam(defaultValue = "default-provider") String providerId,
            @RequestParam(defaultValue = "Veg Biryani & Rice") String foodItem,
            @RequestParam(defaultValue = "LUNCH") String mealPeriod) {
        Map<String, Object> forecast = service.getForecastAndRecommendations(providerId, foodItem, mealPeriod);
        return ResponseEntity.ok(ApiResponse.ok(forecast));
    }

    @PostMapping("/log-production")
    public ResponseEntity<ApiResponse<SurplusPredictionRecord>> logProduction(
            @RequestBody SurplusPredictionRecord record,
            Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            if (record.getProviderId() == null) {
                record.setProviderId(authentication.getName());
            }
        }
        SurplusPredictionRecord saved = service.logProductionRecord(record);
        return ResponseEntity.ok(ApiResponse.ok(saved));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<SurplusPredictionRecord>>> getHistory(
            @RequestParam(defaultValue = "default-provider") String providerId) {
        List<SurplusPredictionRecord> history = service.getProviderHistory(providerId);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }
}

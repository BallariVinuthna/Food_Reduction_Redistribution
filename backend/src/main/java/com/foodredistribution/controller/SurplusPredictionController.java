package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.entity.SurplusPredictionRecord;
import com.foodredistribution.service.SurplusPredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prediction")
public class SurplusPredictionController {

    private final SurplusPredictionService service;

    public SurplusPredictionController(SurplusPredictionService service) {
        this.service = service;
    }

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

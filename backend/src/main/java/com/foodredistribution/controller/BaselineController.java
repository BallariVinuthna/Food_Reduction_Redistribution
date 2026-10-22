package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.dto.BaselineMetricDto;
import com.foodredistribution.service.BaselineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/baseline")
public class BaselineController {

    private final BaselineService baselineService;

    public BaselineController(BaselineService baselineService) {
        this.baselineService = baselineService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BaselineMetricDto>>> getAllMetrics() {
        return ResponseEntity.ok(ApiResponse.ok(baselineService.getAllBaselineMetrics()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BaselineMetricDto>> createOrUpdate(
            @Valid @RequestBody BaselineMetricDto dto,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "admin@demo.local";
        BaselineMetricDto saved = baselineService.saveOrUpdate(dto, email);
        return ResponseEntity.ok(ApiResponse.ok("Baseline metric saved", saved));
    }

    @PostMapping("/calculate-improvement")
    public ResponseEntity<ApiResponse<Map<String, Object>>> calculateImprovement(
            @RequestBody Map<String, Object> req) {
        String metricKey = (String) req.get("metricKey");
        Double postValue = req.get("postValue") != null ? Double.valueOf(req.get("postValue").toString()) : 0.0;
        String postUnit = (String) req.get("postUnit");
        String postScope = (String) req.get("postScope");
        boolean isPostDemo = req.get("isPostDemo") != null ? Boolean.parseBoolean(req.get("isPostDemo").toString()) : false;

        Map<String, Object> result = baselineService.calculateInterventionImprovement(metricKey, postValue, postUnit, postScope, isPostDemo);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}

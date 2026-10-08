package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.dto.BaselineMetricDto;
import com.foodredistribution.service.BaselineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}

package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.dto.DashboardAnalyticsDto;
import com.foodredistribution.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardAnalyticsDto>> getDashboardAnalytics() {
        DashboardAnalyticsDto analytics = analyticsService.getDashboardAnalytics();
        return ResponseEntity.ok(ApiResponse.ok(analytics));
    }
}

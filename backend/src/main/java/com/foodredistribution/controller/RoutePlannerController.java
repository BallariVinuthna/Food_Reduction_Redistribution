package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.service.RoutePlannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/routes")
public class RoutePlannerController {

    private final RoutePlannerService routePlannerService;

    public RoutePlannerController(RoutePlannerService routePlannerService) {
        this.routePlannerService = routePlannerService;
    }

    @GetMapping("/optimal-plan")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOptimalPlan(
            @RequestParam(defaultValue = "vol-vikram") String volunteerId,
            Authentication authentication) {

        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            volunteerId = authentication.getName();
        }

        Map<String, Object> plan = routePlannerService.calculateOptimalRoute(volunteerId);
        return ResponseEntity.ok(ApiResponse.ok(plan));
    }

    @PostMapping("/recalculate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> recalculateRoute(
            @RequestBody(required = false) Map<String, Object> body,
            Authentication authentication) {

        String volunteerId = authentication != null ? authentication.getName() : "vol-vikram";
        Map<String, Object> plan = routePlannerService.calculateOptimalRoute(volunteerId);
        return ResponseEntity.ok(ApiResponse.ok(plan));
    }
}

package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.entity.SystemIdea;
import com.foodredistribution.repository.SystemIdeaRepository;
import com.foodredistribution.service.PseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/pse")
public class PseController {

    private final PseService pseService;
    private final SystemIdeaRepository systemIdeaRepository;
    private final com.foodredistribution.service.LiveDemoSimulatorService liveDemoSimulatorService;

    public PseController(PseService pseService,
                         SystemIdeaRepository systemIdeaRepository,
                         com.foodredistribution.service.LiveDemoSimulatorService liveDemoSimulatorService) {
        this.pseService = pseService;
        this.systemIdeaRepository = systemIdeaRepository;
        this.liveDemoSimulatorService = liveDemoSimulatorService;
    }

    @PostMapping("/live-demo/refresh")
    public ResponseEntity<ApiResponse<Map<String, Object>>> refreshLiveDemo() {
        Map<String, Object> result = liveDemoSimulatorService.forceRefreshLiveDemo();
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/module-1")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getModule1() {
        return ResponseEntity.ok(ApiResponse.ok(pseService.getModule1Data()));
    }

    @GetMapping("/module-2")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getModule2() {
        return ResponseEntity.ok(ApiResponse.ok(pseService.getModule2Data()));
    }

    @GetMapping("/module-3")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getModule3() {
        return ResponseEntity.ok(ApiResponse.ok(pseService.getModule3Data()));
    }

    @GetMapping("/module-4")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getModule4() {
        return ResponseEntity.ok(ApiResponse.ok(pseService.getModule4Data()));
    }

    @GetMapping("/module-5")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getModule5() {
        return ResponseEntity.ok(ApiResponse.ok(pseService.getModule5Data()));
    }

    @PutMapping("/ideas/{id}")
    public ResponseEntity<ApiResponse<SystemIdea>> updateIdea(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> body) {
        return systemIdeaRepository.findById(id).map(idea -> {
            if (body.containsKey("impactScore")) {
                idea.setImpactScore(Double.valueOf(body.get("impactScore").toString()));
            }
            if (body.containsKey("feasibilityScore")) {
                idea.setFeasibilityScore(Double.valueOf(body.get("feasibilityScore").toString()));
            }
            if (body.containsKey("status")) {
                idea.setStatus(body.get("status").toString());
            }
            systemIdeaRepository.save(idea);
            return ResponseEntity.ok(ApiResponse.ok("Idea updated", idea));
        }).orElse(ResponseEntity.notFound().build());
    }
}

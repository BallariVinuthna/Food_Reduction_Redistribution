package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.entity.PseExperiment;
import com.foodredistribution.service.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class IntelligenceAndOperationsController {

    private final RescuePriorityService rescuePriorityService;
    private final DonorReliabilityService donorReliabilityService;
    private final SmartUrgencyAlertService smartUrgencyAlertService;
    private final FailedPickupRecoveryService failedPickupRecoveryService;
    private final PseExperimentService pseExperimentService;

    public IntelligenceAndOperationsController(RescuePriorityService rescuePriorityService,
                                               DonorReliabilityService donorReliabilityService,
                                               SmartUrgencyAlertService smartUrgencyAlertService,
                                               FailedPickupRecoveryService failedPickupRecoveryService,
                                               PseExperimentService pseExperimentService) {
        this.rescuePriorityService = rescuePriorityService;
        this.donorReliabilityService = donorReliabilityService;
        this.smartUrgencyAlertService = smartUrgencyAlertService;
        this.failedPickupRecoveryService = failedPickupRecoveryService;
        this.pseExperimentService = pseExperimentService;
    }

    // 1. Rescue Priority Rankings (MCDA vs Nearest Neighbor)
    @GetMapping("/rescue-priority/rankings")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRescuePriorityRankings() {
        List<Map<String, Object>> rankings = rescuePriorityService.computeRescuePriorityRankings();
        return ResponseEntity.ok(ApiResponse.ok(rankings));
    }

    // 2. Donor Reliability & Trust Scores
    @GetMapping("/donors/{id}/reliability")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDonorReliability(@PathVariable String id) {
        Map<String, Object> scorecard = donorReliabilityService.getDonorScorecard(id);
        return ResponseEntity.ok(ApiResponse.ok(scorecard));
    }

    @GetMapping("/donors/leaderboard")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDonorLeaderboard() {
        List<Map<String, Object>> leaderboard = donorReliabilityService.getDonorLeaderboard();
        return ResponseEntity.ok(ApiResponse.ok(leaderboard));
    }

    // 3. Smart Urgency Alerts
    @GetMapping("/urgency/active-alerts")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getActiveUrgencyAlerts() {
        List<Map<String, Object>> alerts = smartUrgencyAlertService.evaluateActiveUrgencyAlerts();
        return ResponseEntity.ok(ApiResponse.ok(alerts));
    }

    // 4. Failed Pickup Recovery
    @PostMapping("/pickups/{id}/recover")
    public ResponseEntity<ApiResponse<Map<String, Object>>> recoverPickup(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.getOrDefault("reason", "Volunteer cancelled or missed assignment window") : "Cancelled";
        Map<String, Object> result = failedPickupRecoveryService.recoverFailedPickup(id, reason);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/pickups/recovery/run-scan")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> runOverdueScan() {
        List<Map<String, Object>> results = failedPickupRecoveryService.scanAndRecoverOverduePickups();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    // 5. PSE Experiment & Validation Lab
    @GetMapping("/experiments")
    public ResponseEntity<ApiResponse<List<PseExperiment>>> getExperiments() {
        List<PseExperiment> list = pseExperimentService.getAllExperiments();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/experiments")
    public ResponseEntity<ApiResponse<PseExperiment>> createExperiment(@RequestBody PseExperiment experiment) {
        PseExperiment saved = pseExperimentService.createExperiment(experiment);
        return ResponseEntity.ok(ApiResponse.ok(saved));
    }

    @PostMapping("/experiments/{id}/evaluate")
    public ResponseEntity<ApiResponse<PseExperiment>> evaluateExperiment(@PathVariable String id) {
        PseExperiment evaluated = pseExperimentService.evaluateExperiment(id);
        return ResponseEntity.ok(ApiResponse.ok(evaluated));
    }

    @GetMapping("/experiments/export-csv")
    public ResponseEntity<byte[]> exportExperimentsCsv() {
        byte[] csv = pseExperimentService.exportCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=pse_validation_experiments.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}

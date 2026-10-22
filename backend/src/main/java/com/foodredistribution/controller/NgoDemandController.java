package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.entity.NgoDemandRequest;
import com.foodredistribution.service.NgoDemandService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/demand")
public class NgoDemandController {

    private final NgoDemandService demandService;

    public NgoDemandController(NgoDemandService demandService) {
        this.demandService = demandService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NgoDemandRequest>> createDemand(@RequestBody NgoDemandRequest request) {
        NgoDemandRequest created = demandService.createDemandRequest(request);
        return ResponseEntity.ok(ApiResponse.ok(created));
    }

    @GetMapping("/calendar")
    public ResponseEntity<ApiResponse<List<NgoDemandRequest>>> getUpcomingDemands(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate) {
        List<NgoDemandRequest> demands = demandService.getUpcomingDemands(fromDate);
        return ResponseEntity.ok(ApiResponse.ok(demands));
    }

    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<ApiResponse<List<NgoDemandRequest>>> getReceiverDemands(@PathVariable String receiverId) {
        List<NgoDemandRequest> demands = demandService.getReceiverDemands(receiverId);
        return ResponseEntity.ok(ApiResponse.ok(demands));
    }

    @PostMapping("/{demandId}/match-surplus")
    public ResponseEntity<ApiResponse<Map<String, Object>>> matchDemandWithSurplus(@PathVariable String demandId) {
        Map<String, Object> result = demandService.matchDemandWithSurplus(demandId);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}

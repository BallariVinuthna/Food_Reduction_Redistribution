package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.service.QrTrackingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/qr")
public class QrTrackingController {

    private final QrTrackingService qrTrackingService;

    public QrTrackingController(QrTrackingService qrTrackingService) {
        this.qrTrackingService = qrTrackingService;
    }

    @GetMapping("/{transactionId}/code")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getQrCode(@PathVariable String transactionId) {
        Map<String, Object> qr = qrTrackingService.generateQrPayload(transactionId);
        return ResponseEntity.ok(ApiResponse.ok(qr));
    }

    @PostMapping("/{transactionId}/verify-scan")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyScan(
            @PathVariable String transactionId,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {

        String scannedPayload = payload.getOrDefault("scannedPayload", "SF-TXN://" + transactionId);
        String eventType = payload.getOrDefault("eventType", "AUDIT_SCAN");
        String actorEmail = authentication != null ? authentication.getName() : "volunteer@demo.local";

        Map<String, Object> result = qrTrackingService.processQrScan(transactionId, scannedPayload, eventType, actorEmail, "VOLUNTEER");
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{transactionId}/timeline")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTimeline(@PathVariable String transactionId) {
        Map<String, Object> timeline = qrTrackingService.getTimeline(transactionId);
        return ResponseEntity.ok(ApiResponse.ok(timeline));
    }
}

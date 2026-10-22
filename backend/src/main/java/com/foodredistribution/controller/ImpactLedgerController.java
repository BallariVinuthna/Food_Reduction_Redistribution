package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.service.VerifiedImpactLedgerService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/ledger")
public class ImpactLedgerController {

    private final VerifiedImpactLedgerService ledgerService;

    public ImpactLedgerController(VerifiedImpactLedgerService ledgerService) {
        this.ledgerService = ledgerService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> summary = ledgerService.getLedgerSummary(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/export-csv")
    public ResponseEntity<byte[]> exportCsv() {
        byte[] csv = ledgerService.exportCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=verified_impact_ledger.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}

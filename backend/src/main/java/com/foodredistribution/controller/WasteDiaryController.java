package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.entity.WasteDiaryEntry;
import com.foodredistribution.service.WasteDiaryService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/waste-diary")
public class WasteDiaryController {

    private final WasteDiaryService wasteDiaryService;

    public WasteDiaryController(WasteDiaryService wasteDiaryService) {
        this.wasteDiaryService = wasteDiaryService;
    }

    @PostMapping({"", "/entries"})
    public ResponseEntity<ApiResponse<WasteDiaryEntry>> logEntry(
            @RequestBody WasteDiaryEntry entry,
            Authentication authentication) {

        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            if (entry.getProviderId() == null) {
                entry.setProviderId(authentication.getName());
            }
        }
        WasteDiaryEntry saved = wasteDiaryService.logEntry(entry);
        return ResponseEntity.ok(ApiResponse.ok(saved));
    }

    @GetMapping({"", "/entries"})
    public ResponseEntity<ApiResponse<List<WasteDiaryEntry>>> getEntries(
            @RequestParam(defaultValue = "default-provider") String providerId) {
        List<WasteDiaryEntry> entries = wasteDiaryService.getProviderEntries(providerId);
        return ResponseEntity.ok(ApiResponse.ok(entries));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary(
            @RequestParam(defaultValue = "default-provider") String providerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Object> summary = wasteDiaryService.getWasteSummary(providerId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/export-csv")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(defaultValue = "default-provider") String providerId) {
        byte[] csv = wasteDiaryService.exportCsv(providerId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=surplusflow_waste_diary.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}

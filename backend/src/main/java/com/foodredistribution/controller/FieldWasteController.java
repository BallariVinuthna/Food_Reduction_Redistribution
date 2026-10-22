package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.dto.FieldWasteRecordDto;
import com.foodredistribution.service.FieldWasteRecordService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/field-waste")
public class FieldWasteController {

    private final FieldWasteRecordService fieldWasteRecordService;

    public FieldWasteController(FieldWasteRecordService fieldWasteRecordService) {
        this.fieldWasteRecordService = fieldWasteRecordService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<FieldWasteRecordDto>>> searchRecords(
            @RequestParam(required = false) Boolean isDemo,
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) String foodCategory,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<FieldWasteRecordDto> results = fieldWasteRecordService.searchRecords(isDemo, locality, foodCategory, startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FieldWasteRecordDto>> getRecordById(@PathVariable UUID id) {
        FieldWasteRecordDto dto = fieldWasteRecordService.getRecordById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FieldWasteRecordDto>> logRecord(
            @Valid @RequestBody FieldWasteRecordDto dto,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "auditor@field.local";
        FieldWasteRecordDto created = fieldWasteRecordService.logFieldRecord(dto, email);
        return ResponseEntity.ok(ApiResponse.ok("Field waste record logged successfully", created));
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<ApiResponse<FieldWasteRecordDto>> verifyRecord(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> req,
            Authentication authentication) {
        boolean approve = req.get("approve") != null && Boolean.parseBoolean(req.get("approve").toString());
        String notes = (String) req.get("notes");
        String email = authentication != null ? authentication.getName() : "admin@field.local";

        FieldWasteRecordDto verified = fieldWasteRecordService.verifyRecord(id, approve, notes, email);
        return ResponseEntity.ok(ApiResponse.ok("Field waste record verification updated", verified));
    }

    @GetMapping(value = "/export", produces = "text/csv")
    public ResponseEntity<String> exportCsv(@RequestParam(required = false, defaultValue = "false") Boolean isDemo) {
        String csv = fieldWasteRecordService.exportFieldWasteCsv(isDemo);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"field-waste-records.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}

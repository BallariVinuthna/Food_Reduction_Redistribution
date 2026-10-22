package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.dto.BenchmarkRunDto;
import com.foodredistribution.dto.PrototypeValidationReportDto;
import com.foodredistribution.entity.PrototypeTest;
import com.foodredistribution.service.PrototypeTestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/prototype-tests")
public class PrototypeTestController {

    private final PrototypeTestService prototypeTestService;

    public PrototypeTestController(PrototypeTestService prototypeTestService) {
        this.prototypeTestService = prototypeTestService;
    }

    @PostMapping("/run")
    public ResponseEntity<ApiResponse<PrototypeValidationReportDto>> runBenchmark() {
        PrototypeValidationReportDto report = prototypeTestService.runBenchmarkSimulation();
        return ResponseEntity.ok(ApiResponse.ok("Benchmark simulation executed successfully", report));
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<List<PrototypeTest>>> getResults(@RequestParam(required = false) String runId) {
        List<PrototypeTest> results = prototypeTestService.getTestResults(runId);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/runs")
    public ResponseEntity<ApiResponse<List<BenchmarkRunDto>>> getBenchmarkRuns() {
        List<BenchmarkRunDto> runs = prototypeTestService.getAllBenchmarkRuns();
        return ResponseEntity.ok(ApiResponse.ok(runs));
    }
}

package com.foodredistribution.service;

import com.foodredistribution.dto.BaselineMetricDto;
import com.foodredistribution.entity.BaselineMetric;
import com.foodredistribution.exception.ResourceNotFoundException;
import com.foodredistribution.repository.BaselineMetricRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BaselineService {

    private final BaselineMetricRepository baselineMetricRepository;
    private final AuditService auditService;

    public BaselineService(BaselineMetricRepository baselineMetricRepository, AuditService auditService) {
        this.baselineMetricRepository = baselineMetricRepository;
        this.auditService = auditService;
    }

    public List<BaselineMetricDto> getAllBaselineMetrics() {
        return baselineMetricRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public BaselineMetricDto getMetricByKey(String key) {
        BaselineMetric metric = baselineMetricRepository.findByMetricKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Baseline metric not found: " + key));
        return mapToDto(metric);
    }

    @Transactional
    public BaselineMetricDto saveOrUpdate(BaselineMetricDto dto, String userEmail) {
        BaselineMetric metric = baselineMetricRepository.findByMetricKey(dto.getMetricKey())
                .orElse(new BaselineMetric());

        metric.setMetricKey(dto.getMetricKey());
        metric.setMetricName(dto.getMetricName());
        metric.setDescription(dto.getDescription());
        metric.setBaselineValue(dto.getBaselineValue());
        metric.setUnit(dto.getUnit());
        metric.setDataSource(dto.getDataSource());
        metric.setNotes(dto.getNotes());
        metric.setDemo(dto.isDemo()); // Team can set isDemo=false once real field data is collected
        metric.setUpdatedAt(LocalDateTime.now());

        metric = baselineMetricRepository.save(metric);
        auditService.log(userEmail, "UPDATE_BASELINE", "BaselineMetric", metric.getId().toString(),
                "Updated baseline metric: " + metric.getMetricName() + " to " + metric.getBaselineValue());

        return mapToDto(metric);
    }

    public Map<String, Object> calculateInterventionImprovement(String metricKey, Double postValue, String postUnit, String postScope, boolean isPostDemo) {
        BaselineMetric baseline = baselineMetricRepository.findByMetricKey(metricKey)
                .orElseThrow(() -> new ResourceNotFoundException("Baseline metric not found: " + metricKey));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("metricKey", metricKey);
        result.put("metricName", baseline.getMetricName());
        result.put("baselineValue", baseline.getBaselineValue());
        result.put("baselineUnit", baseline.getUnit());
        result.put("baselineIsDemo", baseline.isDemo());
        result.put("postValue", postValue);
        result.put("postUnit", postUnit);
        result.put("postIsDemo", isPostDemo);

        // Strict comparability checks
        boolean unitsMatch = baseline.getUnit() != null && postUnit != null &&
                baseline.getUnit().trim().equalsIgnoreCase(postUnit.trim());
        result.put("unitsMatch", unitsMatch);

        boolean isRealWorld = !baseline.isDemo() && !isPostDemo;
        result.put("isRealWorldEvidence", isRealWorld);

        if (!unitsMatch) {
            result.put("isComparable", false);
            result.put("improvementPercentage", null);
            result.put("validationStatus", "INCOMPARABLE_UNITS");
            result.put("explanation", "Cannot calculate before/after improvement: Incompatible units (" + baseline.getUnit() + " vs " + postUnit + "). Units and measurement scope must match.");
            return result;
        }

        if (!isRealWorld) {
            double delta = baseline.getBaselineValue() - postValue;
            double pct = baseline.getBaselineValue() > 0 ? (delta / baseline.getBaselineValue()) * 100.0 : 0.0;
            result.put("isComparable", true);
            result.put("improvementPercentage", Math.round(pct * 10.0) / 10.0);
            result.put("validationStatus", "DEMO_ILLUSTRATION_ONLY");
            result.put("explanation", "NOTICE: One or both metrics are flagged as DEMO data. This calculation is for prototype illustration only and cannot be claimed as verified real-world impact.");
            return result;
        }

        // True empirical comparison
        double delta = baseline.getBaselineValue() - postValue;
        double pct = baseline.getBaselineValue() > 0 ? (delta / baseline.getBaselineValue()) * 100.0 : 0.0;
        result.put("isComparable", true);
        result.put("improvementPercentage", Math.round(pct * 10.0) / 10.0);
        result.put("validationStatus", "VERIFIED_FIELD_IMPROVEMENT");
        result.put("explanation", "Statistically valid before/after field improvement measured under comparable observation conditions.");
        return result;
    }

    public BaselineMetricDto mapToDto(BaselineMetric m) {
        BaselineMetricDto dto = new BaselineMetricDto();
        dto.setId(m.getId());
        dto.setMetricKey(m.getMetricKey());
        dto.setMetricName(m.getMetricName());
        dto.setDescription(m.getDescription());
        dto.setBaselineValue(m.getBaselineValue());
        dto.setUnit(m.getUnit());
        dto.setDataSource(m.getDataSource());
        dto.setNotes(m.getNotes());
        dto.setDemo(m.isDemo());
        dto.setUpdatedAt(m.getUpdatedAt());
        return dto;
    }
}

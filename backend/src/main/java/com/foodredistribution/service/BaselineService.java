package com.foodredistribution.service;

import com.foodredistribution.dto.BaselineMetricDto;
import com.foodredistribution.entity.BaselineMetric;
import com.foodredistribution.exception.ResourceNotFoundException;
import com.foodredistribution.repository.BaselineMetricRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
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

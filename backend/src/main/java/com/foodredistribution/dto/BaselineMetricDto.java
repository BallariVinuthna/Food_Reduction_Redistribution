package com.foodredistribution.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

public class BaselineMetricDto {
    private UUID id;

    @NotBlank(message = "Metric key is required")
    private String metricKey;

    @NotBlank(message = "Metric name is required")
    private String metricName;

    private String description;

    @NotNull(message = "Baseline value is required")
    private Double baselineValue;

    @NotBlank(message = "Unit is required")
    private String unit;

    private String dataSource;
    private String notes;
    private boolean isDemo;
    private LocalDateTime updatedAt;

    public BaselineMetricDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getMetricKey() { return metricKey; }
    public void setMetricKey(String metricKey) { this.metricKey = metricKey; }

    public String getMetricName() { return metricName; }
    public void setMetricName(String metricName) { this.metricName = metricName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getBaselineValue() { return baselineValue; }
    public void setBaselineValue(Double baselineValue) { this.baselineValue = baselineValue; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getDataSource() { return dataSource; }
    public void setDataSource(String dataSource) { this.dataSource = dataSource; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public boolean isDemo() { return isDemo; }
    public void setDemo(boolean demo) { isDemo = demo; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

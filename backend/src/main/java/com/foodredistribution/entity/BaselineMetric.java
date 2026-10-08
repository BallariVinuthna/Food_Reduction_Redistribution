package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "baseline_metrics")
public class BaselineMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String metricKey;

    @Column(nullable = false)
    private String metricName;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private Double baselineValue;

    @Column(nullable = false)
    private String unit;

    private String dataSource;
    private String notes;

    @Column(nullable = false)
    private boolean isDemo = true;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public BaselineMetric() {}

    public BaselineMetric(String metricKey, String metricName, String description, Double baselineValue, String unit, String dataSource, String notes, boolean isDemo) {
        this.metricKey = metricKey;
        this.metricName = metricName;
        this.description = description;
        this.baselineValue = baselineValue;
        this.unit = unit;
        this.dataSource = dataSource;
        this.notes = notes;
        this.isDemo = isDemo;
        this.updatedAt = LocalDateTime.now();
    }

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

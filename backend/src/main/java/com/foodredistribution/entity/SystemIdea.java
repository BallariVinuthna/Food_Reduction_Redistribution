package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "system_ideas")
public class SystemIdea {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private Integer ideaNumber;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String problemSolved;

    @Column(nullable = false)
    private String engineeringDomains; // e.g. CSE + Data Science

    @Column(nullable = false)
    private Double impactScore; // 1 to 10

    @Column(nullable = false)
    private Double feasibilityScore; // 1 to 10

    @Column(nullable = false)
    private String status; // SELECTED, FUTURE_EXTENSION, SUPPORTING_FEATURE

    @Column(length = 1000)
    private String notes;

    public SystemIdea() {}

    public SystemIdea(Integer ideaNumber, String title, String problemSolved, String engineeringDomains, Double impactScore, Double feasibilityScore, String status, String notes) {
        this.ideaNumber = ideaNumber;
        this.title = title;
        this.problemSolved = problemSolved;
        this.engineeringDomains = engineeringDomains;
        this.impactScore = impactScore;
        this.feasibilityScore = feasibilityScore;
        this.status = status;
        this.notes = notes;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Integer getIdeaNumber() { return ideaNumber; }
    public void setIdeaNumber(Integer ideaNumber) { this.ideaNumber = ideaNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getProblemSolved() { return problemSolved; }
    public void setProblemSolved(String problemSolved) { this.problemSolved = problemSolved; }

    public String getEngineeringDomains() { return engineeringDomains; }
    public void setEngineeringDomains(String engineeringDomains) { this.engineeringDomains = engineeringDomains; }

    public Double getImpactScore() { return impactScore; }
    public void setImpactScore(Double impactScore) { this.impactScore = impactScore; }

    public Double getFeasibilityScore() { return feasibilityScore; }
    public void setFeasibilityScore(Double feasibilityScore) { this.feasibilityScore = feasibilityScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

package com.foodredistribution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "matches", indexes = {
    @Index(name = "idx_match_listing", columnList = "food_listing_id"),
    @Index(name = "idx_match_receiver", columnList = "receiver_id"),
    @Index(name = "idx_match_status", columnList = "status")
})
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "food_listing_id", nullable = false)
    private FoodListing foodListing;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id", nullable = false)
    private Receiver receiver;

    @Column(nullable = false)
    private Double matchScore; // 0 to 100

    private Double locationScore;
    private Double quantityScore;
    private Double urgencyScore;
    private Double foodTypeScore;
    private Double capacityScore;
    private Double reliabilityScore;
    private Double distanceKm;
    private Integer estimatedPickupMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchStatus status = MatchStatus.PROPOSED;

    @Column(name = "proposed_at", nullable = false)
    private LocalDateTime proposedAt = LocalDateTime.now();

    private LocalDateTime respondedAt;
    private String responseNotes;

    public Match() {}

    public Match(FoodListing foodListing, Receiver receiver, Double matchScore, Double locationScore,
                 Double quantityScore, Double urgencyScore, Double foodTypeScore, Double capacityScore,
                 Double reliabilityScore, Double distanceKm, Integer estimatedPickupMinutes) {
        this.foodListing = foodListing;
        this.receiver = receiver;
        this.matchScore = matchScore;
        this.locationScore = locationScore;
        this.quantityScore = quantityScore;
        this.urgencyScore = urgencyScore;
        this.foodTypeScore = foodTypeScore;
        this.capacityScore = capacityScore;
        this.reliabilityScore = reliabilityScore;
        this.distanceKm = distanceKm;
        this.estimatedPickupMinutes = estimatedPickupMinutes != null ? estimatedPickupMinutes : 20;
        this.status = MatchStatus.PROPOSED;
        this.proposedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public FoodListing getFoodListing() { return foodListing; }
    public void setFoodListing(FoodListing foodListing) { this.foodListing = foodListing; }

    public Receiver getReceiver() { return receiver; }
    public void setReceiver(Receiver receiver) { this.receiver = receiver; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }

    public Double getLocationScore() { return locationScore; }
    public void setLocationScore(Double locationScore) { this.locationScore = locationScore; }

    public Double getQuantityScore() { return quantityScore; }
    public void setQuantityScore(Double quantityScore) { this.quantityScore = quantityScore; }

    public Double getUrgencyScore() { return urgencyScore; }
    public void setUrgencyScore(Double urgencyScore) { this.urgencyScore = urgencyScore; }

    public Double getFoodTypeScore() { return foodTypeScore; }
    public void setFoodTypeScore(Double foodTypeScore) { this.foodTypeScore = foodTypeScore; }

    public Double getCapacityScore() { return capacityScore; }
    public void setCapacityScore(Double capacityScore) { this.capacityScore = capacityScore; }

    public Double getReliabilityScore() { return reliabilityScore; }
    public void setReliabilityScore(Double reliabilityScore) { this.reliabilityScore = reliabilityScore; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getEstimatedPickupMinutes() { return estimatedPickupMinutes; }
    public void setEstimatedPickupMinutes(Integer estimatedPickupMinutes) { this.estimatedPickupMinutes = estimatedPickupMinutes; }

    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }

    public LocalDateTime getProposedAt() { return proposedAt; }
    public void setProposedAt(LocalDateTime proposedAt) { this.proposedAt = proposedAt; }

    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }

    public String getResponseNotes() { return responseNotes; }
    public void setResponseNotes(String responseNotes) { this.responseNotes = responseNotes; }
}

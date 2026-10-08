package com.foodredistribution.matching;

import com.foodredistribution.entity.*;
import com.foodredistribution.repository.AdminConfigRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Component
public class MatchingEngine {

    private final AdminConfigRepository adminConfigRepository;

    public MatchingEngine(AdminConfigRepository adminConfigRepository) {
        this.adminConfigRepository = adminConfigRepository;
    }

    public static class MatchCandidate {
        private final Receiver receiver;
        private final double totalScore;
        private final double locationScore;
        private final double quantityScore;
        private final double urgencyScore;
        private final double foodTypeScore;
        private final double capacityScore;
        private final double reliabilityScore;
        private final double distanceKm;
        private final int estimatedPickupMinutes;

        public MatchCandidate(Receiver receiver, double totalScore, double locationScore, double quantityScore,
                              double urgencyScore, double foodTypeScore, double capacityScore, double reliabilityScore,
                              double distanceKm, int estimatedPickupMinutes) {
            this.receiver = receiver;
            this.totalScore = totalScore;
            this.locationScore = locationScore;
            this.quantityScore = quantityScore;
            this.urgencyScore = urgencyScore;
            this.foodTypeScore = foodTypeScore;
            this.capacityScore = capacityScore;
            this.reliabilityScore = reliabilityScore;
            this.distanceKm = distanceKm;
            this.estimatedPickupMinutes = estimatedPickupMinutes;
        }

        public Receiver getReceiver() { return receiver; }
        public double getTotalScore() { return totalScore; }
        public double getLocationScore() { return locationScore; }
        public double getQuantityScore() { return quantityScore; }
        public double getUrgencyScore() { return urgencyScore; }
        public double getFoodTypeScore() { return foodTypeScore; }
        public double getCapacityScore() { return capacityScore; }
        public double getReliabilityScore() { return reliabilityScore; }
        public double getDistanceKm() { return distanceKm; }
        public int getEstimatedPickupMinutes() { return estimatedPickupMinutes; }
    }

    public List<MatchCandidate> findRankedMatches(FoodListing listing, List<Receiver> potentialReceivers) {
        AdminConfig config = adminConfigRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseGet(this::getDefaultConfig);

        double wDist = config.getWeightDistance();
        double wQty = config.getWeightQuantity();
        double wUrg = config.getWeightUrgency();
        double wType = config.getWeightFoodType();
        double wCap = config.getWeightCapacity();
        double wAvail = config.getWeightAvailability();
        double maxRadiusKm = config.getMaxSearchRadiusKm();

        List<MatchCandidate> candidates = new ArrayList<>();

        for (Receiver receiver : potentialReceivers) {
            if (!receiver.isAvailable()) {
                continue;
            }

            // Food Type Compatibility
            double foodTypeScore = 100.0;
            if (!listing.isVegetarian() && "VEG_ONLY".equalsIgnoreCase(receiver.getDietaryPreference())) {
                foodTypeScore = 0.0; // Incompatible
            }

            // Skip completely incompatible
            if (foodTypeScore == 0.0) {
                continue;
            }

            // Distance calculation using Haversine
            double distanceKm = calculateHaversineDistance(
                    listing.getLatitude(), listing.getLongitude(),
                    receiver.getLatitude(), receiver.getLongitude()
            );

            if (distanceKm > maxRadiusKm) {
                continue; // Outside search boundary
            }

            // Location Suitability (closer = higher score)
            double locationScore = Math.max(0.0, 100.0 * (1.0 - (distanceKm / maxRadiusKm)));

            // Quantity & Capacity Fit
            double quantity = listing.getQuantity();
            double capacity = receiver.getCapacityMeals();
            double quantityScore;
            double capacityScore;

            if (capacity >= quantity) {
                // Perfect capacity fit
                quantityScore = 100.0;
                // Capacity score: higher if capacity is close to avoid wasting a 500-meal capacity on a 10-meal donation
                double ratio = quantity / capacity;
                capacityScore = Math.min(100.0, 70.0 + (ratio * 30.0));
            } else {
                // Partial capacity
                quantityScore = Math.max(30.0, (capacity / quantity) * 80.0);
                capacityScore = 50.0;
            }

            // Urgency Suitability
            double urgencyScore = calculateUrgencyScore(listing, distanceKm);

            // Reliability Score
            double reliabilityScore = receiver.getReliabilityScore() != null ? receiver.getReliabilityScore() : 95.0;

            // Weighted Total Score
            double totalScore = (wDist * locationScore)
                    + (wQty * quantityScore)
                    + (wUrg * urgencyScore)
                    + (wType * foodTypeScore)
                    + (wCap * capacityScore)
                    + (wAvail * reliabilityScore);

            totalScore = Math.round(Math.min(100.0, Math.max(0.0, totalScore)) * 10.0) / 10.0;

            // Estimated pickup travel time (approx 3-4 mins per km in Hyderabad + 10 mins buffer)
            int estimatedMinutes = (int) Math.round(distanceKm * 3.5 + 8.0);

            candidates.add(new MatchCandidate(
                    receiver,
                    totalScore,
                    Math.round(locationScore * 10.0) / 10.0,
                    Math.round(quantityScore * 10.0) / 10.0,
                    Math.round(urgencyScore * 10.0) / 10.0,
                    Math.round(foodTypeScore * 10.0) / 10.0,
                    Math.round(capacityScore * 10.0) / 10.0,
                    Math.round(reliabilityScore * 10.0) / 10.0,
                    Math.round(distanceKm * 10.0) / 10.0,
                    estimatedMinutes
            ));
        }

        // Rank by highest total match score descending
        candidates.sort(Comparator.comparingDouble(MatchCandidate::getTotalScore).reversed());
        return candidates;
    }

    private double calculateUrgencyScore(FoodListing listing, double distanceKm) {
        long minutesRemaining = 120;
        if (listing.getAvailableUntil() != null) {
            minutesRemaining = ChronoUnit.MINUTES.between(LocalDateTime.now(), listing.getAvailableUntil());
        }

        if (minutesRemaining <= 60) {
            // Critical: heavily favor close receivers that can collect quickly
            return Math.max(50.0, 100.0 - (distanceKm * 4.0));
        } else if (minutesRemaining <= 120) {
            return 85.0;
        } else if (minutesRemaining <= 240) {
            return 70.0;
        } else {
            return 60.0;
        }
    }

    public static double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in KM
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private AdminConfig getDefaultConfig() {
        AdminConfig config = new AdminConfig();
        config.setWeightDistance(0.30);
        config.setWeightQuantity(0.20);
        config.setWeightUrgency(0.20);
        config.setWeightFoodType(0.15);
        config.setWeightCapacity(0.10);
        config.setWeightAvailability(0.05);
        config.setMaxSearchRadiusKm(25.0);
        return config;
    }
}

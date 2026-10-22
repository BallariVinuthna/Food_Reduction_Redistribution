package com.foodredistribution.service;

import com.foodredistribution.entity.FoodListing;
import com.foodredistribution.entity.Receiver;
import com.foodredistribution.repository.FoodListingRepository;
import com.foodredistribution.repository.ReceiverRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class RescuePriorityService {

    private final FoodListingRepository foodListingRepository;
    private final ReceiverRepository receiverRepository;

    public RescuePriorityService(FoodListingRepository foodListingRepository, ReceiverRepository receiverRepository) {
        this.foodListingRepository = foodListingRepository;
        this.receiverRepository = receiverRepository;
    }

    /**
     * Compute multi-criteria Food Rescue Priority Score for active listings.
     * Evaluates 6 dimensions and compares against Nearest-Neighbor baseline.
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> computeRescuePriorityRankings() {
        LocalDateTime now = LocalDateTime.now();
        List<FoodListing> listings = foodListingRepository.findActiveSurplus(now);
        List<Receiver> receivers = receiverRepository.findByIsAvailableTrue();

        List<Map<String, Object>> rankedList = new ArrayList<>();

        for (FoodListing l : listings) {
            // Urgency decay calculation
            long minutesRemaining = l.getAvailableUntil() != null
                    ? Math.max(0, Duration.between(now, l.getAvailableUntil()).toMinutes())
                    : 120;

            double urgencyScore = calculateUrgencyScore(minutesRemaining);

            // Find best matching receiver and compute components
            double bestMcdaScore = 0.0;
            double bestDistanceKm = 999.0;
            String matchedReceiverName = "General Redistribution Pool";
            Map<String, Double> bestBreakdown = new HashMap<>();

            for (Receiver r : receivers) {
                double dist = haversine(l.getLatitude(), l.getLongitude(), r.getLatitude(), r.getLongitude());
                double distanceScore = Math.max(0.0, 100.0 - (dist * 4.0)); // 100 at 0km, 0 at 25km

                double capacityScore = Math.min(100.0, ((double) r.getCapacityMeals() / Math.max(1.0, l.getQuantity())) * 100.0);
                double foodTypeScore = (r.getDietaryPreference().equalsIgnoreCase("ANY") ||
                        (r.getDietaryPreference().equalsIgnoreCase("VEGETARIAN") && l.isVegetarian())) ? 100.0 : 40.0;
                double reliabilityScore = r.getReliabilityScore() != null ? r.getReliabilityScore() : 95.0;
                double quantityScore = Math.min(100.0, (l.getQuantity() / 50.0) * 100.0);

                // 6-Factor Weighted MCDA Score
                double compositeScore = (distanceScore * 0.30)
                        + (urgencyScore * 0.20)
                        + (quantityScore * 0.20)
                        + (foodTypeScore * 0.15)
                        + (capacityScore * 0.10)
                        + (reliabilityScore * 0.05);

                if (compositeScore > bestMcdaScore) {
                    bestMcdaScore = compositeScore;
                    bestDistanceKm = dist;
                    matchedReceiverName = r.getOrganizationName();
                    bestBreakdown.put("distanceScore", Math.round(distanceScore * 10.0) / 10.0);
                    bestBreakdown.put("urgencyScore", Math.round(urgencyScore * 10.0) / 10.0);
                    bestBreakdown.put("quantityScore", Math.round(quantityScore * 10.0) / 10.0);
                    bestBreakdown.put("foodTypeScore", Math.round(foodTypeScore * 10.0) / 10.0);
                    bestBreakdown.put("capacityScore", Math.round(capacityScore * 10.0) / 10.0);
                    bestBreakdown.put("reliabilityScore", Math.round(reliabilityScore * 10.0) / 10.0);
                }
            }

            // Baseline: Pure Nearest-Neighbor Score
            double baselineNearestScore = Math.max(0.0, 100.0 - (bestDistanceKm * 4.0));

            Map<String, Object> item = new HashMap<>();
            item.put("listingId", l.getId());
            item.put("foodName", l.getFoodName());
            item.put("providerName", l.getProvider() != null ? l.getProvider().getOrganizationName() : "Donor");
            item.put("quantity", (l.getRemainingQuantity() != null ? l.getRemainingQuantity() : l.getQuantity()) + " " + l.getUnit());
            item.put("minutesRemaining", minutesRemaining);
            item.put("urgencyLevel", minutesRemaining <= 60 ? "CRITICAL" : (minutesRemaining <= 120 ? "HIGH" : "MEDIUM"));
            item.put("mcdaPriorityScore", Math.round(bestMcdaScore * 10.0) / 10.0);
            item.put("baselineNearestScore", Math.round(baselineNearestScore * 10.0) / 10.0);
            item.put("matchedReceiverName", matchedReceiverName);
            item.put("distanceKm", Math.round(bestDistanceKm * 10.0) / 10.0);
            item.put("scoreBreakdown", bestBreakdown);
            item.put("priorityRankingTier", bestMcdaScore >= 85.0 ? "TIER_1_IMMEDIATE" : (bestMcdaScore >= 70.0 ? "TIER_2_HIGH" : "TIER_3_NORMAL"));

            rankedList.add(item);
        }

        // Sort descending by MCDA Priority Score
        rankedList.sort((a, b) -> Double.compare((Double) b.get("mcdaPriorityScore"), (Double) a.get("mcdaPriorityScore")));

        return rankedList;
    }

    private double calculateUrgencyScore(long minutesRemaining) {
        if (minutesRemaining <= 30) return 100.0;
        if (minutesRemaining <= 60) return 90.0;
        if (minutesRemaining <= 120) return 75.0;
        if (minutesRemaining <= 240) return 50.0;
        return 30.0;
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}

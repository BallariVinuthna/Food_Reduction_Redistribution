package com.foodredistribution.service;

import com.foodredistribution.entity.FoodListing;
import com.foodredistribution.entity.FoodStatus;
import com.foodredistribution.repository.FoodListingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class SmartUrgencyAlertService {

    private static final Logger logger = LoggerFactory.getLogger(SmartUrgencyAlertService.class);

    private final FoodListingRepository foodListingRepository;
    private final NotificationService notificationService;
    private final LiveDemoSimulatorService liveDemoSimulatorService;

    public SmartUrgencyAlertService(FoodListingRepository foodListingRepository,
                                    NotificationService notificationService,
                                    LiveDemoSimulatorService liveDemoSimulatorService) {
        this.foodListingRepository = foodListingRepository;
        this.notificationService = notificationService;
        this.liveDemoSimulatorService = liveDemoSimulatorService;
    }

    /**
     * Evaluate listings and generate urgency alert items with deadline countdowns.
     */
    @Transactional
    public List<Map<String, Object>> evaluateActiveUrgencyAlerts() {
        LocalDateTime now = LocalDateTime.now();
        List<FoodListing> listings = foodListingRepository.findActiveSurplus(now);
        if (listings.size() < 3) {
            try {
                liveDemoSimulatorService.ensureVibrantDemoData();
                listings = foodListingRepository.findActiveSurplus(now);
            } catch (Exception ignored) {}
        }
        List<Map<String, Object>> alerts = new ArrayList<>();

        for (FoodListing l : listings) {
            long minutesRemaining = l.getAvailableUntil() != null
                    ? Math.max(0, Duration.between(now, l.getAvailableUntil()).toMinutes())
                    : 120;

            if (minutesRemaining <= 0) {
                // Expire listing safely
                l.setStatus(FoodStatus.EXPIRED);
                foodListingRepository.save(l);
                continue;
            }

            String urgencyCategory;
            int priorityRank;
            if (minutesRemaining <= 60) {
                urgencyCategory = "CRITICAL_URGENCY";
                priorityRank = 1;
            } else if (minutesRemaining <= 120) {
                urgencyCategory = "HIGH_PRIORITY";
                priorityRank = 2;
            } else {
                urgencyCategory = "STANDARD_WINDOW";
                priorityRank = 3;
            }

            Map<String, Object> alert = new HashMap<>();
            alert.put("listingId", l.getId());
            alert.put("foodName", l.getFoodName());
            alert.put("providerName", l.getProvider() != null ? l.getProvider().getOrganizationName() : "Donor");
            alert.put("quantity", (l.getRemainingQuantity() != null ? l.getRemainingQuantity() : l.getQuantity()) + " " + l.getUnit());
            alert.put("address", l.getAddress());
            alert.put("minutesRemaining", minutesRemaining);
            alert.put("urgencyCategory", urgencyCategory);
            alert.put("priorityRank", priorityRank);
            alert.put("actionRecommendation", minutesRemaining <= 60
                    ? "Dispatch immediate emergency volunteer bike courier"
                    : "Standard match broadcast active");
            alert.put("availableUntil", l.getAvailableUntil());

            alerts.add(alert);
        }

        // Sort by priorityRank (critical first) then minutesRemaining
        alerts.sort(Comparator.comparingInt((Map<String, Object> a) -> (Integer) a.get("priorityRank"))
                .thenComparingLong(a -> (Long) a.get("minutesRemaining")));

        return alerts;
    }
}

package com.foodredistribution.service;

import com.foodredistribution.entity.WasteDiaryEntry;
import com.foodredistribution.repository.WasteDiaryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class WasteDiaryService {

    private static final Logger logger = LoggerFactory.getLogger(WasteDiaryService.class);

    private final WasteDiaryRepository repository;

    public WasteDiaryService(WasteDiaryRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public WasteDiaryEntry logEntry(WasteDiaryEntry entry) {
        if (entry.getProviderId() == null || entry.getProviderId().isBlank()) {
            entry.setProviderId("bc662cbd-805f-457b-af36-24ecb2db34f9");
        }
        if (entry.getProviderName() == null || entry.getProviderName().isBlank()) {
            entry.setProviderName("Cyber Conventions & Marriage Hall");
        }
        if (entry.getFoodItemName() == null && entry.getFoodName() != null) {
            entry.setFoodItemName(entry.getFoodName());
        }
        if (entry.getFoodItemName() == null || entry.getFoodItemName().isBlank()) {
            entry.setFoodItemName("Rice & Curry Residuals");
        }
        if (entry.getFoodCategory() == null || entry.getFoodCategory().isBlank()) {
            entry.setFoodCategory("COOKED_MEALS");
        }
        if (entry.getWasteReason() == null || entry.getWasteReason().isBlank()) {
            entry.setWasteReason("OVER_PREPARATION");
        }
        if (entry.getMealPeriod() == null || entry.getMealPeriod().isBlank()) {
            entry.setMealPeriod("DINNER");
        }
        if (entry.getUnit() == null || entry.getUnit().isBlank()) {
            entry.setUnit("KG");
        }

        // Handle quantity aliases
        if (entry.getQuantityDiscarded() == null) {
            if (entry.getQuantityLostKg() != null) {
                entry.setQuantityDiscarded(entry.getQuantityLostKg());
            } else {
                entry.setQuantityDiscarded(12.5);
            }
        }
        if (entry.getQuantityPrepared() == null) {
            entry.setQuantityPrepared(Math.round(entry.getQuantityDiscarded() * 2.5 * 10.0) / 10.0);
        }
        if (entry.getQuantitySoldOrConsumed() == null) {
            entry.setQuantitySoldOrConsumed(Math.max(0.0, entry.getQuantityPrepared() - entry.getQuantityDiscarded()));
        }
        if (entry.getQuantityDonated() == null) {
            entry.setQuantityDonated(0.0);
        }
        if (entry.getQuantityReusedSafely() == null) {
            entry.setQuantityReusedSafely(0.0);
        }
        if (entry.getEstimatedCostInr() == null) {
            entry.setEstimatedCostInr((double) Math.round(entry.getQuantityDiscarded() * 52.0));
        }

        // Actionable recommendation based on waste reason
        if (entry.getWasteReason() != null) {
            switch (entry.getWasteReason().toUpperCase()) {
                case "OVER_PREPARATION":
                    entry.setPreventiveActionRecommendation("Implement SurplusFlow moving average batch forecast. Cook in 2 distinct batches (12:00 PM and 1:30 PM).");
                    break;
                case "BUFFET_RESIDUAL":
                    entry.setPreventiveActionRecommendation("Use smaller display serving chaffing dishes during the last 45 minutes of banquet service.");
                    break;
                case "WEATHER_RAIN":
                    entry.setPreventiveActionRecommendation("Integrate monsoon seasonal attendance factor (-18% prep discount during heavy showers).");
                    break;
                case "SPOILAGE":
                    entry.setPreventiveActionRecommendation("Inspect refrigerator thermostat calibrations. Maintain walk-in cold rooms under 4°C.");
                    break;
                default:
                    entry.setPreventiveActionRecommendation("Record standard batch yield audits and verify holding containers.");
                    break;
            }
        }

        return repository.save(entry);
    }

    @Transactional(readOnly = true)
    public List<WasteDiaryEntry> getProviderEntries(String providerId) {
        if (providerId == null || providerId.isBlank() || "default-provider".equalsIgnoreCase(providerId)) {
            List<WasteDiaryEntry> all = repository.findAllByOrderByEntryDateDesc();
            if (!all.isEmpty()) {
                return all;
            }
            return seedDemoDiaryEntries(providerId != null ? providerId : "default-provider");
        }

        List<WasteDiaryEntry> list = repository.findByProviderIdOrderByEntryDateDesc(providerId);
        if (list.isEmpty()) {
            List<WasteDiaryEntry> all = repository.findAllByOrderByEntryDateDesc();
            if (!all.isEmpty()) {
                return all;
            }
            return seedDemoDiaryEntries(providerId);
        }
        return list;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getWasteSummary(String providerId, LocalDate startDate, LocalDate endDate) {
        List<WasteDiaryEntry> entries = getProviderEntries(providerId);

        double totalPrep = 0;
        double totalSold = 0;
        double totalDonated = 0;
        double totalDiscarded = 0;
        double totalEconomicLoss = 0;
        Map<String, Double> byReason = new HashMap<>();
        Map<String, Double> byCategory = new HashMap<>();

        for (WasteDiaryEntry e : entries) {
            double prep = e.getQuantityPrepared() != null ? e.getQuantityPrepared() : 0.0;
            double sold = e.getQuantitySoldOrConsumed() != null ? e.getQuantitySoldOrConsumed() : 0.0;
            double don = e.getQuantityDonated() != null ? e.getQuantityDonated() : 0.0;
            double disc = e.getQuantityDiscarded() != null ? e.getQuantityDiscarded() : 0.0;
            double loss = e.getEstimatedCostInr() != null ? e.getEstimatedCostInr() : Math.round(disc * 52.0);

            totalPrep += prep;
            totalSold += sold;
            totalDonated += don;
            totalDiscarded += disc;
            totalEconomicLoss += loss;

            if (e.getWasteReason() != null) {
                byReason.put(e.getWasteReason(), byReason.getOrDefault(e.getWasteReason(), 0.0) + disc);
            }
            if (e.getFoodCategory() != null) {
                byCategory.put(e.getFoodCategory(), byCategory.getOrDefault(e.getFoodCategory(), 0.0) + disc);
            }
        }

        double wasteRatePct = totalPrep > 0 ? Math.round((totalDiscarded / totalPrep) * 1000.0) / 10.0 : 0.0;
        double redistributionRatePct = totalPrep > 0 ? Math.round((totalDonated / totalPrep) * 1000.0) / 10.0 : 0.0;

        Map<String, Object> summary = new HashMap<>();
        // Frontend expected fields
        summary.put("totalWasteRecordedKg", Math.round(totalDiscarded * 10.0) / 10.0);
        summary.put("totalEconomicLossInr", Math.round(totalEconomicLoss));
        summary.put("entryCount", entries.size());
        summary.put("totalPrepared", totalPrep);
        summary.put("totalSold", totalSold);
        summary.put("totalDonated", totalDonated);
        summary.put("totalDiscarded", totalDiscarded);
        summary.put("wasteRatePercentage", wasteRatePct);
        summary.put("redistributionRatePercentage", redistributionRatePct);
        summary.put("wasteByReason", byReason);
        summary.put("wasteByCategory", byCategory);
        summary.put("entries", entries);

        return summary;
    }

    public byte[] exportCsv(String providerId) {
        List<WasteDiaryEntry> entries = getProviderEntries(providerId);
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Date,Provider,Food Item,Category,Prepared,Sold,Donated,Discarded,Unit,Reason,Meal Period,Measured,Recommendation\n");

        for (WasteDiaryEntry e : entries) {
            sb.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.1f,%.1f,%.1f,%.1f,\"%s\",\"%s\",\"%s\",%b,\"%s\"\n",
                    e.getId(), e.getEntryDate(), e.getProviderName(), e.getFoodItemName(), e.getFoodCategory(),
                    e.getQuantityPrepared(), e.getQuantitySoldOrConsumed(), e.getQuantityDonated(), e.getQuantityDiscarded(),
                    e.getUnit(), e.getWasteReason(), e.getMealPeriod(), e.getIsMeasured(),
                    e.getPreventiveActionRecommendation() != null ? e.getPreventiveActionRecommendation().replace("\"", "'") : ""));
        }
        return sb.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    private List<WasteDiaryEntry> seedDemoDiaryEntries(String providerId) {
        List<WasteDiaryEntry> seeds = new ArrayList<>();
        LocalDate today = LocalDate.now();

        seeds.add(new WasteDiaryEntry(
                providerId, "Taj Banjara Grand Hotel", "Steamed Basmati Rice & Dal", "COOKED_MEALS",
                80.0, 60.0, 15.0, 0.0, 5.0, "MEALS", "BUFFET_RESIDUAL", "LUNCH", today.minusDays(1), true
        ));
        seeds.add(new WasteDiaryEntry(
                providerId, "Taj Banjara Grand Hotel", "Tandoori Naan & Roti Breads", "BAKERY_BREAD",
                60.0, 45.0, 10.0, 0.0, 5.0, "SERVINGS", "OVER_PREPARATION", "DINNER", today.minusDays(2), true
        ));
        seeds.add(new WasteDiaryEntry(
                providerId, "Taj Banjara Grand Hotel", "Paneer Butter Masala", "COOKED_MEALS",
                50.0, 42.0, 8.0, 0.0, 0.0, "SERVINGS", "BUFFET_RESIDUAL", "LUNCH", today.minusDays(3), true
        ));
        seeds.add(new WasteDiaryEntry(
                providerId, "Taj Banjara Grand Hotel", "Fresh Cut Fruit Platter", "FRESH_PRODUCE",
                30.0, 20.0, 5.0, 0.0, 5.0, "SERVINGS", "SPOILAGE", "BREAKFAST", today.minusDays(4), true
        ));

        for (WasteDiaryEntry s : seeds) {
            logEntry(s);
        }
        return seeds;
    }
}

package com.foodredistribution.service;

import com.foodredistribution.dto.DashboardAnalyticsDto;
import com.foodredistribution.entity.*;
import com.foodredistribution.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.StringWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final FoodListingRepository foodListingRepository;
    private final MatchRepository matchRepository;
    private final PickupAssignmentRepository pickupAssignmentRepository;
    private final DonationTransactionRepository donationTransactionRepository;
    private final FieldWasteRecordRepository fieldWasteRecordRepository;
    private final FoodProviderRepository foodProviderRepository;
    private final ReceiverRepository receiverRepository;
    private final VolunteerRepository volunteerRepository;
    private final ImpactMetricRepository impactMetricRepository;

    public AnalyticsService(FoodListingRepository foodListingRepository,
                            MatchRepository matchRepository,
                            PickupAssignmentRepository pickupAssignmentRepository,
                            DonationTransactionRepository donationTransactionRepository,
                            FieldWasteRecordRepository fieldWasteRecordRepository,
                            FoodProviderRepository foodProviderRepository,
                            ReceiverRepository receiverRepository,
                            VolunteerRepository volunteerRepository,
                            ImpactMetricRepository impactMetricRepository) {
        this.foodListingRepository = foodListingRepository;
        this.matchRepository = matchRepository;
        this.pickupAssignmentRepository = pickupAssignmentRepository;
        this.donationTransactionRepository = donationTransactionRepository;
        this.fieldWasteRecordRepository = fieldWasteRecordRepository;
        this.foodProviderRepository = foodProviderRepository;
        this.receiverRepository = receiverRepository;
        this.volunteerRepository = volunteerRepository;
        this.impactMetricRepository = impactMetricRepository;
    }

    public DashboardAnalyticsDto getDashboardAnalytics() {
        return getDashboardAnalytics(null, null, null, null);
    }

    public DashboardAnalyticsDto getDashboardAnalytics(LocalDateTime startDate, LocalDateTime endDate,
                                                         String locality, String category) {
        DashboardAnalyticsDto dto = new DashboardAnalyticsDto();
        dto.setFilterStartDate(startDate);
        dto.setFilterEndDate(endDate);
        dto.setFilterLocality(locality);
        dto.setFilterCategory(category);

        List<FoodListing> allListings = foodListingRepository.findAll();

        // Apply filters in-memory for holistic dataset or via database queries
        List<FoodListing> filtered = allListings.stream()
                .filter(l -> (startDate == null || !l.getCreatedAt().isBefore(startDate)))
                .filter(l -> (endDate == null || !l.getCreatedAt().isAfter(endDate)))
                .filter(l -> (category == null || category.isBlank() || l.getFoodCategory().equalsIgnoreCase(category)))
                .filter(l -> (locality == null || locality.isBlank() || (l.getAddress() != null && l.getAddress().toLowerCase().contains(locality.toLowerCase()))))
                .collect(Collectors.toList());

        long totalListings = filtered.size();
        dto.setTotalListings(totalListings);
        dto.setHasData(totalListings > 0);

        long activeListings = filtered.stream().filter(l -> l.getStatus() == FoodStatus.AVAILABLE).count();
        long reservedListings = filtered.stream().filter(l -> l.getStatus() == FoodStatus.RESERVED || l.getStatus() == FoodStatus.ACCEPTED || l.getStatus() == FoodStatus.PICKUP_ASSIGNED).count();
        long completedRedistributions = filtered.stream().filter(l -> l.getStatus() == FoodStatus.REDISTRIBUTED).count();
        long expiredListings = filtered.stream().filter(l -> l.getStatus() == FoodStatus.EXPIRED).count();
        long cancelledListings = filtered.stream().filter(l -> l.getStatus() == FoodStatus.CANCELLED).count();

        dto.setActiveListings(activeListings);
        dto.setReservedListings(reservedListings);
        dto.setCompletedRedistributions(completedRedistributions);
        dto.setExpiredListings(expiredListings);
        dto.setCancelledListings(cancelledListings);

        double totalQuantityListed = filtered.stream().mapToDouble(FoodListing::getQuantity).sum();
        double totalQuantityRedistributed = filtered.stream()
                .filter(l -> l.getStatus() == FoodStatus.REDISTRIBUTED)
                .mapToDouble(FoodListing::getQuantity).sum();

        dto.setTotalQuantityListedMeals(Math.round(totalQuantityListed * 10.0) / 10.0);
        dto.setTotalQuantityRedistributedMeals(Math.round(totalQuantityRedistributed * 10.0) / 10.0);

        // Actual verified delivered meals from donation transactions
        List<DonationTransaction> transactions = donationTransactionRepository.findAll().stream()
                .filter(t -> (startDate == null || !t.getCreatedAt().isBefore(startDate)))
                .filter(t -> (endDate == null || !t.getCreatedAt().isAfter(endDate)))
                .collect(Collectors.toList());

        double verifiedDelivered = transactions.stream()
                .filter(t -> t.getStatus() == TransactionStatus.DELIVERED && t.getQuantityDelivered() != null)
                .mapToDouble(DonationTransaction::getQuantityDelivered)
                .sum();
        dto.setActualVerifiedDeliveredMeals(Math.round(verifiedDelivered * 10.0) / 10.0);

        // Environmental & monetary benefits explicitly labeled as estimates with transparent assumptions
        double estimatedFoodWasteAvoidedKg = Math.round(totalQuantityRedistributed * 0.40 * 10.0) / 10.0;
        double estimatedValueSavedInr = Math.round(totalQuantityRedistributed * 60.0 * 100.0) / 100.0;
        dto.setEstimatedFoodWasteAvoidedKg(estimatedFoodWasteAvoidedKg);
        dto.setEstimatedValueSavedInr(estimatedValueSavedInr);

        // Empirical field-observed waste records (separate from operational estimates)
        Double fieldWasteTotal = fieldWasteRecordRepository.sumVerifiedWasteQuantityByUnit("KG");
        dto.setFieldObservedWasteKg(fieldWasteTotal != null ? Math.round(fieldWasteTotal * 10.0) / 10.0 : 0.0);
        dto.setFieldAuditRecordsCount(fieldWasteRecordRepository.countByIsDemo(false));

        double redistributionRate = totalQuantityListed > 0
                ? Math.round((totalQuantityRedistributed / totalQuantityListed) * 1000.0) / 10.0
                : 0.0;
        dto.setRedistributionRatePercentage(redistributionRate);

        // Matches and acceptance rates
        long totalMatches = matchRepository.countBetween(startDate, endDate);
        long acceptedMatches = matchRepository.countAcceptedBetween(startDate, endDate);
        double matchSuccessRate = totalMatches > 0
                ? Math.round(((double) acceptedMatches / totalMatches) * 1000.0) / 10.0
                : 0.0;
        dto.setMatchSuccessRatePercentage(matchSuccessRate);

        // Real Average Matching Time from execution logs (no hardcoded fallback)
        Double avgExecutionMs = matchRepository.avgExecutionTimeMsBetween(startDate, endDate);
        if (avgExecutionMs != null && avgExecutionMs > 0) {
            dto.setAverageMatchingTimeSeconds(Math.round((avgExecutionMs / 1000.0) * 1000.0) / 1000.0);
        } else {
            dto.setAverageMatchingTimeSeconds(null); // Display "No data yet"
        }

        // Real Average Listing-to-Acceptance Time
        List<Match> acceptedMatchList = matchRepository.findAll().stream()
                .filter(m -> m.getStatus() == MatchStatus.ACCEPTED && m.getRespondedAt() != null && m.getProposedAt() != null)
                .filter(m -> (startDate == null || !m.getProposedAt().isBefore(startDate)))
                .filter(m -> (endDate == null || !m.getProposedAt().isAfter(endDate)))
                .collect(Collectors.toList());

        if (!acceptedMatchList.isEmpty()) {
            long totalAcceptMinutes = 0;
            for (Match m : acceptedMatchList) {
                totalAcceptMinutes += Math.max(0, ChronoUnit.MINUTES.between(m.getProposedAt(), m.getRespondedAt()));
            }
            dto.setAverageListingToAcceptanceMinutes(Math.round(((double) totalAcceptMinutes / acceptedMatchList.size()) * 10.0) / 10.0);
        } else {
            dto.setAverageListingToAcceptanceMinutes(null);
        }

        // Real Average Pickup & Delivery Times (no fake fallbacks)
        List<PickupAssignment> completedPickups = pickupAssignmentRepository.findCompletedPickupsBetween(startDate, endDate);
        if (!completedPickups.isEmpty()) {
            long totalPickupMinutes = 0;
            long totalDeliveryMinutes = 0;
            int countPickup = 0;
            int countDelivery = 0;

            for (PickupAssignment p : completedPickups) {
                if (p.getAssignedAt() != null && p.getPickedUpAt() != null) {
                    totalPickupMinutes += Math.max(0, ChronoUnit.MINUTES.between(p.getAssignedAt(), p.getPickedUpAt()));
                    countPickup++;
                }
                if (p.getPickedUpAt() != null && p.getDeliveredAt() != null) {
                    totalDeliveryMinutes += Math.max(0, ChronoUnit.MINUTES.between(p.getPickedUpAt(), p.getDeliveredAt()));
                    countDelivery++;
                }
            }
            dto.setAveragePickupTimeMinutes(countPickup > 0 ? Math.round(((double) totalPickupMinutes / countPickup) * 10.0) / 10.0 : null);
            dto.setAverageDeliveryTimeMinutes(countDelivery > 0 ? Math.round(((double) totalDeliveryMinutes / countDelivery) * 10.0) / 10.0 : null);
        } else {
            dto.setAveragePickupTimeMinutes(null);
            dto.setAverageDeliveryTimeMinutes(null);
        }

        // Failed pickups count
        dto.setFailedPickups(pickupAssignmentRepository.countFailedPickupsBetween(startDate, endDate));

        // Data completeness: verified handovers / total completed
        long verifiedCount = transactions.stream().filter(t -> t.isPickupOtpVerified() && t.isDeliveryOtpVerified()).count();
        long completedCount = transactions.stream().filter(t -> t.getStatus() == TransactionStatus.DELIVERED).count();
        double completeness = completedCount > 0 ? Math.round(((double) verifiedCount / completedCount) * 1000.0) / 10.0 : 100.0;
        dto.setDataCompletenessPercentage(completeness);

        dto.setTotalProviders(foodProviderRepository.count());
        dto.setTotalReceivers(receiverRepository.count());
        dto.setTotalVolunteers(volunteerRepository.count());

        // Category breakdown from real records
        Map<String, Long> categoryMap = filtered.stream()
                .collect(Collectors.groupingBy(FoodListing::getFoodCategory, Collectors.counting()));
        dto.setCategoryBreakdown(categoryMap);

        // Status breakdown
        Map<String, Long> statusMap = filtered.stream()
                .collect(Collectors.groupingBy(l -> l.getStatus().name(), Collectors.counting()));
        dto.setStatusBreakdown(statusMap);

        // Urgency breakdown
        Map<String, Long> urgencyMap = filtered.stream()
                .collect(Collectors.groupingBy(l -> l.getUrgencyLevel().name(), Collectors.counting()));
        dto.setUrgencyBreakdown(urgencyMap);

        // Real Trend Data grouped by day
        List<Map<String, Object>> trendData = buildRealTrendData(filtered);
        dto.setTrendData(trendData);

        // Real Location Breakdown grouped by provider locality
        List<Map<String, Object>> locationList = buildRealLocationData(filtered);
        dto.setLocationBreakdown(locationList);

        return dto;
    }

    private List<Map<String, Object>> buildRealTrendData(List<FoodListing> listings) {
        if (listings.isEmpty()) {
            return Collections.emptyList();
        }

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Map<String, List<FoodListing>> byDay = listings.stream()
                .collect(Collectors.groupingBy(l -> l.getCreatedAt().format(dtf), TreeMap::new, Collectors.toList()));

        List<Map<String, Object>> trendList = new ArrayList<>();
        for (Map.Entry<String, List<FoodListing>> entry : byDay.entrySet()) {
            String day = entry.getKey();
            List<FoodListing> dayListings = entry.getValue();

            double listed = dayListings.stream().mapToDouble(FoodListing::getQuantity).sum();
            double redist = dayListings.stream()
                    .filter(l -> l.getStatus() == FoodStatus.REDISTRIBUTED)
                    .mapToDouble(FoodListing::getQuantity).sum();

            Map<String, Object> point = new HashMap<>();
            point.put("day", day);
            point.put("listed", Math.round(listed));
            point.put("redistributed", Math.round(redist));
            point.put("wasteAvoidedKg", Math.round(redist * 0.40 * 10.0) / 10.0);
            trendList.add(point);
        }
        return trendList;
    }

    private List<Map<String, Object>> buildRealLocationData(List<FoodListing> listings) {
        if (listings.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, List<FoodListing>> byLocality = new HashMap<>();
        for (FoodListing l : listings) {
            String loc = extractLocality(l.getAddress());
            byLocality.computeIfAbsent(loc, k -> new ArrayList<>()).add(l);
        }

        List<Map<String, Object>> list = new ArrayList<>();
        for (Map.Entry<String, List<FoodListing>> e : byLocality.entrySet()) {
            double meals = e.getValue().stream().mapToDouble(FoodListing::getQuantity).sum();
            Map<String, Object> m = new HashMap<>();
            m.put("area", e.getKey());
            m.put("meals", Math.round(meals));
            m.put("savedKg", Math.round(meals * 0.40 * 10.0) / 10.0);
            list.add(m);
        }
        list.sort((a, b) -> Double.compare(((Number) b.get("meals")).doubleValue(), ((Number) a.get("meals")).doubleValue()));
        return list;
    }

    private String extractLocality(String address) {
        if (address == null || address.isBlank()) return "Hyderabad General";
        String lower = address.toLowerCase();
        if (lower.contains("banjara hills")) return "Banjara Hills";
        if (lower.contains("hitec city") || lower.contains("madhapur")) return "Hitec City";
        if (lower.contains("gachibowli")) return "Gachibowli";
        if (lower.contains("secunderabad")) return "Secunderabad";
        if (lower.contains("jubilee hills")) return "Jubilee Hills";
        if (lower.contains("begumpet")) return "Begumpet";
        if (lower.contains("ameerpet")) return "Ameerpet";
        if (lower.contains("mehdipatnam")) return "Mehdipatnam";
        if (lower.contains("dilsukhnagar")) return "Dilsukhnagar";
        if (lower.contains("kukatpally")) return "Kukatpally";
        return address.length() > 25 ? address.substring(0, 25) + "..." : address;
    }

    @Transactional
    public void recalculateImpactMetrics() {
        DashboardAnalyticsDto analytics = getDashboardAnalytics();
        ImpactMetric metric = impactMetricRepository.findTopByOrderByTimestampDesc()
                .orElse(new ImpactMetric());

        metric.setTotalListings(analytics.getTotalListings());
        metric.setTotalQuantityListed(analytics.getTotalQuantityListedMeals());
        metric.setTotalQuantityRedistributed(analytics.getTotalQuantityRedistributedMeals());
        metric.setFoodWasteAvoidedKg(analytics.getEstimatedFoodWasteAvoidedKg());
        metric.setEstimatedValueSavedInr(analytics.getEstimatedValueSavedInr());
        metric.setRedistributionRate(analytics.getRedistributionRatePercentage());
        metric.setMatchSuccessRate(analytics.getMatchSuccessRatePercentage());
        metric.setAvgMatchingTimeSeconds(analytics.getAverageMatchingTimeSeconds() != null ? analytics.getAverageMatchingTimeSeconds() : 0.0);
        metric.setAvgPickupTimeMinutes(analytics.getAveragePickupTimeMinutes() != null ? analytics.getAveragePickupTimeMinutes() : 0.0);
        metric.setTimestamp(LocalDateTime.now());

        impactMetricRepository.save(metric);
    }

    // CSV Export for Analytics Summary
    public String exportAnalyticsSummaryCsv(LocalDateTime startDate, LocalDateTime endDate) {
        DashboardAnalyticsDto data = getDashboardAnalytics(startDate, endDate, null, null);
        StringWriter sw = new StringWriter();
        sw.write("Metric,Value,Unit,Measurement Type,Definition / Formula\n");
        sw.write(String.format("Total Listings,%d,listings,Operational Record,Total food surplus batches recorded\n", data.getTotalListings()));
        sw.write(String.format("Active Listings,%d,listings,Operational Record,Currently available surplus batches\n", data.getActiveListings()));
        sw.write(String.format("Completed Redistributions,%d,listings,Operational Record,Successfully delivered batches\n", data.getCompletedRedistributions()));
        sw.write(String.format("Expired Listings,%d,listings,Operational Record,Surplus expired before collection\n", data.getExpiredListings()));
        sw.write(String.format("Total Quantity Listed,%.1f,meals,Operational Record,Total meal servings published\n", data.getTotalQuantityListedMeals()));
        sw.write(String.format("Total Quantity Redistributed,%.1f,meals,Operational Record,Total meal servings safely delivered\n", data.getTotalQuantityRedistributedMeals()));
        sw.write(String.format("Verified Delivered Meals,%.1f,meals,Verified Audit,Transactions with confirmed OTP handover\n", data.getActualVerifiedDeliveredMeals()));
        sw.write(String.format("Estimated Food Waste Avoided,%.1f,kg,Estimated Index,%s\n", data.getEstimatedFoodWasteAvoidedKg(), data.getEnvironmentalFormulaExplanation()));
        sw.write(String.format("Estimated Economic Value Saved,%.2f,INR,Estimated Index,%s\n", data.getEstimatedValueSavedInr(), data.getMonetaryFormulaExplanation()));
        sw.write(String.format("Field-Observed Waste Logged,%.1f,kg,Field Audit,Empirical waste recorded by certified auditors\n", data.getFieldObservedWasteKg()));
        sw.write(String.format("Redistribution Rate,%.1f,%%,Ratio,Redistributed Quantity / Listed Quantity\n", data.getRedistributionRatePercentage()));
        sw.write(String.format("Match Success Rate,%.1f,%%,Ratio,Accepted Matches / Total Proposals\n", data.getMatchSuccessRatePercentage()));
        sw.write(String.format("Avg Matching Latency,%s,seconds,Operational Measurement,Database match engine execution time\n", data.getAverageMatchingTimeSeconds() != null ? data.getAverageMatchingTimeSeconds().toString() : "No data yet"));
        sw.write(String.format("Avg Listing to Acceptance,%s,minutes,Operational Measurement,Time from surplus post to receiver accept\n", data.getAverageListingToAcceptanceMinutes() != null ? data.getAverageListingToAcceptanceMinutes().toString() : "No data yet"));
        sw.write(String.format("Avg Pickup Transit Time,%s,minutes,Operational Measurement,Transit time from assignment to collection\n", data.getAveragePickupTimeMinutes() != null ? data.getAveragePickupTimeMinutes().toString() : "No data yet"));
        sw.write(String.format("Avg Delivery Time,%s,minutes,Operational Measurement,Transit time from collection to delivery\n", data.getAverageDeliveryTimeMinutes() != null ? data.getAverageDeliveryTimeMinutes().toString() : "No data yet"));
        sw.write(String.format("Data Completeness,%.1f,%%,Quality Metric,Completed deliveries with double OTP verification\n", data.getDataCompletenessPercentage()));
        return sw.toString();
    }

    // CSV Export for Transactions
    public String exportTransactionsCsv(LocalDateTime startDate, LocalDateTime endDate) {
        List<DonationTransaction> list = donationTransactionRepository.findAll().stream()
                .filter(t -> (startDate == null || !t.getCreatedAt().isBefore(startDate)))
                .filter(t -> (endDate == null || !t.getCreatedAt().isAfter(endDate)))
                .sorted(Comparator.comparing(DonationTransaction::getCreatedAt).reversed())
                .collect(Collectors.toList());

        StringWriter sw = new StringWriter();
        sw.write("Transaction ID,Food Name,Provider,Receiver,Volunteer,Quantity Listed,Quantity Reserved,Quantity Delivered,Unit,Status,Verification Status,Pickup OTP Verified,Delivery OTP Verified,Reserved At,Delivered At\n");
        for (DonationTransaction t : list) {
            sw.write(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.1f,%.1f,%s,\"%s\",\"%s\",\"%s\",%b,%b,\"%s\",\"%s\"\n",
                    t.getId(),
                    t.getFoodListing() != null ? t.getFoodListing().getFoodName().replace("\"", "'") : "N/A",
                    t.getProvider() != null ? t.getProvider().getOrganizationName().replace("\"", "'") : "N/A",
                    t.getReceiver() != null ? t.getReceiver().getOrganizationName().replace("\"", "'") : "N/A",
                    t.getVolunteer() != null ? t.getVolunteer().getFullName().replace("\"", "'") : "Unassigned",
                    t.getQuantityListed() != null ? t.getQuantityListed() : 0.0,
                    t.getQuantityReserved() != null ? t.getQuantityReserved() : 0.0,
                    t.getQuantityDelivered() != null ? t.getQuantityDelivered().toString() : "0.0",
                    t.getUnit(),
                    t.getStatus(),
                    t.getVerificationStatus(),
                    t.isPickupOtpVerified(),
                    t.isDeliveryOtpVerified(),
                    t.getReservedAt() != null ? t.getReservedAt().toString() : "",
                    t.getDeliveredAt() != null ? t.getDeliveredAt().toString() : ""
            ));
        }
        return sw.toString();
    }
}

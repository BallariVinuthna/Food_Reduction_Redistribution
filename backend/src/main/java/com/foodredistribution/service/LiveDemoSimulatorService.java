package com.foodredistribution.service;

import com.foodredistribution.entity.*;
import com.foodredistribution.matching.MatchingEngine;
import com.foodredistribution.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class LiveDemoSimulatorService {

    private static final Logger logger = LoggerFactory.getLogger(LiveDemoSimulatorService.class);

    private final FoodListingRepository foodListingRepository;
    private final FoodSafetyCheckRepository foodSafetyCheckRepository;
    private final FoodProviderRepository foodProviderRepository;
    private final ReceiverRepository receiverRepository;
    private final VolunteerRepository volunteerRepository;
    private final MatchRepository matchRepository;
    private final MatchingEngine matchingEngine;
    private final PickupAssignmentRepository pickupAssignmentRepository;
    private final DonationTransactionRepository donationTransactionRepository;
    private final NgoDemandRepository ngoDemandRepository;
    private final WasteDiaryRepository wasteDiaryRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public LiveDemoSimulatorService(FoodListingRepository foodListingRepository,
                                    FoodSafetyCheckRepository foodSafetyCheckRepository,
                                    FoodProviderRepository foodProviderRepository,
                                    ReceiverRepository receiverRepository,
                                    VolunteerRepository volunteerRepository,
                                    MatchRepository matchRepository,
                                    MatchingEngine matchingEngine,
                                    PickupAssignmentRepository pickupAssignmentRepository,
                                    DonationTransactionRepository donationTransactionRepository,
                                    NgoDemandRepository ngoDemandRepository,
                                    WasteDiaryRepository wasteDiaryRepository,
                                    NotificationService notificationService,
                                    UserRepository userRepository) {
        this.foodListingRepository = foodListingRepository;
        this.foodSafetyCheckRepository = foodSafetyCheckRepository;
        this.foodProviderRepository = foodProviderRepository;
        this.receiverRepository = receiverRepository;
        this.volunteerRepository = volunteerRepository;
        this.matchRepository = matchRepository;
        this.matchingEngine = matchingEngine;
        this.pickupAssignmentRepository = pickupAssignmentRepository;
        this.donationTransactionRepository = donationTransactionRepository;
        this.ngoDemandRepository = ngoDemandRepository;
        this.wasteDiaryRepository = wasteDiaryRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @Transactional
    public synchronized Map<String, Object> ensureVibrantDemoData() {
        return refreshLiveDemo(false);
    }

    @Transactional
    public synchronized Map<String, Object> forceRefreshLiveDemo() {
        return refreshLiveDemo(true);
    }

    private Map<String, Object> refreshLiveDemo(boolean force) {
        LocalDateTime now = LocalDateTime.now();
        List<FoodListing> existingActive = foodListingRepository.findActiveSurplus(now);

        if (!force && existingActive.size() >= 3) {
            Map<String, Object> status = new HashMap<>();
            status.put("message", "Live demo data already active");
            status.put("activeListingsCount", existingActive.size());
            return status;
        }

        logger.info("⚡ Injecting Vibrant Live Demo Data into SurplusFlow (Force: {})...", force);

        // Fetch or fallback to standard providers
        List<FoodProvider> providers = foodProviderRepository.findAll();
        if (providers.isEmpty()) {
            logger.warn("No food providers found to anchor live demo data.");
            return Map.of("error", "No food providers found");
        }

        FoodProvider paradise = findProviderByNameLike(providers, "Paradise", providers.get(0));
        FoodProvider cyber = findProviderByNameLike(providers, "Cyber", providers.get(Math.min(1, providers.size() - 1)));
        FoodProvider taj = findProviderByNameLike(providers, "Taj", providers.get(Math.min(2, providers.size() - 1)));
        FoodProvider cbit = findProviderByNameLike(providers, "CBIT", providers.get(Math.min(3, providers.size() - 1)));
        FoodProvider central = findProviderByNameLike(providers, "Central", providers.get(0));

        List<Receiver> receivers = receiverRepository.findByIsAvailableTrue();
        if (receivers.isEmpty()) {
            receivers = receiverRepository.findAll();
        }

        List<Volunteer> volunteers = volunteerRepository.findAll();
        Volunteer volunteer1 = volunteers.isEmpty() ? null : volunteers.get(0);

        int createdListingsCount = 0;

        // 1. CRITICAL Urgency Listing (42 mins left -> Flashing Red on Urgency Radar)
        FoodListing l1 = createListingHelper(
                paradise,
                "Special Dum Biryani & Mirchi Ka Salan",
                "COOKED_MEALS",
                55.0,
                "MEALS",
                now.minusMinutes(45),
                now.minusMinutes(15),
                now.plusMinutes(42), // 42 minutes remaining -> CRITICAL
                "MG Road, Secunderabad, Hyderabad",
                17.4411,
                78.4983,
                "FRESHLY_PREPARED",
                false,
                "Contains Nuts (Cashews)",
                "HEATED_CONTAINER",
                "Service counter 2, ask for Rahim",
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
                "+91 9876543214",
                "Held above 65°C in sanitized food-grade stainless steel chafers."
        );
        createdListingsCount++;

        // 2. HIGH Urgency Listing (85 mins left -> Amber on Urgency Radar)
        FoodListing l2 = createListingHelper(
                cyber,
                "Banquet Special Paneer Butter Masala & Naan",
                "COOKED_MEALS",
                75.0,
                "MEALS",
                now.minusMinutes(50),
                now.minusMinutes(20),
                now.plusMinutes(85), // 85 minutes remaining -> HIGH
                "Hitec City, Madhapur, Hyderabad",
                17.4483,
                78.3742,
                "FRESHLY_PREPARED",
                true,
                "Contains Dairy, Wheat",
                "HEATED_CONTAINER",
                "Convention loading bay behind main auditorium",
                "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
                "+91 9876543216",
                "Fresh banquet surplus sealed in food safety approved containers."
        );
        createdListingsCount++;

        // 3. HIGH Urgency Listing (115 mins left -> Amber)
        FoodListing l3 = createListingHelper(
                taj,
                "Executive Buffet South Indian Thali Meals",
                "COOKED_MEALS",
                50.0,
                "MEALS",
                now.minusMinutes(60),
                now.minusMinutes(10),
                now.plusMinutes(115), // 115 minutes remaining -> HIGH
                "Road No. 1, Banjara Hills, Hyderabad",
                17.4156,
                78.4487,
                "FRESHLY_PREPARED",
                true,
                "Contains Dairy",
                "HEATED_CONTAINER",
                "Gate 2 service entry. Ask for Sous Chef Anirudh",
                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "+91 9876543211",
                "Temperature checked at 68°C. Sealed in insulated carrier boxes."
        );
        createdListingsCount++;

        // 4. MEDIUM Urgency Listing (180 mins left -> Teal)
        FoodListing l4 = createListingHelper(
                cbit,
                "Fresh Steamed Idli, Medu Vada & Sambar",
                "COOKED_MEALS",
                40.0,
                "MEALS",
                now.minusMinutes(25),
                now,
                now.plusMinutes(180), // 3 hours -> MEDIUM
                "Gandipet, Hyderabad",
                17.3916,
                78.3194,
                "FRESHLY_PREPARED",
                true,
                "Vegetarian. No allergens.",
                "INSULATED_BOX",
                "College main cafeteria dispatch desk",
                "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
                "+91 9876543215",
                "Steam-packed, verified untouched kitchen over-production."
        );
        createdListingsCount++;

        // 5. LOW Urgency Listing (360 mins left -> Emerald)
        FoodListing l5 = createListingHelper(
                central,
                "Fresh Farm Tomatoes & Crisp Bell Peppers",
                "RAW_PRODUCE",
                30.0,
                "KG",
                now.minusHours(2),
                now,
                now.plusMinutes(360), // 6 hours -> LOW
                "Road No. 1, Banjara Hills, Hyderabad",
                17.4156,
                78.4487,
                "EXCELLENT",
                true,
                "None. Fresh agricultural produce.",
                "ROOM_TEMP",
                "Central Surplus Hub bay 1",
                "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
                "+91 9876543210",
                "Farm crate sorted and quality graded Class A."
        );
        createdListingsCount++;

        // 6. Generate Smart Ranked Matches for active listings
        for (FoodListing listing : List.of(l1, l2, l3, l4, l5)) {
            try {
                List<MatchingEngine.MatchCandidate> candidates = matchingEngine.findRankedMatches(listing, receivers);
                UUID attemptId = UUID.randomUUID();
                for (MatchingEngine.MatchCandidate cand : candidates) {
                    Match match = new Match(
                            listing,
                            cand.getReceiver(),
                            cand.getTotalScore(),
                            cand.getLocationScore(),
                            cand.getQuantityScore(),
                            cand.getUrgencyScore(),
                            cand.getFoodTypeScore(),
                            cand.getCapacityScore(),
                            cand.getReliabilityScore(),
                            cand.getDistanceKm(),
                            cand.getEstimatedPickupMinutes()
                    );
                    match.setAttemptId(attemptId);
                    match.setRequestedQuantity(listing.getQuantity());
                    match.setAllocatedQuantity(cand.getAllocatedQuantity());
                    match.setSplitAllocation(cand.isSplitAllocation());
                    match.setStatus(MatchStatus.PROPOSED);
                    matchRepository.save(match);
                }
            } catch (Exception e) {
                logger.warn("Match generation for listing {} had note: {}", listing.getFoodName(), e.getMessage());
            }
        }

        // 7. Create 1 Active In-Transit Pickup Assignment with Volunteer
        if (volunteer1 != null && !receivers.isEmpty()) {
            try {
                // Link with Listing 2 top match
                List<Match> matches = matchRepository.findByFoodListingId(l2.getId());
                if (!matches.isEmpty()) {
                    Match topMatch = matches.get(0);
                    topMatch.setStatus(MatchStatus.ACCEPTED);
                    matchRepository.save(topMatch);

                    l2.setStatus(FoodStatus.PICKUP_ASSIGNED);
                    foodListingRepository.save(l2);

                    PickupAssignment assignment = new PickupAssignment(topMatch, volunteer1);
                    assignment.setStatus(PickupStatus.EN_ROUTE);
                    assignment.setEnRouteAt(now.minusMinutes(12));
                    assignment.setPickupOtp("7492");
                    assignment.setDeliveryOtp("8163");
                    pickupAssignmentRepository.save(assignment);
                }
            } catch (Exception ignored) {}
        }

        // 8. Seed Verified NGO Demands for Calendar
        seedNgoDemandsIfEmpty(receivers);

        // 9. Seed Waste Diary Entries
        seedWasteDiaryIfEmpty(taj.getId().toString(), taj.getOrganizationName());

        // 10. Seed Completed Verified Impact Ledger Entries
        seedImpactLedgerIfEmpty(l3, taj, receivers.get(0), volunteer1);

        Map<String, Object> result = new HashMap<>();
        result.put("status", "SUCCESS");
        result.put("message", "SurplusFlow is now fully ALIVE with dynamic listings, urgent countdowns, smart matches, and active routes!");
        result.put("listingsCreated", createdListingsCount);
        result.put("activeCount", foodListingRepository.findActiveSurplus(now).size());
        return result;
    }

    private FoodListing createListingHelper(FoodProvider provider, String foodName, String category,
                                            double quantity, String unit, LocalDateTime prepTime,
                                            LocalDateTime availableFrom, LocalDateTime availableUntil,
                                            String address, double lat, double lon, String condition,
                                            boolean vegetarian, String allergen, String storage,
                                            String pickupInstructions, String photoUrl, String contactPhone,
                                            String safetyNotes) {
        FoodListing listing = new FoodListing(
                provider,
                foodName,
                category,
                quantity,
                unit,
                prepTime,
                availableFrom,
                availableUntil,
                address,
                lat,
                lon,
                condition,
                vegetarian,
                allergen,
                storage,
                pickupInstructions,
                photoUrl,
                contactPhone
        );
        listing.setStatus(FoodStatus.AVAILABLE);
        listing.recalculateUrgency();
        listing = foodListingRepository.save(listing);

        FoodSafetyCheck check = new FoodSafetyCheck(
                listing,
                true,
                true,
                true,
                true,
                true,
                safetyNotes
        );
        foodSafetyCheckRepository.save(check);

        return listing;
    }

    private FoodProvider findProviderByNameLike(List<FoodProvider> list, String keyword, FoodProvider fallback) {
        for (FoodProvider p : list) {
            if (p.getOrganizationName() != null && p.getOrganizationName().toLowerCase().contains(keyword.toLowerCase())) {
                return p;
            }
        }
        return fallback;
    }

    private void seedNgoDemandsIfEmpty(List<Receiver> receivers) {
        if (ngoDemandRepository.count() > 0) return;

        LocalDate today = LocalDate.now();
        List<NgoDemandRequest> demands = List.of(
                new NgoDemandRequest(
                        receivers.size() > 0 ? receivers.get(0).getId().toString() : "rha-hyd",
                        receivers.size() > 0 ? receivers.get(0).getOrganizationName() : "Robin Hood Army Hyderabad",
                        today,
                        "LUNCH",
                        "COOKED_MEALS",
                        85,
                        85.0,
                        "MEALS",
                        "VEGETARIAN",
                        "Siddharth Rao",
                        "+91 9876543212"
                ),
                new NgoDemandRequest(
                        receivers.size() > 1 ? receivers.get(1).getId().toString() : "sphoorti-home",
                        receivers.size() > 1 ? receivers.get(1).getOrganizationName() : "Sphoorti Children Community Home",
                        today.plusDays(1),
                        "DINNER",
                        "COOKED_MEALS",
                        60,
                        60.0,
                        "MEALS",
                        "ANY",
                        "Srividya M.",
                        "+91 9876543218"
                ),
                new NgoDemandRequest(
                        receivers.size() > 2 ? receivers.get(2).getId().toString() : "akshaya-patra",
                        receivers.size() > 2 ? receivers.get(2).getOrganizationName() : "Akshaya Patra Food Shelter",
                        today.plusDays(2),
                        "BREAKFAST",
                        "COOKED_MEALS",
                        120,
                        120.0,
                        "MEALS",
                        "VEGETARIAN",
                        "Venkatesh K.",
                        "+91 9876543217"
                ),
                new NgoDemandRequest(
                        receivers.size() > 3 ? receivers.get(3).getId().toString() : "amrapali-home",
                        receivers.size() > 3 ? receivers.get(3).getOrganizationName() : "Amrapali Old Age Home",
                        today.plusDays(3),
                        "LUNCH",
                        "COOKED_MEALS",
                        40,
                        40.0,
                        "MEALS",
                        "VEGETARIAN",
                        "Sister Mary",
                        "+91 9876543219"
                )
        );

        for (NgoDemandRequest d : demands) {
            d.setStatus("OPEN");
            ngoDemandRepository.save(d);
        }
    }

    private void seedWasteDiaryIfEmpty(String providerId, String providerName) {
        if (wasteDiaryRepository.count() > 0) return;

        LocalDate today = LocalDate.now();
        List<WasteDiaryEntry> entries = List.of(
                createDiary(providerId, providerName, "Basmati Rice & Dal Makhani", "COOKED_MEALS", 100.0, 75.0, 20.0, 0.0, 5.0, "BUFFET_RESIDUAL", today.minusDays(1), "Use smaller buffet chaffers during the final 45 mins of lunch service."),
                createDiary(providerId, providerName, "Tandoori Rotis & Naan", "BAKERY_BREAD", 80.0, 62.0, 12.0, 0.0, 6.0, "OVER_PREPARATION", today.minusDays(2), "Adopt 2-batch progressive baking instead of single large advance batch."),
                createDiary(providerId, providerName, "Paneer Butter Masala", "COOKED_MEALS", 60.0, 50.0, 8.0, 0.0, 2.0, "BUFFET_RESIDUAL", today.minusDays(3), "Adjust weekend event banquet forecast curve based on past attendance."),
                createDiary(providerId, providerName, "Fresh Cut Fruit Bowls", "FRESH_PRODUCE", 40.0, 28.0, 8.0, 0.0, 4.0, "SPOILAGE", today.minusDays(4), "Inspect cold table refrigeration temperatures; calibrate to 3°C.")
        );

        for (WasteDiaryEntry e : entries) {
            wasteDiaryRepository.save(e);
        }
    }

    private WasteDiaryEntry createDiary(String providerId, String providerName, String itemName, String category,
                                        double prep, double sold, double don, double reused, double disc,
                                        String reason, LocalDate date, String recommendation) {
        WasteDiaryEntry e = new WasteDiaryEntry();
        e.setProviderId(providerId);
        e.setProviderName(providerName);
        e.setFoodItemName(itemName);
        e.setFoodCategory(category);
        e.setQuantityPrepared(prep);
        e.setQuantitySoldOrConsumed(sold);
        e.setQuantityDonated(don);
        e.setQuantityReusedSafely(reused);
        e.setQuantityDiscarded(disc);
        e.setUnit("MEALS");
        e.setWasteReason(reason);
        e.setMealPeriod("LUNCH");
        e.setEntryDate(date);
        e.setIsMeasured(true);
        e.setPreventiveActionRecommendation(recommendation);
        return e;
    }

    private void seedImpactLedgerIfEmpty(FoodListing listing, FoodProvider provider, Receiver receiver, Volunteer volunteer) {
        if (donationTransactionRepository.count() >= 3) return;

        LocalDateTime now = LocalDateTime.now();
        DonationTransaction t1 = new DonationTransaction(listing, provider, receiver, 60.0, "MEALS");
        t1.setVolunteer(volunteer);
        t1.setStatus(TransactionStatus.DELIVERED);
        t1.setVerificationStatus(VerificationStatus.VERIFIED);
        t1.setQuantityCollected(60.0);
        t1.setQuantityDelivered(60.0);
        t1.setPickupOtp("3812");
        t1.setDeliveryOtp("9421");
        t1.setPickupOtpVerified(true);
        t1.setDeliveryOtpVerified(true);
        t1.setReservedAt(now.minusHours(4));
        t1.setAssignedAt(now.minusHours(3).minusMinutes(40));
        t1.setEnRouteAt(now.minusHours(3).minusMinutes(25));
        t1.setArrivedAt(now.minusHours(3).minusMinutes(10));
        t1.setCollectedAt(now.minusHours(3));
        t1.setDeliveredAt(now.minusHours(2).minusMinutes(20));
        t1.setNotes("Successfully verified and distributed to shelter residents.");
        donationTransactionRepository.save(t1);

        DonationTransaction t2 = new DonationTransaction(listing, provider, receiver, 45.0, "MEALS");
        t2.setVolunteer(volunteer);
        t2.setStatus(TransactionStatus.DELIVERED);
        t2.setVerificationStatus(VerificationStatus.VERIFIED);
        t2.setQuantityCollected(45.0);
        t2.setQuantityDelivered(45.0);
        t2.setPickupOtp("5821");
        t2.setDeliveryOtp("4719");
        t2.setPickupOtpVerified(true);
        t2.setDeliveryOtpVerified(true);
        t2.setReservedAt(now.minusHours(26));
        t2.setAssignedAt(now.minusHours(25));
        t2.setCollectedAt(now.minusHours(24));
        t2.setDeliveredAt(now.minusHours(23));
        t2.setNotes("Delivered to community kitchen with QR audit trail confirmed.");
        donationTransactionRepository.save(t2);
    }
}

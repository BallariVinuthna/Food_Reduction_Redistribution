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

        // ==================== 1. COOKED MEALS (4 distinct items) ====================
        FoodListing l1 = createListingHelper(
                paradise,
                "Hyderabadi Veg Dum Biryani & Mirchi Ka Salan",
                "COOKED_MEALS",
                55.0,
                "MEALS",
                now.minusMinutes(45),
                now.minusMinutes(15),
                now.plusMinutes(42),
                "MG Road, Secunderabad, Hyderabad",
                17.4411,
                78.4983,
                "FRESHLY_PREPARED",
                true,
                "Contains Nuts (Cashews)",
                "HEATED_CONTAINER",
                "Service counter 2, ask for Rahim",
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
                "+91 9876543214",
                "Held above 65°C in sanitized food-grade stainless steel chafers."
        );
        createdListingsCount++;

        FoodListing l2 = createListingHelper(
                cyber,
                "Banquet Special Paneer Butter Masala & Naan",
                "COOKED_MEALS",
                75.0,
                "MEALS",
                now.minusMinutes(50),
                now.minusMinutes(20),
                now.plusMinutes(85),
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

        FoodListing l3 = createListingHelper(
                taj,
                "Royal Buffet Steamed Rice & Dal Makhani",
                "COOKED_MEALS",
                50.0,
                "MEALS",
                now.minusMinutes(60),
                now.minusMinutes(10),
                now.plusMinutes(115),
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

        FoodListing l4 = createListingHelper(
                cbit,
                "Fresh Steamed Idli, Medu Vada & Sambar",
                "COOKED_MEALS",
                40.0,
                "MEALS",
                now.minusMinutes(25),
                now,
                now.plusMinutes(180),
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

        FoodListing l5 = createListingHelper(
                taj,
                "Tempered Curd Rice with Pomegranate & Mustard",
                "COOKED_MEALS",
                45.0,
                "MEALS",
                now.minusMinutes(40),
                now,
                now.plusMinutes(240),
                "Road No. 1, Banjara Hills, Hyderabad",
                17.4156,
                78.4487,
                "FRESHLY_PREPARED",
                true,
                "Contains Dairy (Curd, Milk)",
                "REFRIGERATED",
                "Kitchen pantry counter, ask for Chef Anirudh",
                "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
                "+91 9876543211",
                "Chilled South Indian curd rice tempered with curry leaves and mustard."
        );
        createdListingsCount++;

        FoodListing l6 = createListingHelper(
                cyber,
                "Fragrant Veg Basmati Pulao with Mixed Raita",
                "COOKED_MEALS",
                60.0,
                "MEALS",
                now.minusMinutes(30),
                now,
                now.plusMinutes(300),
                "Hitec City, Madhapur, Hyderabad",
                17.4483,
                78.3742,
                "FRESHLY_PREPARED",
                true,
                "Vegetarian. Dairy in raita.",
                "HEATED_CONTAINER",
                "Banquet hall dispatch counter",
                "https://images.unsplash.com/photo-1633383718081-22ac93e3db65?auto=format&fit=crop&w=600&q=80",
                "+91 9876543216",
                "Aromatic mild spiced basmati pulao cooked with carrots, beans and peas."
        );
        createdListingsCount++;

        FoodListing l7 = createListingHelper(
                cbit,
                "Hot Rava Upma with Coconut Chutney & Cashews",
                "COOKED_MEALS",
                40.0,
                "MEALS",
                now.minusMinutes(20),
                now,
                now.plusMinutes(180),
                "Gandipet, Hyderabad",
                17.3916,
                78.3194,
                "FRESHLY_PREPARED",
                true,
                "Contains Nuts (Cashews), Wheat (Semolina)",
                "HEATED_CONTAINER",
                "Canteen main counter",
                "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
                "+91 9876543215",
                "Traditional roasted semolina upma served with fresh coconut chutney."
        );
        createdListingsCount++;

        // ==================== 2. BAKERY & BREAD (4 distinct items) ====================
        FoodListing b1 = createListingHelper(
                central,
                "Artisan Sourdough Loaves & Multigrain Breads",
                "BAKERY_BREAD",
                35.0,
                "PACKETS",
                now.minusHours(3),
                now,
                now.plusMinutes(240),
                "Jubilee Hills, Hyderabad",
                17.4312,
                78.4073,
                "FRESHLY_PREPARED",
                true,
                "Contains Gluten (Wheat, Rye)",
                "ROOM_TEMP",
                "Bakery delivery counter",
                "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
                "+91 9876543210",
                "Freshly baked today, parchment wrapped in food-safe bags."
        );
        createdListingsCount++;

        FoodListing b2 = createListingHelper(
                taj,
                "Fresh Golden Dinner Rolls & Pav Buns",
                "BAKERY_BREAD",
                50.0,
                "PACKETS",
                now.minusHours(2),
                now,
                now.plusMinutes(320),
                "Banjara Hills, Hyderabad",
                17.4156,
                78.4487,
                "FRESHLY_PREPARED",
                true,
                "Contains Wheat",
                "ROOM_TEMP",
                "Kitchen pastry counter",
                "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80",
                "+91 9876543211",
                "Soft dinner buns baked fresh, sealed in cartons."
        );
        createdListingsCount++;

        FoodListing b3 = createListingHelper(
                cyber,
                "Assorted Breakfast Croissants & Danishes",
                "BAKERY_BREAD",
                30.0,
                "PACKETS",
                now.minusHours(4),
                now,
                now.plusMinutes(200),
                "Hitec City, Madhapur, Hyderabad",
                17.4483,
                78.3742,
                "FRESHLY_PREPARED",
                true,
                "Contains Dairy, Wheat",
                "ROOM_TEMP",
                "Convention bakery room",
                "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
                "+91 9876543216",
                "Butter laminated croissants packed in ventilated food trays."
        );
        createdListingsCount++;

        FoodListing b4 = createListingHelper(
                cbit,
                "Whole Wheat Herb Focaccia & Soft Pita Breads",
                "BAKERY_BREAD",
                25.0,
                "PACKETS",
                now.minusHours(1),
                now,
                now.plusMinutes(380),
                "Gandipet, Hyderabad",
                17.3916,
                78.3194,
                "FRESHLY_PREPARED",
                true,
                "Contains Wheat, Herbs",
                "ROOM_TEMP",
                "Canteen loading station",
                "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
                "+91 9876543215",
                "Rosemary olive oil focaccia sliced and sealed."
        );
        createdListingsCount++;

        // ==================== 3. PACKAGED GROCERIES (4 distinct items) ====================
        FoodListing p1 = createListingHelper(
                central,
                "Sealed Organic Basmati Rice Bags (5 kg)",
                "PACKAGED_GROCERIES",
                20.0,
                "PACKETS",
                now.minusDays(1),
                now,
                now.plusDays(3),
                "Moosapet, Kukatpally, Hyderabad",
                17.4728,
                78.4184,
                "SEALED_PACKAGED",
                true,
                "None. 100% Raw Basmati.",
                "ROOM_TEMP",
                "Wholesale dry warehouse aisle 4",
                "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
                "+91 9876543210",
                "Factory vacuum-sealed premium long grain basmati rice."
        );
        createdListingsCount++;

        FoodListing p2 = createListingHelper(
                taj,
                "Packaged Toor Dal & Moong Pulses (1 kg)",
                "PACKAGED_GROCERIES",
                40.0,
                "KG",
                now.minusDays(2),
                now,
                now.plusDays(4),
                "Road No. 1, Banjara Hills, Hyderabad",
                17.4156,
                78.4487,
                "SEALED_PACKAGED",
                true,
                "None. Lentils/Pulses.",
                "ROOM_TEMP",
                "Hotel commissary store bay",
                "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=600&q=80",
                "+91 9876543211",
                "Unpolished high protein lentils in sealed moisture-proof bags."
        );
        createdListingsCount++;

        FoodListing p3 = createListingHelper(
                paradise,
                "Cold-Pressed Cooking Oil & Whole Wheat Flour",
                "PACKAGED_GROCERIES",
                30.0,
                "PACKETS",
                now.minusDays(1),
                now,
                now.plusDays(5),
                "MG Road, Secunderabad, Hyderabad",
                17.4411,
                78.4983,
                "SEALED_PACKAGED",
                true,
                "Contains Wheat",
                "ROOM_TEMP",
                "Commissary delivery door",
                "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=600&q=80",
                "+91 9876543214",
                "Sealed 5L refined sunflower oil tins and 10kg flour bags."
        );
        createdListingsCount++;

        FoodListing p4 = createListingHelper(
                cyber,
                "Fortified Rolled Oats & Multi-Grain Cereals",
                "PACKAGED_GROCERIES",
                25.0,
                "PACKETS",
                now.minusDays(1),
                now,
                now.plusDays(7),
                "Hitec City, Madhapur, Hyderabad",
                17.4483,
                78.3742,
                "SEALED_PACKAGED",
                true,
                "Contains Oats, Grains",
                "ROOM_TEMP",
                "Convention storage room",
                "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80",
                "+91 9876543216",
                "Nutritious boxed breakfast cereals with 6-month shelf life."
        );
        createdListingsCount++;

        // ==================== 4. FRESH PRODUCE (4 distinct items) ====================
        FoodListing r1 = createListingHelper(
                central,
                "Farm Fresh Tomatoes & Crisp Cucumbers",
                "FRESH_PRODUCE",
                35.0,
                "KG",
                now.minusHours(4),
                now,
                now.plusMinutes(420),
                "Road No. 1, Banjara Hills, Hyderabad",
                17.4156,
                78.4487,
                "EXCELLENT",
                true,
                "None. Fresh farm vegetables.",
                "ROOM_TEMP",
                "Central Surplus Hub bay 1",
                "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
                "+91 9876543210",
                "Farm crate sorted, washed and quality graded Class A."
        );
        createdListingsCount++;

        FoodListing r2 = createListingHelper(
                taj,
                "Organic Shimla Apples, Bananas & Oranges",
                "FRESH_PRODUCE",
                40.0,
                "KG",
                now.minusHours(5),
                now,
                now.plusMinutes(480),
                "Banjara Hills Road No. 1, Hyderabad",
                17.4156,
                78.4487,
                "EXCELLENT",
                true,
                "None. Fresh fruits.",
                "ROOM_TEMP",
                "Fresh produce receiving dock",
                "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80",
                "+91 9876543211",
                "Sweet seasonal fruit assortment in ventilated wooden crates."
        );
        createdListingsCount++;

        FoodListing r3 = createListingHelper(
                cbit,
                "Crisp Green Spinach, Palak & Fresh Mint",
                "FRESH_PRODUCE",
                25.0,
                "KG",
                now.minusHours(2),
                now,
                now.plusMinutes(260),
                "Gandipet, Hyderabad",
                17.3916,
                78.3194,
                "EXCELLENT",
                true,
                "None. Fresh leafy greens.",
                "ROOM_TEMP",
                "Garden surplus collection desk",
                "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
                "+91 9876543215",
                "Organically grown leafy greens harvested earlier today."
        );
        createdListingsCount++;

        FoodListing r4 = createListingHelper(
                paradise,
                "Sweet Golden Corn, Carrots & Tender Beans",
                "FRESH_PRODUCE",
                30.0,
                "KG",
                now.minusHours(3),
                now,
                now.plusMinutes(540),
                "MG Road, Secunderabad, Hyderabad",
                17.4411,
                78.4983,
                "EXCELLENT",
                true,
                "None. Fresh vegetables.",
                "ROOM_TEMP",
                "Kitchen prep dispatch",
                "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=600&q=80",
                "+91 9876543214",
                "Handpicked sweet corn cobs and fresh beans in burlap sacks."
        );
        createdListingsCount++;

        // 6. Generate Smart Ranked Matches for active listings
        for (FoodListing listing : List.of(l1, l2, l3, l4, b1, b2, p1, r1)) {
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
        List<FoodListing> existingList = foodListingRepository.findAll().stream()
                .filter(l -> l.getFoodName() != null && l.getFoodName().equalsIgnoreCase(foodName))
                .toList();

        FoodListing listing;
        if (!existingList.isEmpty()) {
            listing = existingList.get(0);
            listing.setProvider(provider);
            listing.setFoodCategory(category);
            listing.setQuantity(quantity);
            listing.setRemainingQuantity(quantity);
            listing.setReservedQuantity(0.0);
            listing.setUnit(unit);
            listing.setPreparationTime(prepTime);
            listing.setAvailableFrom(availableFrom);
            listing.setAvailableUntil(availableUntil);
            listing.setAddress(address);
            listing.setLatitude(lat);
            listing.setLongitude(lon);
            listing.setFoodCondition(condition);
            listing.setVegetarian(vegetarian);
            listing.setAllergenInfo(allergen);
            listing.setStorageCondition(storage);
            listing.setPickupInstructions(pickupInstructions);
            listing.setPhotoUrl(photoUrl);
            listing.setContactPhone(contactPhone);
            listing.setStatus(FoodStatus.AVAILABLE);
            listing.recalculateUrgency();
            listing = foodListingRepository.save(listing);
        } else {
            listing = new FoodListing(
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
        }

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

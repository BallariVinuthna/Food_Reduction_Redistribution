package com.foodredistribution.config;

import com.foodredistribution.entity.*;
import com.foodredistribution.repository.*;
import com.foodredistribution.service.AnalyticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final FoodProviderRepository foodProviderRepository;
    private final ReceiverRepository receiverRepository;
    private final VolunteerRepository volunteerRepository;
    private final FoodListingRepository foodListingRepository;
    private final FoodSafetyCheckRepository foodSafetyCheckRepository;
    private final MatchRepository matchRepository;
    private final PickupAssignmentRepository pickupAssignmentRepository;
    private final SystemIdeaRepository systemIdeaRepository;
    private final BaselineMetricRepository baselineMetricRepository;
    private final AdminConfigRepository adminConfigRepository;
    private final DonationTransactionRepository donationTransactionRepository;
    private final PickupEventRepository pickupEventRepository;
    private final FieldWasteRecordRepository fieldWasteRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final AnalyticsService analyticsService;

    public DataInitializer(UserRepository userRepository,
                           FoodProviderRepository foodProviderRepository,
                           ReceiverRepository receiverRepository,
                           VolunteerRepository volunteerRepository,
                           FoodListingRepository foodListingRepository,
                           FoodSafetyCheckRepository foodSafetyCheckRepository,
                           MatchRepository matchRepository,
                           PickupAssignmentRepository pickupAssignmentRepository,
                           DonationTransactionRepository donationTransactionRepository,
                           PickupEventRepository pickupEventRepository,
                           FieldWasteRecordRepository fieldWasteRecordRepository,
                           SystemIdeaRepository systemIdeaRepository,
                           BaselineMetricRepository baselineMetricRepository,
                           AdminConfigRepository adminConfigRepository,
                           PasswordEncoder passwordEncoder,
                           AnalyticsService analyticsService) {
        this.userRepository = userRepository;
        this.foodProviderRepository = foodProviderRepository;
        this.receiverRepository = receiverRepository;
        this.volunteerRepository = volunteerRepository;
        this.foodListingRepository = foodListingRepository;
        this.foodSafetyCheckRepository = foodSafetyCheckRepository;
        this.matchRepository = matchRepository;
        this.pickupAssignmentRepository = pickupAssignmentRepository;
        this.donationTransactionRepository = donationTransactionRepository;
        this.pickupEventRepository = pickupEventRepository;
        this.fieldWasteRecordRepository = fieldWasteRecordRepository;
        this.systemIdeaRepository = systemIdeaRepository;
        this.baselineMetricRepository = baselineMetricRepository;
        this.adminConfigRepository = adminConfigRepository;
        this.passwordEncoder = passwordEncoder;
        this.analyticsService = analyticsService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded. Skipping initial data seed.");
            return;
        }

        logger.info("Initializing Seed Data for Hyderabad Prototype (DEMO DATA)...");

        // 1. Admin Config
        AdminConfig config = new AdminConfig();
        config.setWeightDistance(0.30);
        config.setWeightQuantity(0.20);
        config.setWeightUrgency(0.20);
        config.setWeightFoodType(0.15);
        config.setWeightCapacity(0.10);
        config.setWeightAvailability(0.05);
        config.setMaxSearchRadiusKm(25.0);
        config.setUrgencyCriticalMinutes(60);
        config.setUrgencyHighMinutes(120);
        config.setUrgencyMediumMinutes(240);
        adminConfigRepository.save(config);

        // 2. Demo Users (Password: DemoPass123!)
        String demoPasswordHash = passwordEncoder.encode("DemoPass123!");

        User adminUser = new User("admin@demo.local", demoPasswordHash, "PSE System Admin", "+91 9876543210", Role.ADMIN);
        userRepository.save(adminUser);

        User providerUser = new User("provider@demo.local", demoPasswordHash, "Taj Banjara Kitchens", "+91 9876543211", Role.FOOD_PROVIDER);
        userRepository.save(providerUser);

        User receiverUser = new User("receiver@demo.local", demoPasswordHash, "Robin Hood Army Hyderabad", "+91 9876543212", Role.NGO_RECEIVER);
        userRepository.save(receiverUser);

        User volunteerUser = new User("volunteer@demo.local", demoPasswordHash, "Vikram Sharma", "+91 9876543213", Role.VOLUNTEER);
        userRepository.save(volunteerUser);

        // 3. Additional Stakeholder Users & Profiles in Hyderabad
        // Food Providers
        FoodProvider p0 = new FoodProvider(adminUser, "PSE Central Operations Hub", "CENTRAL_HUB", "Road No. 1, Banjara Hills, Hyderabad", 17.4156, 78.4487, "PSE System Admin", "+91 9876543210");
        foodProviderRepository.save(p0);

        FoodProvider p1 = new FoodProvider(providerUser, "Taj Banjara Grand Hotel", "HOTEL", "Road No. 1, Banjara Hills, Hyderabad", 17.4156, 78.4487, "Chef Anirudh", "+91 9876543211");
        foodProviderRepository.save(p1);

        User p2User = new User("paradise@demo.local", demoPasswordHash, "Paradise Biryani Secunderabad", "+91 9876543214", Role.FOOD_PROVIDER);
        userRepository.save(p2User);
        FoodProvider p2 = new FoodProvider(p2User, "Paradise Biryani Hub", "RESTAURANT", "MG Road, Secunderabad", 17.4411, 78.4983, "Manager Rahim", "+91 9876543214");
        foodProviderRepository.save(p2);

        User p3User = new User("cbit.canteen@demo.local", demoPasswordHash, "CBIT Campus Canteen", "+91 9876543215", Role.FOOD_PROVIDER);
        userRepository.save(p3User);
        FoodProvider p3 = new FoodProvider(p3User, "CBIT Engineering College Canteen", "COLLEGE_CANTEEN", "Gandipet, Hyderabad", 17.3916, 78.3194, "Mr. Suresh", "+91 9876543215");
        foodProviderRepository.save(p3);

        User p4User = new User("hitec.banquet@demo.local", demoPasswordHash, "Cyber Conventions Hall", "+91 9876543216", Role.FOOD_PROVIDER);
        userRepository.save(p4User);
        FoodProvider p4 = new FoodProvider(p4User, "Cyber Conventions & Marriage Hall", "MARRIAGE_HALL", "Hitec City, Madhapur, Hyderabad", 17.4483, 78.3742, "Event Coord. Priya", "+91 9876543216");
        foodProviderRepository.save(p4);

        // Receivers (NGOs, Shelters)
        Receiver r1 = new Receiver(receiverUser, "Robin Hood Army - Hyderabad Chapter", "NGO", "Jubilee Hills Check Post, Hyderabad", 17.4265, 78.4116, "Siddharth Rao", "+91 9876543212", 120, "ANY");
        receiverRepository.save(r1);

        User r2User = new User("akshaya@demo.local", demoPasswordHash, "Akshaya Patra Foundation Hub", "+91 9876543217", Role.NGO_RECEIVER);
        userRepository.save(r2User);
        Receiver r2 = new Receiver(r2User, "Akshaya Patra Food Shelter", "NGO", "Kothapet, Dilsukhnagar, Hyderabad", 17.3688, 78.5300, "Venkatesh K.", "+91 9876543217", 200, "VEG_ONLY");
        receiverRepository.save(r2);

        User r3User = new User("sphoorti@demo.local", demoPasswordHash, "Sphoorti Children Community Home", "+91 9876543218", Role.NGO_RECEIVER);
        userRepository.save(r3User);
        Receiver r3 = new Receiver(r3User, "Sphoorti Foundation Shelter", "SHELTER", "Cherlapally, Hyderabad", 17.4616, 78.5991, "Srividya M.", "+91 9876543218", 80, "ANY");
        receiverRepository.save(r3);

        User r4User = new User("amrapali@demo.local", demoPasswordHash, "Amrapali Old Age Home", "+91 9876543219", Role.NGO_RECEIVER);
        userRepository.save(r4User);
        Receiver r4 = new Receiver(r4User, "Amrapali Care & Shelter Home", "OLD_AGE_HOME", "Mehdipatnam, Hyderabad", 17.3916, 78.4385, "Sister Mary", "+91 9876543219", 60, "ANY");
        receiverRepository.save(r4);

        User r5User = new User("feedhyderabad@demo.local", demoPasswordHash, "Feed The Need Community Fridge", "+91 9876543220", Role.NGO_RECEIVER);
        userRepository.save(r5User);
        Receiver r5 = new Receiver(r5User, "Feed The Need Community Foundation", "COMMUNITY_ORG", "Begumpet, Hyderabad", 17.4447, 78.4664, "Kavita Reddy", "+91 9876543220", 90, "ANY");
        receiverRepository.save(r5);

        // Volunteers
        Volunteer v1 = new Volunteer(volunteerUser, "Vikram Sharma", "+91 9876543213", "TWO_WHEELER", 17.4200, 78.4400);
        volunteerRepository.save(v1);

        User v2User = new User("sneha.vol@demo.local", demoPasswordHash, "Sneha Patel", "+91 9876543221", Role.VOLUNTEER);
        userRepository.save(v2User);
        Volunteer v2 = new Volunteer(v2User, "Sneha Patel", "+91 9876543221", "FOUR_WHEELER", 17.4450, 78.3800);
        volunteerRepository.save(v2);

        // 4. Seed Food Listings in Hyderabad
        FoodListing l1 = new FoodListing(
                p1,
                "Royal Buffet Steamed Rice & Dal Makhani",
                "COOKED_MEALS",
                50.0,
                "MEALS",
                LocalDateTime.now().minusMinutes(75),
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(90), // 90 mins remaining (HIGH/CRITICAL urgency)
                "Road No. 1, Banjara Hills, Hyderabad",
                17.4156,
                78.4487,
                "FRESHLY_PREPARED",
                true,
                "None. Contains Dairy (Butter)",
                "HEATED_CONTAINER",
                "Gate 2 Service Entry. Ask for Sous Chef Anirudh.",
                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                "+91 9876543211"
        );
        l1 = foodListingRepository.save(l1);

        FoodSafetyCheck s1 = new FoodSafetyCheck(l1, true, true, true, true, true, "Freshly held at 65°C in clean food-grade aluminum containers.");
        foodSafetyCheckRepository.save(s1);

        FoodListing l2 = new FoodListing(
                p4,
                "Wedding Dinner Paneer Butter Masala & Rotis",
                "COOKED_MEALS",
                80.0,
                "MEALS",
                LocalDateTime.now().minusMinutes(40),
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(150),
                "Hitec City, Madhapur, Hyderabad",
                17.4483,
                78.3742,
                "FRESHLY_PREPARED",
                true,
                "Contains Dairy, Wheat",
                "ROOM_TEMP",
                "Convention loading bay behind main stage.",
                "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
                "+91 9876543216"
        );
        l2 = foodListingRepository.save(l2);

        FoodSafetyCheck s2 = new FoodSafetyCheck(l2, true, true, true, true, true, "Prepared within the last 2 hours. Packaged in sanitized foil trays.");
        foodSafetyCheckRepository.save(s2);

        FoodListing l3 = new FoodListing(
                p2,
                "Special Dum Biryani & Mirchi Ka Salan",
                "COOKED_MEALS",
                60.0,
                "MEALS",
                LocalDateTime.now().minusMinutes(90),
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(45), // 45 mins remaining (CRITICAL urgency)
                "MG Road, Secunderabad",
                17.4411,
                78.4983,
                "FRESHLY_PREPARED",
                false,
                "Contains Nuts (Cashews)",
                "HEATED_CONTAINER",
                "Back alley pickup counter, ask for Rahim.",
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
                "+91 9876543214"
        );
        l3 = foodListingRepository.save(l3);

        FoodSafetyCheck s3 = new FoodSafetyCheck(l3, true, true, true, true, true, "Inspected and hot-sealed in insulated containers.");
        foodSafetyCheckRepository.save(s3);

        // Pre-create one completed delivery for analytics history
        FoodListing l4 = new FoodListing(
                p1,
                "Breakfast Idli, Vada and Sambar",
                "COOKED_MEALS",
                40.0,
                "MEALS",
                LocalDateTime.now().minusHours(5),
                LocalDateTime.now().minusHours(4),
                LocalDateTime.now().minusHours(2),
                "Road No. 1, Banjara Hills, Hyderabad",
                17.4156,
                78.4487,
                "FRESHLY_PREPARED",
                true,
                "Vegetarian",
                "ROOM_TEMP",
                "Front desk handover.",
                "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
                "+91 9876543211"
        );
        l4.setStatus(FoodStatus.REDISTRIBUTED);
        l4 = foodListingRepository.save(l4);

        Match mCompleted = new Match(l4, r1, 94.5, 96.0, 100.0, 90.0, 100.0, 85.0, 96.0, 2.1, 15);
        mCompleted.setStatus(MatchStatus.ACCEPTED);
        mCompleted.setRespondedAt(LocalDateTime.now().minusHours(4));
        mCompleted = matchRepository.save(mCompleted);

        PickupAssignment pCompleted = new PickupAssignment(mCompleted, v1);
        pCompleted.setStatus(PickupStatus.DELIVERED);
        pCompleted.setPickupOtp("582194");
        pCompleted.setDeliveryOtp("849201");
        pCompleted.setPickupOtpVerified(true);
        pCompleted.setDeliveryOtpVerified(true);
        pCompleted.setActualQuantityCollected(40.0);
        pCompleted.setActualQuantityDelivered(40.0);
        pCompleted.setAssignedAt(LocalDateTime.now().minusHours(4));
        pCompleted.setEnRouteAt(LocalDateTime.now().minusHours(3).minusMinutes(50));
        pCompleted.setArrivedAt(LocalDateTime.now().minusHours(3).minusMinutes(35));
        pCompleted.setPickedUpAt(LocalDateTime.now().minusHours(3).minusMinutes(30));
        pCompleted.setDeliveredAt(LocalDateTime.now().minusHours(3));
        pCompleted.setProofNotes("Delivered in pristine condition to Siddharth Rao at Jubilee Hills center.");
        pickupAssignmentRepository.save(pCompleted);

        // Durable Donation Transaction
        DonationTransaction txCompleted = new DonationTransaction(l4, p1, r1, 40.0, "MEALS");
        txCompleted.setVolunteer(v1);
        txCompleted.setStatus(TransactionStatus.DELIVERED);
        txCompleted.setVerificationStatus(VerificationStatus.VERIFIED);
        txCompleted.setPickupOtp("582194");
        txCompleted.setDeliveryOtp("849201");
        txCompleted.setPickupOtpVerified(true);
        txCompleted.setDeliveryOtpVerified(true);
        txCompleted.setQuantityCollected(40.0);
        txCompleted.setQuantityDelivered(40.0);
        txCompleted.setAssignedAt(LocalDateTime.now().minusHours(4));
        txCompleted.setEnRouteAt(LocalDateTime.now().minusHours(3).minusMinutes(50));
        txCompleted.setArrivedAt(LocalDateTime.now().minusHours(3).minusMinutes(35));
        txCompleted.setCollectedAt(LocalDateTime.now().minusHours(3).minusMinutes(30));
        txCompleted.setDeliveredAt(LocalDateTime.now().minusHours(3));
        donationTransactionRepository.save(txCompleted);

        // Append-only Pickup Events
        pickupEventRepository.save(new PickupEvent(pCompleted, "receiver@demo.local", "NGO_RECEIVER", null, PickupStatus.ASSIGNED, 40.0, "MATCH_ACCEPTANCE", 17.4265, 78.4116, "Initial assignment created"));
        pickupEventRepository.save(new PickupEvent(pCompleted, "volunteer@demo.local", "VOLUNTEER", PickupStatus.ASSIGNED, PickupStatus.EN_ROUTE, 40.0, "STATUS_UPDATE", 17.4200, 78.4400, "Volunteer in transit to Taj Banjara"));
        pickupEventRepository.save(new PickupEvent(pCompleted, "volunteer@demo.local", "VOLUNTEER", PickupStatus.EN_ROUTE, PickupStatus.ARRIVED, 40.0, "GEO_LOCATION", 17.4156, 78.4487, "Arrived at provider facility"));
        pickupEventRepository.save(new PickupEvent(pCompleted, "volunteer@demo.local", "VOLUNTEER", PickupStatus.ARRIVED, PickupStatus.COLLECTED, 40.0, "OTP_VERIFIED", 17.4156, 78.4487, "Collected 40 meals; Provider OTP verified [582194]"));
        pickupEventRepository.save(new PickupEvent(pCompleted, "volunteer@demo.local", "VOLUNTEER", PickupStatus.COLLECTED, PickupStatus.DELIVERED, 40.0, "OTP_VERIFIED", 17.4265, 78.4116, "Delivered 40 meals; Receiver OTP verified [849201]"));

        p1.setTotalDonatedMeals(40);
        foodProviderRepository.save(p1);
        r1.setTotalReceivedMeals(40);
        receiverRepository.save(r1);
        v1.setTotalCompletedPickups(1);
        volunteerRepository.save(v1);

        // Seed Sample Demo Field Waste Records (Clearly marked isDemo = true)
        fieldWasteRecordRepository.save(new FieldWasteRecord(
                "Taj Banjara Buffet Kitchen Audit", "HOTEL", "Banjara Hills", "COOKED_MEALS",
                42.5, "KG", LocalDateTime.now().minusDays(2).withHour(12).withMinute(0),
                LocalDateTime.now().minusDays(2).withHour(15).withMinute(30), "LUNCH_BUFFET",
                "AUDITOR_PHYSICAL_SCALE", "Certified Auditor Dr. Ramesh", true,
                "[DEMO DATA] Baseline lunch buffet waste before SurplusFlow intervention"
        ));

        fieldWasteRecordRepository.save(new FieldWasteRecord(
                "Cyber Conventions Hall Evening Audit", "MARRIAGE_HALL", "Hitec City", "COOKED_MEALS",
                78.0, "KG", LocalDateTime.now().minusDays(1).withHour(19).withMinute(0),
                LocalDateTime.now().minusDays(1).withHour(23).withMinute(30), "DINNER_BANQUET",
                "KITCHEN_LOG_SHEET", "Supervisor Ananya Rao", true,
                "[DEMO DATA] Unserved banquet surplus discarded due to unexpected attendee drop"
        ));

        // 5. Seed Module 4 System Ideas
        systemIdeaRepository.save(new SystemIdea(
                1,
                "Smart Surplus Food Redistribution Platform",
                "Edible surplus is not identified and connected to suitable receivers in time.",
                "CSE + Data Science",
                9.0, 9.0, "SELECTED",
                "Chosen as core solution architecture for MVP."
        ));
        systemIdeaRepository.save(new SystemIdea(
                2,
                "AI-Based Food Demand Prediction",
                "Over-preparation caused by inaccurate demand estimation.",
                "CSE + AI/Data Science",
                8.5, 6.0, "FUTURE EXTENSION",
                "Requires multi-month historical donor point-of-sale data."
        ));
        systemIdeaRepository.save(new SystemIdea(
                3,
                "Smart Food Waste Monitoring (IoT)",
                "Organizations do not know how much food is wasted or where.",
                "CSE + IoT/ECE",
                8.0, 5.5, "FUTURE EXTENSION",
                "Hardware integration planned for commercial kitchen bins."
        ));
        systemIdeaRepository.save(new SystemIdea(
                4,
                "Surplus Food Alert System",
                "Receivers may not know about available surplus in time.",
                "CSE + Communication/ECE",
                8.5, 9.2, "SELECTED",
                "Implemented via real-time WebSocket STOMP and push notifications."
        ));
        systemIdeaRepository.save(new SystemIdea(
                5,
                "Smart Food Matching and Priority System",
                "Surplus may not reach the most suitable receiver before its usable time ends.",
                "CSE + Data Science",
                9.5, 8.8, "SELECTED",
                "Implemented via Haversine distance and multicriteria decision analysis."
        ));
        systemIdeaRepository.save(new SystemIdea(
                6,
                "Food Waste Awareness and Behaviour System",
                "Repeated food waste caused by consumer behaviour and low awareness.",
                "CSE + Data Science",
                6.5, 8.5, "SUPPORTING FEATURE",
                "Integrated via system impact metrics and carbon diversion feedback."
        ));

        // 6. Seed Module 1 Baseline Metrics (Marked as DEMO DATA)
        baselineMetricRepository.save(new BaselineMetric(
                "DATA_POINT_A",
                "Amount of edible surplus becoming waste",
                "Field observation metric measuring unconsumed edible food discarded per kitchen per day prior to platform intervention.",
                48.5,
                "kg / day / venue",
                "ILLUSTRATIVE DEMO DATA — REPLACE WITH FIELD DATA",
                "Baseline field research conducted at banquet halls and cafeterias.",
                true
        ));

        baselineMetricRepository.save(new BaselineMetric(
                "DATA_POINT_B",
                "Time taken to identify and redistribute surplus food",
                "Manual telephone coordination and transit dispatch latency before platform intervention.",
                210.0,
                "minutes",
                "ILLUSTRATIVE DEMO DATA — REPLACE WITH FIELD DATA",
                "Average latency measured across 12 manual surplus donation phone calls in Hyderabad.",
                true
        ));

        baselineMetricRepository.save(new BaselineMetric(
                "QUANTITY_PREPARED",
                "Average quantity prepared per banquet",
                "Total meal servings cooked per average event.",
                450.0,
                "meals",
                "ILLUSTRATIVE DEMO DATA — REPLACE WITH FIELD DATA",
                "Surveyed banquet caterers in Hyderabad.",
                true
        ));

        baselineMetricRepository.save(new BaselineMetric(
                "QUANTITY_DISCARDED",
                "Percentage of prepared food discarded",
                "Ratio of prepared food discarded directly to municipal bins.",
                18.2,
                "%",
                "ILLUSTRATIVE DEMO DATA — REPLACE WITH FIELD DATA",
                "Estimated municipal waste stream share from food hospitality venues.",
                true
        ));

        // Trigger analytics calculation
        analyticsService.recalculateImpactMetrics();

        logger.info("Seed data successfully loaded with demo credentials:");
        logger.info("ADMIN: admin@demo.local / DemoPass123!");
        logger.info("PROVIDER: provider@demo.local / DemoPass123!");
        logger.info("RECEIVER: receiver@demo.local / DemoPass123!");
        logger.info("VOLUNTEER: volunteer@demo.local / DemoPass123!");
    }
}

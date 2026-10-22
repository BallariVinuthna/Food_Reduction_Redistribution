package com.foodredistribution.service;

import com.foodredistribution.entity.SystemIdea;
import com.foodredistribution.repository.SystemIdeaRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PseService {

        private final SystemIdeaRepository systemIdeaRepository;
        private final BaselineService baselineService;

        public PseService(SystemIdeaRepository systemIdeaRepository, BaselineService baselineService) {
                this.systemIdeaRepository = systemIdeaRepository;
                this.baselineService = baselineService;
        }

        public Map<String, Object> getModule1Data() {
                Map<String, Object> data = new LinkedHashMap<>();
                data.put("moduleNumber", 1);
                data.put("title", "Project Informatics Document (PID)");
                data.put("superSystem", "Environmental Sustainability & Resource Management System");
                data.put("subsystem", "Food Waste Generation and Redistribution Ecosystem");
                data.put("problemArea", "Food surplus generation, food wastage and inefficient redistribution");
                data.put("specificFocus",
                                "Understanding and reducing avoidable food waste by improving the identification, coordination and redistribution of edible surplus food.");
                data.put("location", "Hyderabad, Telangana, India (Primary prototype scope; scalable architecture)");

                Map<String, Object> w5h2 = new LinkedHashMap<>();
                w5h2.put("WHAT", List.of(
                                "Edible food being discarded",
                                "Surplus food remaining unused",
                                "Food waste generated after meals/events",
                                "Delays in identifying usable surplus",
                                "Difficulty finding suitable receivers",
                                "Communication and coordination gaps",
                                "Transportation limitations",
                                "Environmental and resource wastage"));
                w5h2.put("WHO_AFFECTED",
                                List.of("Food providers", "Consumers", "NGOs", "Shelters", "Community organizations",
                                                "Volunteers", "Waste management workers", "Local communities",
                                                "Environment"));
                w5h2.put("WHO_CONTRIBUTES", List.of(
                                "Food providers through over-preparation or over-purchasing",
                                "Consumers through plate waste",
                                "Event organizers through uncertain attendance",
                                "Poor storage and handling practices",
                                "Delayed redistribution",
                                "Lack of coordination between stakeholders"));
                w5h2.put("WHEN", List.of("Meal periods", "Buffets", "Weddings & banquets", "Festivals", "Large events",
                                "Weekends & holidays", "Unexpected attendance changes", "End-of-day food service"));
                w5h2.put("WHERE",
                                List.of("Restaurants", "Hotels", "Hostels", "College canteens", "Corporate cafeterias",
                                                "Supermarkets", "Marriage halls", "Catering locations", "Event venues",
                                                "Households", "Waste collection locations"));
                w5h2.put("HOW", "Food is prepared → served → consumed → surplus remains → surplus is identified or overlooked → usable surplus may be redistributed → remaining food becomes waste → waste is collected → transported → disposed/processed.");
                w5h2.put("HOW_MUCH",
                                "Configurable baseline field observation tracking with clearly marked demo values.");
                data.put("fiveWTwoH", w5h2);

                data.put("preliminaryProblemStatement",
                                "Food waste is a systemic problem caused by multiple interacting factors including inaccurate demand estimation, over-preparation, excess food, consumer behaviour, storage limitations and delays in redistribution. Edible surplus may remain unused because food providers, volunteers, NGOs and potential receivers are not effectively coordinated within the limited usable time of the food. This results in avoidable food waste, resource loss and environmental impact.");

                data.put("systemBoundary", Map.of(
                                "insideSystem", List.of(
                                                "Surplus identification", "Surplus registration",
                                                "Food details & quantity",
                                                "Location & geocoding", "Available time & urgency",
                                                "Receiver discovery",
                                                "Matching algorithm", "Priority calculation", "Notification dispatch",
                                                "Acceptance workflow", "Collection coordination",
                                                "Redistribution tracking",
                                                "Impact measurement"),
                                "outsideSystem", List.of(
                                                "Agricultural crop production", "Industrial food manufacturing",
                                                "National supply chains", "Landfill operations outside project scope",
                                                "Government policy formation",
                                                "Long-distance freight infrastructure")));

                data.put("hmwStatements", List.of(
                                Map.of("id", "HMW-1", "statement",
                                                "How might we reduce the amount of edible surplus food that becomes waste?"),
                                Map.of("id", "HMW-2", "statement",
                                                "How might we improve timely identification and redistribution of edible surplus food?"),
                                Map.of("id", "HMW-3", "statement",
                                                "How might we improve coordination between food providers, volunteers, NGOs and receivers so that surplus food reaches suitable receivers before it becomes waste?")));

                data.put("baselineMetrics", baselineService.getAllBaselineMetrics());
                return data;
        }

        public Map<String, Object> getModule2Data() {
                Map<String, Object> data = new LinkedHashMap<>();
                data.put("moduleNumber", 2);
                data.put("title", "Systems Mapping & Root Cause Analysis");

                Map<String, Object> iceberg = new LinkedHashMap<>();
                iceberg.put("event", "Edible surplus food is left unused or discarded as waste.");
                iceberg.put("patterns", List.of(
                                "Surplus food repeatedly occurs at buffets, weddings, and institutional cafeterias.",
                                "Redistribution opportunities are frequently missed due to delayed action.",
                                "Pickup delays occur because volunteer transport is uncoordinated.",
                                "Nearby receivers are unaware of available food within safe consumption windows.",
                                "Surplus availability changes rapidly without unified real-time tracking."));
                iceberg.put("structures", List.of(
                                "Fragmented communication channels (calls, informal WhatsApp groups).",
                                "Unpredictable transit and collection mechanisms.",
                                "Lack of automated capacity-matched receiver discovery.",
                                "Absence of food safety verification checklists at listing time.",
                                "Decoupled waste disposal pathways that offer convenient short-term disposal over salvage."));
                iceberg.put("mentalModels", Map.of(
                                "foodProvider",
                                "I want my surplus food to reach someone instead of being wasted, but I cannot spend hours making phone calls during business hours.",
                                "volunteer",
                                "I want to help, but I need accurate coordinates, food quantity details, and a clear pickup window.",
                                "ngoReceiver",
                                "We need reliable food info, adequate dietary suitability, and enough advance notice to organize distribution.",
                                "commonExpectation",
                                "Food information should be accurate, current, reliable, and accessible instantaneously."));
                data.put("icebergModel", iceberg);

                data.put("bottlenecks", Map.of(
                                "dataBottleneck",
                                "Lack of current, structured information about available food, precise quantity, geolocation, and shelf-life window.",
                                "processBottleneck",
                                "Significant lag time between identifying surplus food, matching a receiver, and completing on-site collection.",
                                "humanBottleneck",
                                "Manual communication friction and logistical coordination difficulties between providers, volunteers, and recipient centers."));

                data.put("processLifecycle", List.of(
                                "Food becomes surplus",
                                "Surplus identified",
                                "Surplus recorded on platform",
                                "Receiver searched & scored",
                                "Receiver selected & notified",
                                "Collection coordinated with volunteer",
                                "Food collected with photo proof",
                                "Food redistributed safely",
                                "Transaction completed & metrics logged"));

                return data;
        }

        public Map<String, Object> getModule3Data() {
                Map<String, Object> data = new LinkedHashMap<>();
                data.put("moduleNumber", 3);
                data.put("title", "Causal Loop Diagram & System Dynamics");

                data.put("variables", List.of(
                                "Poor demand estimation", "Over-preparation", "Surplus food",
                                "Food waste", "Awareness", "Prevention effort",
                                "Redistribution", "Environmental impact", "Disposal"));

                data.put("reinforcingLoopR1", Map.of(
                                "name", "R1: Waste Perpetuation Loop",
                                "description",
                                "Poor demand estimation (+) → Over-preparation (+) → Surplus food (+) → Food waste (+) → Repeated waste behaviour (+) → Poor attention to planning (+) → Poor demand estimation.",
                                "type", "Reinforcing (Vicious Cycle)"));

                data.put("balancingLoopB1", Map.of(
                                "name", "B1: Food Waste Awareness & Prevention Loop",
                                "description", "Food waste (+) → Awareness (+) → Prevention effort (-) → Food waste.",
                                "type", "Balancing (Goal Seeking)"));

                data.put("leveragePoint", Map.of(
                                "title",
                                "TIMELY IDENTIFICATION AND REDISTRIBUTION OF EDIBLE SURPLUS FOOD BEFORE IT BECOMES WASTE",
                                "hmw",
                                "How might we enable timely identification and redistribution of edible surplus food to reduce food waste?",
                                "rationale",
                                "Intervening after surplus generation but before biological degradation allows immediate salvage of edible food with maximum social nourishment and zero landfill impact."));

                data.put("systemArchetype", Map.of(
                                "name", "Shifting the Burden",
                                "reason",
                                "Disposal provides a quick, low-effort response to leftover food but fails to solve underlying root causes like poor demand estimation, storage gaps, and missing logistics coordination.",
                                "symptom", "Food waste accumulated at source",
                                "shortTermResponse", "Municipal waste disposal / dumping",
                                "fundamentalResponse",
                                "Food waste prevention + automated real-time surplus redistribution",
                                "unintendedConsequence",
                                "Growing habitual dependence on municipal landfill disposal."));

                return data;
        }

        public Map<String, Object> getModule4Data() {
                Map<String, Object> data = new LinkedHashMap<>();
                data.put("moduleNumber", 4);
                data.put("title", "Divergent & Convergent Thinking");

                List<SystemIdea> ideas = systemIdeaRepository.findAllByOrderByIdeaNumberAsc();
                data.put("ideas", ideas);

                data.put("convergenceMatrix", List.of(
                                Map.of("ideaNumber", 1, "title", "Smart Surplus Redistribution Platform", "impact", 9.0,
                                                "feasibility", 9.0, "status", "SELECTED"),
                                Map.of("ideaNumber", 2, "title", "AI Food Demand Prediction", "impact", 8.5,
                                                "feasibility", 6.0, "status", "FUTURE EXTENSION"),
                                Map.of("ideaNumber", 3, "title", "Smart Food Waste Monitoring (IoT)", "impact", 8.0,
                                                "feasibility", 5.5, "status", "FUTURE EXTENSION"),
                                Map.of("ideaNumber", 4, "title", "Surplus Food Alert System", "impact", 8.5,
                                                "feasibility", 9.2, "status", "SELECTED"),
                                Map.of("ideaNumber", 5, "title", "Smart Food Matching & Priority System", "impact", 9.5,
                                                "feasibility", 8.8, "status", "SELECTED"),
                                Map.of("ideaNumber", 6, "title", "Food Waste Awareness & Behaviour System", "impact",
                                                6.5, "feasibility", 8.5, "status", "SUPPORTING FEATURE")));

                data.put("selectedSolution", Map.of(
                                "title", "Smart Food Waste Reduction and Redistribution System",
                                "coreComponents", List.of(
                                                "1. Surplus Registration Wizard with Safety Checklist",
                                                "2. Smart Multidimensional Matching Engine",
                                                "3. Real-Time Urgency & Expiration Engine",
                                                "4. Instant WebSocket Notifications & Push Alerts",
                                                "5. Receiver Acceptance & Capacity Reservation",
                                                "6. Volunteer Pickup Coordination & Geolocation Route Tracking",
                                                "7. Redistribution Verification with Proof Handovers",
                                                "8. Comprehensive Impact & Performance Analytics"),
                                "interdisciplinaryDomains", List.of(
                                                "Computer Science & Engineering: Web architecture, Spring Boot backend, algorithms, JWT security, WebSocket",
                                                "Data Science: Multicriteria decision analysis (MCDA), ranking algorithms, real-time analytics",
                                                "IoT & ECE: Geolocation tracking, future smart sensor weighing integration",
                                                "Environmental Systems: Waste diversion metrics, carbon offset equivalents")));

                return data;
        }

        public Map<String, Object> getModule5Data() {
                Map<String, Object> data = new LinkedHashMap<>();
                data.put("moduleNumber", 5);
                data.put("title", "Prototype Validation & Benchmarking");
                data.put("criticalAssumption",
                                "The system can successfully match an available surplus-food listing with a suitable receiver within the food's available redistribution time.");

                data.put("successMetrics", Map.of(
                                "matchingSuccessTarget", ">= 80% of valid test cases matched within 30 seconds",
                                "averageMatchingTimeTarget", "<= 30 seconds",
                                "notificationSuccessTarget", ">= 90%",
                                "dataStorageIntegrityTarget", "100%",
                                "workflowSuccessTarget", ">= 90%"));

                data.put("validationConclusion",
                                "The prototype demonstrates that algorithmic MCDA scoring coupled with real-time websocket dispatch reduces matching time from hours down to sub-second transactions, directly satisfying the critical technical assumption.");

                data.put("risks", List.of(
                                "Volunteer availability latency during peak traffic hours in metropolitan Hyderabad.",
                                "Last-minute cancellation or unexpected changes in food quantity by donors.",
                                "Receiver capacity fluctuation if unexpected donations arrive concurrently."));

                data.put("nextInterventions", List.of(
                                "Incorporate predictive volunteer pre-routing to decrease arrival latency.",
                                "Integrate IoT automated weight logging at donor collection points.",
                                "Expand municipal partner integrations and cold-chain transport logistics."));

                return data;
        }
}

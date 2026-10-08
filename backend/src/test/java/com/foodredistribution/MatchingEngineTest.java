package com.foodredistribution;

import com.foodredistribution.entity.*;
import com.foodredistribution.matching.MatchingEngine;
import com.foodredistribution.repository.AdminConfigRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class MatchingEngineTest {

    private MatchingEngine matchingEngine;
    private AdminConfigRepository adminConfigRepository;

    @BeforeEach
    void setUp() {
        adminConfigRepository = Mockito.mock(AdminConfigRepository.class);
        AdminConfig config = new AdminConfig();
        config.setWeightDistance(0.30);
        config.setWeightQuantity(0.20);
        config.setWeightUrgency(0.20);
        config.setWeightFoodType(0.15);
        config.setWeightCapacity(0.10);
        config.setWeightAvailability(0.05);
        config.setMaxSearchRadiusKm(25.0);

        Mockito.when(adminConfigRepository.findFirstByOrderByUpdatedAtDesc()).thenReturn(Optional.of(config));
        matchingEngine = new MatchingEngine(adminConfigRepository);
    }

    @Test
    void testHaversineDistanceCalculations() {
        // Banjara Hills (17.4156, 78.4487) to Secunderabad (17.4411, 78.4983) ≈ 5.9 km
        double distance = MatchingEngine.calculateHaversineDistance(17.4156, 78.4487, 17.4411, 78.4983);
        assertTrue(distance > 4.0 && distance < 8.0, "Distance should be approximately 5-6 km");
    }

    @Test
    void testRankedMatchingPriority() {
        FoodProvider provider = new FoodProvider();
        provider.setLatitude(17.4156);
        provider.setLongitude(78.4350);

        // Provider: 50 meals, available for 90 minutes
        FoodListing listing = new FoodListing();
        listing.setProvider(provider);
        listing.setFoodName("Cooked Rice & Dal");
        listing.setFoodCategory("COOKED_MEALS");
        listing.setQuantity(50.0);
        listing.setUnit("MEALS");
        listing.setAvailableUntil(LocalDateTime.now().plusMinutes(90));
        listing.setLatitude(17.4156);
        listing.setLongitude(78.4350);
        listing.setVegetarian(true);
        listing.recalculateUrgency();

        // Receiver A: Distance ≈ 2 km, Capacity = 60 meals, Available = true
        Receiver receiverA = new Receiver();
        receiverA.setOrganizationName("Receiver A (Nearby)");
        receiverA.setLatitude(17.4250);
        receiverA.setLongitude(78.4450);
        receiverA.setCapacityMeals(60);
        receiverA.setAvailable(true);
        receiverA.setReliabilityScore(98.0);
        receiverA.setDietaryPreference("ANY");

        // Receiver B: Distance ≈ 8 km, Capacity = 20 meals, Available = true
        Receiver receiverB = new Receiver();
        receiverB.setOrganizationName("Receiver B (Distant)");
        receiverB.setLatitude(17.4800);
        receiverB.setLongitude(78.4900);
        receiverB.setCapacityMeals(20);
        receiverB.setAvailable(true);
        receiverB.setReliabilityScore(90.0);
        receiverB.setDietaryPreference("ANY");

        List<MatchingEngine.MatchCandidate> candidates = matchingEngine.findRankedMatches(listing, List.of(receiverA, receiverB));

        assertEquals(2, candidates.size());
        // Receiver A should rank #1 with a higher match score than Receiver B
        assertEquals("Receiver A (Nearby)", candidates.get(0).getReceiver().getOrganizationName());
        assertTrue(candidates.get(0).getTotalScore() > candidates.get(1).getTotalScore(),
                "Receiver A should receive a higher score than Receiver B");
    }
}

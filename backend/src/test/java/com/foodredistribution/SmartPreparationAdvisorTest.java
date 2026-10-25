package com.foodredistribution;

import com.foodredistribution.dto.*;
import com.foodredistribution.entity.*;
import com.foodredistribution.repository.*;
import com.foodredistribution.service.SurplusPredictionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class SmartPreparationAdvisorTest {

    @Mock
    private SurplusPredictionRepository repository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FoodProviderRepository foodProviderRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private SurplusPredictionService service;

    private User demoProviderUser;
    private FoodProvider demoProvider;

    @BeforeEach
    void setUp() {
        demoProviderUser = new User("provider@demo.local", "hashed", "Taj Banjara Kitchens", "+91 9876543211", Role.FOOD_PROVIDER);
        demoProviderUser.setId(UUID.randomUUID());

        demoProvider = new FoodProvider(demoProviderUser, "Taj Banjara Grand Hotel", "HOTEL", "Banjara Hills", 17.4156, 78.4487, "Chef Anirudh", "+91 9876543211");
        demoProvider.setId(UUID.randomUUID());

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("provider@demo.local");
        when(userRepository.findByEmail("provider@demo.local")).thenReturn(Optional.of(demoProviderUser));
        when(foodProviderRepository.findByUser(demoProviderUser)).thenReturn(Optional.of(demoProvider));
    }

    @Test
    @DisplayName("1. Preparation Entry: Successfully validates and computes remaining quantity")
    void testCreatePreparationRecordSuccess() {
        FoodPreparationEntryRequest request = new FoodPreparationEntryRequest();
        request.setFoodItemName("Hyderabadi Chicken Biryani");
        request.setFoodCategory("COOKED_MEALS");
        request.setMealPeriod("LUNCH");
        request.setRecordDate(LocalDate.now());
        request.setQuantityPrepared(100.0);
        request.setQuantityConsumed(80.0);
        request.setQuantityDonated(10.0);
        request.setQuantityDiscarded(5.0);
        request.setUnit("PORTIONS");

        when(repository.existsByProviderIdAndFoodItemNameIgnoreCaseAndMealPeriodAndRecordDate(anyString(), anyString(), anyString(), any())).thenReturn(false);
        when(repository.save(any(SurplusPredictionRecord.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SurplusPredictionRecord saved = service.createPreparationRecord(request, authentication);

        assertNotNull(saved);
        assertEquals("Hyderabadi Chicken Biryani", saved.getFoodItemName());
        assertEquals(100.0, saved.getQuantityPrepared());
        assertEquals(80.0, saved.getQuantityConsumed());
        assertEquals(10.0, saved.getQuantityDonated());
        assertEquals(5.0, saved.getQuantityDiscarded());
        // Remaining = 100 - (80 + 10 + 5) = 5.0
        assertEquals(5.0, saved.getQuantityRemaining());
    }

    @Test
    @DisplayName("2. Validation: Rejects negative quantities")
    void testRejectsNegativeQuantities() {
        FoodPreparationEntryRequest request = new FoodPreparationEntryRequest();
        request.setFoodItemName("Veg Pulao");
        request.setFoodCategory("COOKED_MEALS");
        request.setMealPeriod("DINNER");
        request.setRecordDate(LocalDate.now());
        request.setQuantityPrepared(-50.0); // Negative!
        request.setQuantityConsumed(40.0);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            service.createPreparationRecord(request, authentication);
        });
        assertTrue(ex.getMessage().contains("cannot be negative"));
    }

    @Test
    @DisplayName("3. Conservation Rule: Rejects when served + donated + discarded exceeds prepared")
    void testRejectsOverDistributedQuantity() {
        FoodPreparationEntryRequest request = new FoodPreparationEntryRequest();
        request.setFoodItemName("Paneer Butter Masala");
        request.setFoodCategory("COOKED_MEALS");
        request.setMealPeriod("LUNCH");
        request.setRecordDate(LocalDate.now());
        request.setQuantityPrepared(50.0);
        request.setQuantityConsumed(45.0);
        request.setQuantityDonated(10.0); // 45 + 10 = 55 > 50!
        request.setQuantityDiscarded(0.0);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            service.createPreparationRecord(request, authentication);
        });
        assertTrue(ex.getMessage().contains("cannot exceed Quantity Prepared"));
    }

    @Test
    @DisplayName("4. Duplicate Prevention: Prevents accidental duplicate submissions on same date/meal")
    void testRejectsDuplicateSubmission() {
        FoodPreparationEntryRequest request = new FoodPreparationEntryRequest();
        request.setFoodItemName("Chicken Biryani");
        request.setFoodCategory("COOKED_MEALS");
        request.setMealPeriod("LUNCH");
        request.setRecordDate(LocalDate.of(2026, 10, 25));
        request.setQuantityPrepared(80.0);
        request.setQuantityConsumed(70.0);

        when(repository.existsByProviderIdAndFoodItemNameIgnoreCaseAndMealPeriodAndRecordDate(
                anyString(), eq("Chicken Biryani"), eq("LUNCH"), eq(LocalDate.of(2026, 10, 25))
        )).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            service.createPreparationRecord(request, authentication);
        });
        assertTrue(ex.getMessage().contains("already exists"));
    }

    @Test
    @DisplayName("5. Smart Demand Prediction: Handles insufficient data (<3 records) with honest transparency")
    void testPredictionInsufficientDataHandling() {
        // Return only 1 record
        SurplusPredictionRecord r1 = new SurplusPredictionRecord(
                demoProvider.getId().toString(), "Taj Banjara", "Veg Biryani", "COOKED_MEALS",
                "MONDAY", "LUNCH", 80.0, 60.0, 10.0, 5.0, "PORTIONS"
        );
        when(repository.findHistoricalSeries(anyString(), anyString(), anyString()))
                .thenReturn(List.of(r1));

        SmartPreparationPredictionDto prediction = service.getSmartDemandPrediction(
                demoProvider.getId().toString(), "Veg Biryani", "LUNCH", LocalDate.now(), 10.0, authentication
        );

        assertNotNull(prediction);
        assertEquals("LOW", prediction.getConfidenceLevel());
        assertFalse(prediction.isSufficientData());
        assertTrue(prediction.getExplanation().contains("Preliminary forecast based on 1 observation"));
    }

    @Test
    @DisplayName("6. Smart Demand Prediction: Applies day-of-week weighted averages and safety buffer")
    void testPredictionWithSufficientDataAndDayOfWeekPattern() {
        String pid = demoProvider.getId().toString();
        LocalDate wednesdayDate = LocalDate.of(2026, 10, 28); // Wednesday

        List<SurplusPredictionRecord> history = new ArrayList<>();
        // 4 Wednesday records (Wed demand ~80)
        for (int i = 0; i < 4; i++) {
            SurplusPredictionRecord r = new SurplusPredictionRecord(
                    pid, "Taj Banjara", "Biryani", "COOKED_MEALS", "WEDNESDAY", "LUNCH", 100.0, 80.0, 10.0, 5.0, "PORTIONS"
            );
            r.setDayOfWeek("WEDNESDAY");
            history.add(r);
        }
        // 4 other day records (demand ~60)
        for (int i = 0; i < 4; i++) {
            SurplusPredictionRecord r = new SurplusPredictionRecord(
                    pid, "Taj Banjara", "Biryani", "COOKED_MEALS", "MONDAY", "LUNCH", 80.0, 60.0, 10.0, 5.0, "PORTIONS"
            );
            r.setDayOfWeek("MONDAY");
            history.add(r);
        }

        when(repository.findHistoricalSeries(pid, "Biryani", "LUNCH")).thenReturn(history);

        SmartPreparationPredictionDto prediction = service.getSmartDemandPrediction(
                pid, "Biryani", "LUNCH", wednesdayDate, 10.0, authentication
        );

        assertNotNull(prediction);
        assertTrue(prediction.isSufficientData());
        assertEquals("HIGH", prediction.getConfidenceLevel());
        // dowAvg = 80, overallAvg = 70. Weighted = 0.65*80 + 0.35*70 = 52 + 24.5 = 76.5
        assertEquals(76.5, prediction.getPredictedDemand(), 0.5);
        // Recommended prep = 76.5 * 1.10 = ~84 portions
        assertEquals(84.0, prediction.getRecommendedPreparation(), 1.0);
        assertTrue(prediction.getEstimatedAvoidableSurplus() > 0);
    }

    @Test
    @DisplayName("7. Provider Isolation: Rejects access when trying to query another provider's data")
    void testProviderDataIsolation() {
        String unauthorizedOtherProviderId = UUID.randomUUID().toString();

        assertThrows(AccessDeniedException.class, () -> {
            service.resolveProvider(authentication, unauthorizedOtherProviderId);
        });
    }

    @Test
    @DisplayName("8. Redistribution Handoff: Pre-fills donation details for remaining edible surplus")
    void testDonationHandoffFlow() {
        SurplusPredictionRecord record = new SurplusPredictionRecord(
                demoProvider.getId().toString(), "Taj Banjara", "Tandoori Roti & Dal", "COOKED_MEALS",
                "FRIDAY", "DINNER", 120.0, 90.0, 0.0, 0.0, "PORTIONS"
        );
        record.setId("rec-test-123");
        record.setQuantityRemaining(30.0); // 30 remaining
        record.setRecordDate(LocalDate.now());

        when(repository.findById("rec-test-123")).thenReturn(Optional.of(record));

        Map<String, Object> handoff = service.prepareDonationHandoff("rec-test-123", authentication);

        assertNotNull(handoff);
        assertEquals("rec-test-123", handoff.get("sourceRecordId"));
        assertEquals("Tandoori Roti & Dal", handoff.get("foodName"));
        assertEquals(30.0, handoff.get("quantity"));
        assertEquals("PORTIONS", handoff.get("unit"));
        assertEquals("HEATED_CONTAINER", handoff.get("storageCondition"));
    }
}

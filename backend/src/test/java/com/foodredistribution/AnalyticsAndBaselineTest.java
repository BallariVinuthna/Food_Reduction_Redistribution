package com.foodredistribution;

import com.foodredistribution.dto.DashboardAnalyticsDto;
import com.foodredistribution.entity.*;
import com.foodredistribution.repository.*;
import com.foodredistribution.service.AnalyticsService;
import com.foodredistribution.service.BaselineService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class AnalyticsAndBaselineTest {

    @Mock
    private FoodListingRepository foodListingRepository;
    @Mock
    private MatchRepository matchRepository;
    @Mock
    private PickupAssignmentRepository pickupAssignmentRepository;
    @Mock
    private DonationTransactionRepository donationTransactionRepository;
    @Mock
    private FieldWasteRecordRepository fieldWasteRecordRepository;
    @Mock
    private FoodProviderRepository foodProviderRepository;
    @Mock
    private ReceiverRepository receiverRepository;
    @Mock
    private VolunteerRepository volunteerRepository;
    @Mock
    private ImpactMetricRepository impactMetricRepository;
    @Mock
    private BaselineMetricRepository baselineMetricRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    @InjectMocks
    private BaselineService baselineService;

    @Test
    @DisplayName("Analytics: Empty database returns hasData=false and null for transit averages (no hardcoded fallbacks)")
    void testEmptyAnalyticsCalculation() {
        when(foodListingRepository.findAll()).thenReturn(Collections.emptyList());

        DashboardAnalyticsDto analytics = analyticsService.getDashboardAnalytics();

        assertNotNull(analytics);
        assertFalse(analytics.isHasData());
        assertEquals(0, analytics.getTotalListings());
        assertEquals(0.0, analytics.getTotalQuantityListedMeals());
        assertEquals(0.0, analytics.getTotalQuantityRedistributedMeals());
        assertEquals(0.0, analytics.getActualVerifiedDeliveredMeals());
        assertNull(analytics.getAveragePickupTimeMinutes(), "Empty database should have null average pickup time, not hardcoded 24.5");
        assertNull(analytics.getAverageMatchingTimeSeconds(), "Empty database should have null average matching time, not hardcoded 1.8");
    }

    @Test
    @DisplayName("Baseline Comparability: Incompatible units are rejected without calculating invalid percentage")
    void testBaselineIncompatibleUnitsRejected() {
        BaselineMetric metric = new BaselineMetric();
        metric.setMetricKey("RESTAURANT_WASTE_PER_MEAL");
        metric.setMetricName("Restaurant Food Waste per Meal");
        metric.setBaselineValue(180.0);
        metric.setUnit("GRAMS");
        metric.setDemo(false);

        when(baselineMetricRepository.findByMetricKey("RESTAURANT_WASTE_PER_MEAL"))
                .thenReturn(Optional.of(metric));

        // Post intervention value measured in LITERS instead of GRAMS
        Map<String, Object> result = baselineService.calculateInterventionImprovement(
                "RESTAURANT_WASTE_PER_MEAL", 12.0, "LITERS", "Banjara Hills", false);

        assertFalse((Boolean) result.get("isComparable"));
        assertEquals("INCOMPARABLE_UNITS", result.get("validationStatus"));
        assertNull(result.get("improvementPercentage"));
        assertTrue(result.get("explanation").toString().contains("Incompatible units"));
    }

    @Test
    @DisplayName("Baseline Comparability: Real-world comparable units compute validated improvement percentage")
    void testBaselineValidComparison() {
        BaselineMetric metric = new BaselineMetric();
        metric.setMetricKey("RESTAURANT_WASTE_PER_MEAL");
        metric.setMetricName("Restaurant Food Waste per Meal");
        metric.setBaselineValue(200.0);
        metric.setUnit("GRAMS");
        metric.setDemo(false);

        when(baselineMetricRepository.findByMetricKey("RESTAURANT_WASTE_PER_MEAL"))
                .thenReturn(Optional.of(metric));

        // Post intervention: 150 GRAMS (25% reduction)
        Map<String, Object> result = baselineService.calculateInterventionImprovement(
                "RESTAURANT_WASTE_PER_MEAL", 150.0, "GRAMS", "Banjara Hills", false);

        assertTrue((Boolean) result.get("isComparable"));
        assertEquals("VERIFIED_FIELD_IMPROVEMENT", result.get("validationStatus"));
        assertEquals(25.0, (Double) result.get("improvementPercentage"));
    }

    @Test
    @DisplayName("Baseline Comparability: Demo data is explicitly flagged for prototype illustration only")
    void testBaselineDemoDataFlagged() {
        BaselineMetric metric = new BaselineMetric();
        metric.setMetricKey("RESTAURANT_WASTE_PER_MEAL");
        metric.setBaselineValue(200.0);
        metric.setUnit("GRAMS");
        metric.setDemo(true); // Demo flag set

        when(baselineMetricRepository.findByMetricKey("RESTAURANT_WASTE_PER_MEAL"))
                .thenReturn(Optional.of(metric));

        Map<String, Object> result = baselineService.calculateInterventionImprovement(
                "RESTAURANT_WASTE_PER_MEAL", 150.0, "GRAMS", "Banjara Hills", false);

        assertEquals("DEMO_ILLUSTRATION_ONLY", result.get("validationStatus"));
        assertTrue(result.get("explanation").toString().contains("NOTICE: One or both metrics are flagged as DEMO data"));
    }
}

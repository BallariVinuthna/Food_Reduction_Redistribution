package com.foodredistribution;

import com.foodredistribution.dto.BenchmarkRunDto;
import com.foodredistribution.dto.PrototypeValidationReportDto;
import com.foodredistribution.entity.BenchmarkRun;
import com.foodredistribution.entity.FoodProvider;
import com.foodredistribution.entity.PrototypeTest;
import com.foodredistribution.entity.Receiver;
import com.foodredistribution.matching.MatchingEngine;
import com.foodredistribution.repository.BenchmarkRunRepository;
import com.foodredistribution.repository.FoodProviderRepository;
import com.foodredistribution.repository.PrototypeTestRepository;
import com.foodredistribution.repository.ReceiverRepository;
import com.foodredistribution.service.PrototypeTestService;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class BenchmarkRunTest {

    @Mock
    private MatchingEngine matchingEngine;
    @Mock
    private ReceiverRepository receiverRepository;
    @Mock
    private PrototypeTestRepository prototypeTestRepository;
    @Mock
    private BenchmarkRunRepository benchmarkRunRepository;
    @Mock
    private FoodProviderRepository foodProviderRepository;

    @InjectMocks
    private PrototypeTestService prototypeTestService;

    @Test
    @DisplayName("Benchmark Simulation: Generates unique SIM- run ID, tests 20 scenarios, and flags as simulation")
    void testBenchmarkSimulationExecution() {
        Receiver r1 = new Receiver();
        r1.setId(UUID.randomUUID());
        r1.setOrganizationName("Akshaya Patra Foundation");
        r1.setLatitude(17.4150);
        r1.setLongitude(78.4350);
        r1.setCapacityMeals(200);

        FoodProvider p1 = new FoodProvider();
        p1.setId(UUID.randomUUID());
        p1.setOrganizationName("Taj Krishna Banjara");
        p1.setLatitude(17.4156);
        p1.setLongitude(78.4350);

        when(receiverRepository.findAll()).thenReturn(List.of(r1));
        when(foodProviderRepository.findAll()).thenReturn(List.of(p1));
        when(benchmarkRunRepository.save(any(BenchmarkRun.class))).thenAnswer(invocation -> {
            BenchmarkRun b = invocation.getArgument(0);
            if (b.getId() == null) b.setId(UUID.randomUUID());
            return b;
        });
        when(prototypeTestRepository.save(any(PrototypeTest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PrototypeValidationReportDto report = prototypeTestService.runBenchmarkSimulation();

        assertNotNull(report);
        assertTrue(report.getRunId().startsWith("SIM-"), "Run ID must start with SIM- prefix");
        assertTrue(report.isSimulation(), "Benchmark run must be explicitly flagged as simulation");
        assertEquals(20, report.getTotalTestCases(), "Must execute all 20 predefined Hyderabad benchmark scenarios");
        assertNotNull(report.getValidationOutcome());
        assertNotNull(report.getNextInterventionRecommendation());
    }

    @Test
    @DisplayName("Benchmark History: Preserves multiple distinct runs")
    void testMultipleRunsPreserved() {
        BenchmarkRun run1 = new BenchmarkRun();
        run1.setId(UUID.randomUUID());
        run1.setRunId("SIM-20261019-120000-ABCDEF");
        run1.setSimulation(true);
        run1.setTotalScenarios(20);
        run1.setValidationOutcome("PASS");

        BenchmarkRun run2 = new BenchmarkRun();
        run2.setId(UUID.randomUUID());
        run2.setRunId("SIM-20261019-123000-FEDCBA");
        run2.setSimulation(true);
        run2.setTotalScenarios(20);
        run2.setValidationOutcome("PASS");

        when(benchmarkRunRepository.findAllByOrderByExecutedAtDesc()).thenReturn(List.of(run2, run1));

        List<BenchmarkRunDto> runs = prototypeTestService.getAllBenchmarkRuns();
        assertEquals(2, runs.size());
        assertNotEquals(runs.get(0).getRunId(), runs.get(1).getRunId());
    }
}

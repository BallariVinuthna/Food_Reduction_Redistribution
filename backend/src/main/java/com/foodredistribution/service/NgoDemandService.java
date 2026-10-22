package com.foodredistribution.service;

import com.foodredistribution.entity.FoodListing;
import com.foodredistribution.entity.NgoDemandRequest;
import com.foodredistribution.repository.FoodListingRepository;
import com.foodredistribution.repository.NgoDemandRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class NgoDemandService {

    private static final Logger logger = LoggerFactory.getLogger(NgoDemandService.class);

    private final NgoDemandRepository demandRepository;
    private final FoodListingRepository foodListingRepository;

    public NgoDemandService(NgoDemandRepository demandRepository, FoodListingRepository foodListingRepository) {
        this.demandRepository = demandRepository;
        this.foodListingRepository = foodListingRepository;
    }

    @Transactional
    public NgoDemandRequest createDemandRequest(NgoDemandRequest request) {
        if (request.getRequestedDate() == null) {
            request.setRequestedDate(LocalDate.now());
        }
        if (request.getStatus() == null) {
            request.setStatus("OPEN");
        }
        return demandRepository.save(request);
    }

    @Transactional(readOnly = true)
    public List<NgoDemandRequest> getUpcomingDemands(LocalDate fromDate) {
        LocalDate start = fromDate != null ? fromDate : LocalDate.now();
        List<NgoDemandRequest> list = demandRepository.findByRequestedDateGreaterThanEqualOrderByRequestedDateAsc(start);
        if (list.isEmpty()) {
            return seedDemoDemandCalendar();
        }
        return list;
    }

    @Transactional(readOnly = true)
    public List<NgoDemandRequest> getReceiverDemands(String receiverId) {
        return demandRepository.findByReceiverIdOrderByRequestedDateDesc(receiverId);
    }

    /**
     * Match NGO demand with currently available surplus listings.
     */
    @Transactional
    public Map<String, Object> matchDemandWithSurplus(String demandId) {
        NgoDemandRequest demand = demandRepository.findById(demandId)
                .orElseThrow(() -> new IllegalArgumentException("Demand request not found: " + demandId));

        List<FoodListing> available = foodListingRepository.findActiveSurplus(java.time.LocalDateTime.now());
        List<Map<String, Object>> compatibleListings = new ArrayList<>();

        double required = demand.getServingsRequired();
        double remainingNeeded = required - (demand.getFulfilledServings() != null ? demand.getFulfilledServings() : 0.0);

        for (FoodListing l : available) {
            boolean categoryMatch = demand.getFoodCategory() == null ||
                    demand.getFoodCategory().equalsIgnoreCase("ANY") ||
                    (l.getFoodCategory() != null && l.getFoodCategory().equalsIgnoreCase(demand.getFoodCategory()));
            boolean dietaryMatch = demand.getDietaryPreference() == null ||
                    demand.getDietaryPreference().equalsIgnoreCase("ANY") ||
                    (demand.getDietaryPreference().equalsIgnoreCase("VEGETARIAN") && l.isVegetarian());

            if (categoryMatch && dietaryMatch) {
                double matchQty = Math.min(remainingNeeded, l.getRemainingQuantity() != null ? l.getRemainingQuantity() : l.getQuantity());
                Map<String, Object> matchInfo = new HashMap<>();
                matchInfo.put("listingId", l.getId());
                matchInfo.put("foodName", l.getFoodName());
                matchInfo.put("providerName", l.getProvider() != null ? l.getProvider().getOrganizationName() : "Donor Kitchen");
                matchInfo.put("availableQuantity", l.getRemainingQuantity() != null ? l.getRemainingQuantity() : l.getQuantity());
                matchInfo.put("compatibleServings", matchQty);
                matchInfo.put("address", l.getAddress());
                matchInfo.put("availableUntil", l.getAvailableUntil());
                compatibleListings.add(matchInfo);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("demandId", demandId);
        result.put("receiverName", demand.getReceiverName());
        result.put("requestedDate", demand.getRequestedDate());
        result.put("mealPeriod", demand.getMealPeriod());
        result.put("requiredServings", required);
        result.put("fulfilledServings", demand.getFulfilledServings());
        result.put("remainingNeeded", remainingNeeded);
        result.put("compatibleListings", compatibleListings);

        return result;
    }

    private List<NgoDemandRequest> seedDemoDemandCalendar() {
        List<NgoDemandRequest> seeds = new ArrayList<>();
        LocalDate today = LocalDate.now();

        NgoDemandRequest d1 = new NgoDemandRequest(
                "rec-rha",
                "Robin Hood Army Hyderabad",
                today,
                "LUNCH",
                "COOKED_MEALS",
                80,
                80.0,
                "MEALS",
                "VEGETARIAN",
                "Anand Rao",
                "+91 9876543212"
        );
        d1.setFulfilledServings(50.0);
        d1.setStatus("PARTIALLY_MATCHED");
        d1.setNotes("Mid-day shelter meal for Cherlapally community");
        seeds.add(demandRepository.save(d1));

        NgoDemandRequest d2 = new NgoDemandRequest(
                "rec-sphoorti",
                "Sphoorti Children Community Home",
                today.plusDays(1),
                "DINNER",
                "COOKED_MEALS",
                45,
                45.0,
                "MEALS",
                "ANY",
                "Srivani K",
                "+91 9876543218"
        );
        d2.setStatus("OPEN");
        d2.setNotes("Evening dinner for resident children");
        seeds.add(demandRepository.save(d2));

        NgoDemandRequest d3 = new NgoDemandRequest(
                "rec-amrapali",
                "Amrapali Old Age Home",
                today.plusDays(2),
                "BREAKFAST",
                "BAKERY_BREAD",
                35,
                35.0,
                "SERVINGS",
                "VEGETARIAN",
                "Dr. Meenakshi",
                "+91 9876543219"
        );
        d3.setStatus("OPEN");
        d3.setNotes("Soft breads and idli for elder residents");
        seeds.add(demandRepository.save(d3));

        return seeds;
    }
}

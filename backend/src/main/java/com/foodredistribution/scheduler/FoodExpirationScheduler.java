package com.foodredistribution.scheduler;

import com.foodredistribution.service.FoodListingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class FoodExpirationScheduler {

    private static final Logger logger = LoggerFactory.getLogger(FoodExpirationScheduler.class);
    private final FoodListingService foodListingService;

    public FoodExpirationScheduler(FoodListingService foodListingService) {
        this.foodListingService = foodListingService;
    }

    // Runs every 60 seconds to check for food listings that have exceeded their available redistribution window
    @Scheduled(fixedRate = 60000)
    public void runExpirationCheck() {
        try {
            foodListingService.checkAndExpireListings();
        } catch (Exception e) {
            logger.error("Error in food expiration scheduler: ", e);
        }
    }
}

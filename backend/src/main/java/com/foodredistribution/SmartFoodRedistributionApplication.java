package com.foodredistribution;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartFoodRedistributionApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartFoodRedistributionApplication.class, args);
    }
}

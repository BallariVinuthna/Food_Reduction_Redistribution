package com.foodredistribution.repository;

import com.foodredistribution.entity.FoodListing;
import com.foodredistribution.entity.FoodSafetyCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FoodSafetyCheckRepository extends JpaRepository<FoodSafetyCheck, UUID> {
    Optional<FoodSafetyCheck> findByFoodListing(FoodListing foodListing);
    Optional<FoodSafetyCheck> findByFoodListingId(UUID foodListingId);
}

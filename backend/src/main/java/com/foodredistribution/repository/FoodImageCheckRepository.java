package com.foodredistribution.repository;

import com.foodredistribution.entity.FoodImageCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodImageCheckRepository extends JpaRepository<FoodImageCheck, String> {
    List<FoodImageCheck> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}

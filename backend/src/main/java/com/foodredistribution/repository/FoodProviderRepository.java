package com.foodredistribution.repository;

import com.foodredistribution.entity.FoodProvider;
import com.foodredistribution.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FoodProviderRepository extends JpaRepository<FoodProvider, UUID> {
    Optional<FoodProvider> findByUser(User user);
    Optional<FoodProvider> findByUserId(UUID userId);
}

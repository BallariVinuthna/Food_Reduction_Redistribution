package com.foodredistribution.repository;

import com.foodredistribution.entity.FoodListing;
import com.foodredistribution.entity.FoodProvider;
import com.foodredistribution.entity.FoodStatus;
import com.foodredistribution.entity.UrgencyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface FoodListingRepository extends JpaRepository<FoodListing, UUID> {
    List<FoodListing> findByProvider(FoodProvider provider);
    List<FoodListing> findByProviderId(UUID providerId);
    List<FoodListing> findByStatus(FoodStatus status);
    List<FoodListing> findByStatusIn(List<FoodStatus> statuses);
    Page<FoodListing> findByStatusIn(List<FoodStatus> statuses, Pageable pageable);

    @Query("SELECT f FROM FoodListing f WHERE f.status = 'AVAILABLE' AND f.availableUntil > :now ORDER BY f.availableUntil ASC")
    List<FoodListing> findActiveSurplus(@Param("now") LocalDateTime now);

    List<FoodListing> findByUrgencyLevelAndStatus(UrgencyLevel urgencyLevel, FoodStatus status);

    @Query("SELECT f FROM FoodListing f WHERE f.status = 'AVAILABLE' AND f.availableUntil <= :now")
    List<FoodListing> findExpiredPendingListings(@Param("now") LocalDateTime now);

    long countByStatus(FoodStatus status);
}

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

    @Query("SELECT f FROM FoodListing f WHERE " +
           "(:status IS NULL OR f.status = :status) AND " +
           "(:category IS NULL OR f.foodCategory = :category) AND " +
           "(:locality IS NULL OR f.address LIKE %:locality%) AND " +
           "(:startDate IS NULL OR f.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR f.createdAt <= :endDate) " +
           "ORDER BY f.createdAt DESC")
    Page<FoodListing> searchListings(
            @Param("status") FoodStatus status,
            @Param("category") String category,
            @Param("locality") String locality,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(f.quantity), 0.0) FROM FoodListing f WHERE " +
           "(:startDate IS NULL OR f.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR f.createdAt <= :endDate)")
    Double sumQuantityListedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(f.quantity), 0.0) FROM FoodListing f WHERE f.status = 'REDISTRIBUTED' AND " +
           "(:startDate IS NULL OR f.updatedAt >= :startDate) AND " +
           "(:endDate IS NULL OR f.updatedAt <= :endDate)")
    Double sumQuantityRedistributedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT f.foodCategory, COUNT(f), COALESCE(SUM(f.quantity), 0.0) " +
           "FROM FoodListing f WHERE " +
           "(:startDate IS NULL OR f.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR f.createdAt <= :endDate) " +
           "GROUP BY f.foodCategory")
    List<Object[]> getListingCountsByCategory(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT f.provider.address, COUNT(f), COALESCE(SUM(f.quantity), 0.0) " +
           "FROM FoodListing f WHERE " +
           "(:startDate IS NULL OR f.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR f.createdAt <= :endDate) " +
           "GROUP BY f.provider.address")
    List<Object[]> getListingCountsByLocality(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}

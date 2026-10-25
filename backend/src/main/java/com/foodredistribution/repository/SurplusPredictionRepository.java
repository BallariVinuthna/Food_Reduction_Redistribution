package com.foodredistribution.repository;

import com.foodredistribution.entity.SurplusPredictionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SurplusPredictionRepository extends JpaRepository<SurplusPredictionRecord, String> {
    List<SurplusPredictionRecord> findByProviderIdOrderByRecordDateDesc(String providerId);

    List<SurplusPredictionRecord> findByProviderIdAndRecordDateBetweenOrderByRecordDateDesc(
            String providerId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT r FROM SurplusPredictionRecord r WHERE r.providerId = :providerId " +
           "AND LOWER(r.foodItemName) = LOWER(:item) AND r.mealPeriod = :mealPeriod ORDER BY r.recordDate DESC")
    List<SurplusPredictionRecord> findHistoricalSeries(@Param("providerId") String providerId,
                                                       @Param("item") String item,
                                                       @Param("mealPeriod") String mealPeriod);

    @Query("SELECT r FROM SurplusPredictionRecord r WHERE r.providerId = :providerId " +
           "AND LOWER(r.foodItemName) = LOWER(:item) ORDER BY r.recordDate DESC")
    List<SurplusPredictionRecord> findByProviderAndFoodItem(@Param("providerId") String providerId,
                                                            @Param("item") String item);

    Optional<SurplusPredictionRecord> findByProviderIdAndFoodItemNameIgnoreCaseAndMealPeriodAndRecordDate(
            String providerId, String foodItemName, String mealPeriod, LocalDate recordDate);

    boolean existsByProviderIdAndFoodItemNameIgnoreCaseAndMealPeriodAndRecordDate(
            String providerId, String foodItemName, String mealPeriod, LocalDate recordDate);

    @Query("SELECT DISTINCT r.foodItemName FROM SurplusPredictionRecord r WHERE r.providerId = :providerId ORDER BY r.foodItemName ASC")
    List<String> findDistinctFoodItemNamesByProviderId(@Param("providerId") String providerId);
}

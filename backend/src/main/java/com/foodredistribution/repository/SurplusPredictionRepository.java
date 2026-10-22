package com.foodredistribution.repository;

import com.foodredistribution.entity.SurplusPredictionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurplusPredictionRepository extends JpaRepository<SurplusPredictionRecord, String> {
    List<SurplusPredictionRecord> findByProviderIdOrderByRecordDateDesc(String providerId);

    @Query("SELECT r FROM SurplusPredictionRecord r WHERE r.providerId = :providerId AND r.foodItemName = :item AND r.mealPeriod = :mealPeriod")
    List<SurplusPredictionRecord> findHistoricalSeries(@Param("providerId") String providerId,
                                                       @Param("item") String item,
                                                       @Param("mealPeriod") String mealPeriod);
}

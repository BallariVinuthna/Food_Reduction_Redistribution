package com.foodredistribution.repository;

import com.foodredistribution.entity.FieldWasteRecord;
import com.foodredistribution.entity.VerificationStatus;
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
public interface FieldWasteRecordRepository extends JpaRepository<FieldWasteRecord, UUID> {

    List<FieldWasteRecord> findByIsDemo(boolean isDemo);
    Page<FieldWasteRecord> findByIsDemo(boolean isDemo, Pageable pageable);
    List<FieldWasteRecord> findByVerificationStatus(VerificationStatus status);

    @Query("SELECT r FROM FieldWasteRecord r WHERE " +
           "(:isDemo IS NULL OR r.isDemo = :isDemo) AND " +
           "(:locality IS NULL OR r.locality = :locality) AND " +
           "(:foodCategory IS NULL OR r.foodCategory = :foodCategory) AND " +
           "(:startDate IS NULL OR r.observationPeriodStart >= :startDate) AND " +
           "(:endDate IS NULL OR r.observationPeriodEnd <= :endDate) " +
           "ORDER BY r.observationPeriodStart DESC")
    Page<FieldWasteRecord> searchRecords(
            @Param("isDemo") Boolean isDemo,
            @Param("locality") String locality,
            @Param("foodCategory") String foodCategory,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(r.quantity), 0.0) FROM FieldWasteRecord r WHERE r.isDemo = false AND r.unit = :unit")
    Double sumVerifiedWasteQuantityByUnit(@Param("unit") String unit);

    @Query("SELECT r.venueType, COUNT(r), COALESCE(SUM(r.quantity), 0.0), r.unit " +
           "FROM FieldWasteRecord r WHERE r.isDemo = :isDemo " +
           "GROUP BY r.venueType, r.unit")
    List<Object[]> getWasteByVenueType(@Param("isDemo") boolean isDemo);

    @Query("SELECT r.locality, COUNT(r), COALESCE(SUM(r.quantity), 0.0), r.unit " +
           "FROM FieldWasteRecord r WHERE r.isDemo = :isDemo " +
           "GROUP BY r.locality, r.unit")
    List<Object[]> getWasteByLocality(@Param("isDemo") boolean isDemo);

    long countByIsDemo(boolean isDemo);
    long countByIsDemoAndVerificationStatus(boolean isDemo, VerificationStatus status);
}

package com.foodredistribution.repository;

import com.foodredistribution.entity.WasteDiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WasteDiaryRepository extends JpaRepository<WasteDiaryEntry, String> {
    List<WasteDiaryEntry> findByProviderIdOrderByEntryDateDesc(String providerId);
    List<WasteDiaryEntry> findAllByOrderByEntryDateDesc();
    List<WasteDiaryEntry> findByEntryDateBetweenOrderByEntryDateDesc(LocalDate startDate, LocalDate endDate);
}

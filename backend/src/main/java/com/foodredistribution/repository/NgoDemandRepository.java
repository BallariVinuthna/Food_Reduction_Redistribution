package com.foodredistribution.repository;

import com.foodredistribution.entity.NgoDemandRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface NgoDemandRepository extends JpaRepository<NgoDemandRequest, String> {
    List<NgoDemandRequest> findByReceiverIdOrderByRequestedDateDesc(String receiverId);
    List<NgoDemandRequest> findByRequestedDateGreaterThanEqualOrderByRequestedDateAsc(LocalDate fromDate);
    List<NgoDemandRequest> findByStatusOrderByRequestedDateAsc(String status);
}

package com.foodredistribution.repository;

import com.foodredistribution.entity.Match;
import com.foodredistribution.entity.PickupAssignment;
import com.foodredistribution.entity.PickupStatus;
import com.foodredistribution.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PickupAssignmentRepository extends JpaRepository<PickupAssignment, UUID> {
    Optional<PickupAssignment> findByMatch(Match match);
    Optional<PickupAssignment> findByMatchId(UUID matchId);
    List<PickupAssignment> findByVolunteer(Volunteer volunteer);
    List<PickupAssignment> findByVolunteerId(UUID volunteerId);
    List<PickupAssignment> findByStatus(PickupStatus status);
    List<PickupAssignment> findByStatusIn(List<PickupStatus> statuses);
    long countByStatus(PickupStatus status);
    Optional<PickupAssignment> findByPickupOtp(String pickupOtp);
    Optional<PickupAssignment> findByDeliveryOtp(String deliveryOtp);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM PickupAssignment p WHERE p.status = 'DELIVERED' AND p.assignedAt IS NOT NULL AND p.deliveredAt IS NOT NULL AND " +
           "(:startDate IS NULL OR p.deliveredAt >= :startDate) AND " +
           "(:endDate IS NULL OR p.deliveredAt <= :endDate)")
    List<PickupAssignment> findCompletedPickupsBetween(
            @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
            @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate
    );

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(p) FROM PickupAssignment p WHERE p.status = 'FAILED' AND " +
           "(:startDate IS NULL OR p.assignedAt >= :startDate) AND " +
           "(:endDate IS NULL OR p.assignedAt <= :endDate)")
    long countFailedPickupsBetween(
            @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
            @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate
    );
}

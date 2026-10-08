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
}

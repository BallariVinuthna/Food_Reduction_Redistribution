package com.foodredistribution.repository;

import com.foodredistribution.entity.PickupAssignment;
import com.foodredistribution.entity.PickupEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PickupEventRepository extends JpaRepository<PickupEvent, UUID> {
    List<PickupEvent> findByPickupAssignment(PickupAssignment pickupAssignment);
    List<PickupEvent> findByPickupAssignmentIdOrderByTimestampAsc(UUID pickupAssignmentId);
}

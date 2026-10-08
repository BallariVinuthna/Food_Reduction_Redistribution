package com.foodredistribution.repository;

import com.foodredistribution.entity.User;
import com.foodredistribution.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, UUID> {
    Optional<Volunteer> findByUser(User user);
    Optional<Volunteer> findByUserId(UUID userId);
    List<Volunteer> findByIsAvailableTrue();
}

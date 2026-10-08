package com.foodredistribution.repository;

import com.foodredistribution.entity.Receiver;
import com.foodredistribution.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReceiverRepository extends JpaRepository<Receiver, UUID> {
    Optional<Receiver> findByUser(User user);
    Optional<Receiver> findByUserId(UUID userId);
    List<Receiver> findByIsAvailableTrue();
}

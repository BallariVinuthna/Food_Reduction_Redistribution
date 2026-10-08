package com.foodredistribution.repository;

import com.foodredistribution.entity.AdminConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminConfigRepository extends JpaRepository<AdminConfig, UUID> {
    Optional<AdminConfig> findFirstByOrderByUpdatedAtDesc();
}

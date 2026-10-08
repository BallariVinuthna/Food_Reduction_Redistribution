package com.foodredistribution.repository;

import com.foodredistribution.entity.SystemIdea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SystemIdeaRepository extends JpaRepository<SystemIdea, UUID> {
    List<SystemIdea> findAllByOrderByIdeaNumberAsc();
    Optional<SystemIdea> findByIdeaNumber(Integer ideaNumber);
}

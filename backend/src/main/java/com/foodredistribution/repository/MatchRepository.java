package com.foodredistribution.repository;

import com.foodredistribution.entity.FoodListing;
import com.foodredistribution.entity.Match;
import com.foodredistribution.entity.MatchStatus;
import com.foodredistribution.entity.Receiver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MatchRepository extends JpaRepository<Match, UUID> {
    List<Match> findByFoodListing(FoodListing foodListing);
    List<Match> findByFoodListingId(UUID foodListingId);
    List<Match> findByFoodListingIdOrderByMatchScoreDesc(UUID foodListingId);
    List<Match> findByReceiver(Receiver receiver);
    List<Match> findByReceiverId(UUID receiverId);
    List<Match> findByReceiverIdAndStatus(UUID receiverId, MatchStatus status);
    Optional<Match> findFirstByFoodListingIdAndStatusOrderByMatchScoreDesc(UUID foodListingId, MatchStatus status);
    long countByStatus(MatchStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(m) FROM Match m WHERE " +
           "(:startDate IS NULL OR m.proposedAt >= :startDate) AND " +
           "(:endDate IS NULL OR m.proposedAt <= :endDate)")
    long countBetween(@Param("startDate") java.time.LocalDateTime startDate, @Param("endDate") java.time.LocalDateTime endDate);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(m) FROM Match m WHERE m.status = 'ACCEPTED' AND " +
           "(:startDate IS NULL OR m.respondedAt >= :startDate) AND " +
           "(:endDate IS NULL OR m.respondedAt <= :endDate)")
    long countAcceptedBetween(@Param("startDate") java.time.LocalDateTime startDate, @Param("endDate") java.time.LocalDateTime endDate);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(AVG(m.executionTimeMs), 0.0) FROM Match m WHERE m.executionTimeMs IS NOT NULL AND " +
           "(:startDate IS NULL OR m.proposedAt >= :startDate) AND " +
           "(:endDate IS NULL OR m.proposedAt <= :endDate)")
    Double avgExecutionTimeMsBetween(@Param("startDate") java.time.LocalDateTime startDate, @Param("endDate") java.time.LocalDateTime endDate);
}

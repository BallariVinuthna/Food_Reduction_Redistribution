package com.foodredistribution.repository;

import com.foodredistribution.entity.FoodListing;
import com.foodredistribution.entity.Match;
import com.foodredistribution.entity.MatchStatus;
import com.foodredistribution.entity.Receiver;
import org.springframework.data.jpa.repository.JpaRepository;
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
}

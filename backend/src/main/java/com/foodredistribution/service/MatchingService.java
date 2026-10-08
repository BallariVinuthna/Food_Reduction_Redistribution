package com.foodredistribution.service;

import com.foodredistribution.dto.AcceptMatchRequest;
import com.foodredistribution.dto.MatchDto;
import com.foodredistribution.entity.*;
import com.foodredistribution.exception.BadRequestException;
import com.foodredistribution.exception.ResourceNotFoundException;
import com.foodredistribution.matching.MatchingEngine;
import com.foodredistribution.repository.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private final MatchingEngine matchingEngine;
    private final FoodListingRepository foodListingRepository;
    private final ReceiverRepository receiverRepository;
    private final MatchRepository matchRepository;
    private final PickupAssignmentRepository pickupAssignmentRepository;
    private final VolunteerRepository volunteerRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;
    private final SimpMessagingTemplate messagingTemplate;

    public MatchingService(MatchingEngine matchingEngine,
                           FoodListingRepository foodListingRepository,
                           ReceiverRepository receiverRepository,
                           MatchRepository matchRepository,
                           PickupAssignmentRepository pickupAssignmentRepository,
                           VolunteerRepository volunteerRepository,
                           NotificationService notificationService,
                           AuditService auditService,
                           SimpMessagingTemplate messagingTemplate) {
        this.matchingEngine = matchingEngine;
        this.foodListingRepository = foodListingRepository;
        this.receiverRepository = receiverRepository;
        this.matchRepository = matchRepository;
        this.pickupAssignmentRepository = pickupAssignmentRepository;
        this.volunteerRepository = volunteerRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public List<MatchDto> generateMatchesForListing(UUID foodListingId) {
        FoodListing listing = foodListingRepository.findById(foodListingId)
                .orElseThrow(() -> new ResourceNotFoundException("Food listing not found: " + foodListingId));

        if (listing.getStatus() != FoodStatus.AVAILABLE) {
            throw new BadRequestException("Listing is not in AVAILABLE status: " + listing.getStatus());
        }

        List<Receiver> availableReceivers = receiverRepository.findByIsAvailableTrue();
        List<MatchingEngine.MatchCandidate> candidates = matchingEngine.findRankedMatches(listing, availableReceivers);

        List<Match> savedMatches = new ArrayList<>();

        for (MatchingEngine.MatchCandidate cand : candidates) {
            // Check if existing match proposal exists
            Match match = new Match(
                    listing,
                    cand.getReceiver(),
                    cand.getTotalScore(),
                    cand.getLocationScore(),
                    cand.getQuantityScore(),
                    cand.getUrgencyScore(),
                    cand.getFoodTypeScore(),
                    cand.getCapacityScore(),
                    cand.getReliabilityScore(),
                    cand.getDistanceKm(),
                    cand.getEstimatedPickupMinutes()
            );
            match = matchRepository.save(match);
            savedMatches.add(match);
        }

        // Notify top receiver(s)
        if (!savedMatches.isEmpty()) {
            Match topMatch = savedMatches.get(0);
            topMatch.setStatus(MatchStatus.NOTIFIED);
            matchRepository.save(topMatch);

            listing.setStatus(FoodStatus.RESERVED);
            foodListingRepository.save(listing);

            notificationService.createAndSend(
                    topMatch.getReceiver().getUser(),
                    "New Surplus Food Available (" + topMatch.getMatchScore() + "% Match)",
                    "Urgent: " + listing.getQuantity() + " " + listing.getUnit() + " of " + listing.getFoodName()
                            + " available " + topMatch.getDistanceKm() + " km away. Approx "
                            + (listing.getAvailableMinutesRemaining() != null ? listing.getAvailableMinutesRemaining() : 60)
                            + " mins remaining.",
                    NotificationType.SUITABLE_RECEIVER_FOUND,
                    topMatch.getId().toString()
            );

            auditService.log("SYSTEM", "MATCH_GENERATED", "Match", topMatch.getId().toString(),
                    "Top match generated for receiver: " + topMatch.getReceiver().getOrganizationName() + " with score " + topMatch.getMatchScore());
        } else {
            // Fallback: No nearby receiver found within search radius
            auditService.log("SYSTEM", "MATCH_FALLBACK", "FoodListing", listing.getId().toString(),
                    "No receiver found within boundary. Triggered fallback coordination alert.");
        }

        return savedMatches.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<MatchDto> getMatchesForListing(UUID foodListingId) {
        return matchRepository.findByFoodListingIdOrderByMatchScoreDesc(foodListingId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<MatchDto> getReceiverMatches(UUID receiverId) {
        return matchRepository.findByReceiverId(receiverId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MatchDto acceptMatch(UUID matchId, AcceptMatchRequest req, String userEmail) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found: " + matchId));

        if (match.getStatus() == MatchStatus.ACCEPTED) {
            throw new BadRequestException("Match has already been accepted");
        }

        FoodListing listing = match.getFoodListing();
        match.setStatus(MatchStatus.ACCEPTED);
        match.setRespondedAt(LocalDateTime.now());
        if (req != null && req.getNotes() != null) {
            match.setResponseNotes(req.getNotes());
        }
        match = matchRepository.save(match);

        // Update listing status
        listing.setStatus(FoodStatus.ACCEPTED);
        foodListingRepository.save(listing);

        // Automatically assign volunteer or pick nearest available
        Volunteer assignedVolunteer = null;
        if (req != null && req.getVolunteerId() != null) {
            assignedVolunteer = volunteerRepository.findById(req.getVolunteerId()).orElse(null);
        }
        if (assignedVolunteer == null) {
            List<Volunteer> available = volunteerRepository.findByIsAvailableTrue();
            if (!available.isEmpty()) {
                assignedVolunteer = available.get(0);
            }
        }

        PickupAssignment pickup = new PickupAssignment(match, assignedVolunteer);
        if (assignedVolunteer != null) {
            pickup.setStatus(PickupStatus.ASSIGNED);
            assignedVolunteer.setActivePickupsCount(assignedVolunteer.getActivePickupsCount() + 1);
            volunteerRepository.save(assignedVolunteer);
        }
        pickup = pickupAssignmentRepository.save(pickup);

        listing.setStatus(FoodStatus.PICKUP_ASSIGNED);
        foodListingRepository.save(listing);

        // Reject other pending proposals for this food listing
        List<Match> otherMatches = matchRepository.findByFoodListingId(listing.getId());
        for (Match other : otherMatches) {
            if (!other.getId().equals(match.getId()) && other.getStatus() != MatchStatus.ACCEPTED) {
                other.setStatus(MatchStatus.REJECTED);
                other.setResponseNotes("Food accepted by another receiver");
                matchRepository.save(other);
            }
        }

        // Notify Food Provider
        notificationService.createAndSend(
                listing.getProvider().getUser(),
                "Surplus Food Accepted!",
                match.getReceiver().getOrganizationName() + " has accepted " + listing.getQuantity() + " " + listing.getUnit() + " of " + listing.getFoodName(),
                NotificationType.FOOD_ACCEPTED,
                pickup.getId().toString()
        );

        // Notify Volunteer if assigned
        if (assignedVolunteer != null) {
            notificationService.createAndSend(
                    assignedVolunteer.getUser(),
                    "New Pickup Task Assigned",
                    "Pickup " + listing.getFoodName() + " from " + listing.getProvider().getOrganizationName() + " and deliver to " + match.getReceiver().getOrganizationName(),
                    NotificationType.PICKUP_ASSIGNED,
                    pickup.getId().toString()
            );
        }

        auditService.log(userEmail, "ACCEPT_MATCH", "Match", match.getId().toString(),
                "Receiver accepted match. Pickup assignment created: " + pickup.getId());

        try {
            messagingTemplate.convertAndSend("/topic/matches/accepted", mapToDto(match));
        } catch (Exception ignored) {}

        return mapToDto(match);
    }

    @Transactional
    public MatchDto rejectMatch(UUID matchId, String reason, String userEmail) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found: " + matchId));

        match.setStatus(MatchStatus.REJECTED);
        match.setRespondedAt(LocalDateTime.now());
        match.setResponseNotes(reason);
        match = matchRepository.save(match);

        auditService.log(userEmail, "REJECT_MATCH", "Match", match.getId().toString(), "Match rejected: " + reason);

        // Fallback Logic: Trigger notification to next candidate
        FoodListing listing = match.getFoodListing();
        List<Match> pendingMatches = matchRepository.findByFoodListingIdOrderByMatchScoreDesc(listing.getId());
        Match nextMatch = null;
        for (Match candidate : pendingMatches) {
            if (candidate.getStatus() == MatchStatus.PROPOSED) {
                nextMatch = candidate;
                break;
            }
        }

        if (nextMatch != null) {
            nextMatch.setStatus(MatchStatus.NOTIFIED);
            matchRepository.save(nextMatch);

            notificationService.createAndSend(
                    nextMatch.getReceiver().getUser(),
                    "Surplus Food Available (" + nextMatch.getMatchScore() + "% Match)",
                    "Alternative match: " + listing.getQuantity() + " " + listing.getUnit() + " of " + listing.getFoodName()
                            + " available " + nextMatch.getDistanceKm() + " km away.",
                    NotificationType.SUITABLE_RECEIVER_FOUND,
                    nextMatch.getId().toString()
            );

            auditService.log("SYSTEM", "FALLBACK_NEXT_RECEIVER", "Match", nextMatch.getId().toString(),
                    "Top receiver rejected. Fallback notified next receiver: " + nextMatch.getReceiver().getOrganizationName());
        } else {
            // Reopen listing status
            listing.setStatus(FoodStatus.AVAILABLE);
            foodListingRepository.save(listing);

            auditService.log("SYSTEM", "FALLBACK_NO_MORE_RECEIVERS", "FoodListing", listing.getId().toString(),
                    "All ranked receivers rejected. Listing returned to pool.");
        }

        return mapToDto(match);
    }

    public MatchDto mapToDto(Match m) {
        MatchDto dto = new MatchDto();
        dto.setId(m.getId());
        dto.setFoodListingId(m.getFoodListing().getId());
        dto.setFoodName(m.getFoodListing().getFoodName());
        dto.setQuantity(m.getFoodListing().getQuantity());
        dto.setUnit(m.getFoodListing().getUnit());
        dto.setReceiverId(m.getReceiver().getId());
        dto.setReceiverOrganizationName(m.getReceiver().getOrganizationName());
        dto.setReceiverAddress(m.getReceiver().getAddress());
        dto.setReceiverLatitude(m.getReceiver().getLatitude());
        dto.setReceiverLongitude(m.getReceiver().getLongitude());
        dto.setReceiverPhone(m.getReceiver().getContactPhone());
        dto.setMatchScore(m.getMatchScore());
        dto.setLocationScore(m.getLocationScore());
        dto.setQuantityScore(m.getQuantityScore());
        dto.setUrgencyScore(m.getUrgencyScore());
        dto.setFoodTypeScore(m.getFoodTypeScore());
        dto.setCapacityScore(m.getCapacityScore());
        dto.setReliabilityScore(m.getReliabilityScore());
        dto.setDistanceKm(m.getDistanceKm());
        dto.setEstimatedPickupMinutes(m.getEstimatedPickupMinutes());
        dto.setStatus(m.getStatus());
        dto.setProposedAt(m.getProposedAt());
        dto.setRespondedAt(m.getRespondedAt());
        dto.setResponseNotes(m.getResponseNotes());
        return dto;
    }
}

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
    private final PickupEventRepository pickupEventRepository;
    private final VolunteerRepository volunteerRepository;
    private final DonationTransactionService donationTransactionService;
    private final NotificationService notificationService;
    private final AuditService auditService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public MatchingService(MatchingEngine matchingEngine,
                           FoodListingRepository foodListingRepository,
                           ReceiverRepository receiverRepository,
                           MatchRepository matchRepository,
                           PickupAssignmentRepository pickupAssignmentRepository,
                           PickupEventRepository pickupEventRepository,
                           VolunteerRepository volunteerRepository,
                           DonationTransactionService donationTransactionService,
                           NotificationService notificationService,
                           AuditService auditService,
                           SimpMessagingTemplate messagingTemplate,
                           UserRepository userRepository) {
        this.matchingEngine = matchingEngine;
        this.foodListingRepository = foodListingRepository;
        this.receiverRepository = receiverRepository;
        this.matchRepository = matchRepository;
        this.pickupAssignmentRepository = pickupAssignmentRepository;
        this.pickupEventRepository = pickupEventRepository;
        this.volunteerRepository = volunteerRepository;
        this.donationTransactionService = donationTransactionService;
        this.notificationService = notificationService;
        this.auditService = auditService;
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<MatchDto> generateMatchesForListing(UUID foodListingId) {
        FoodListing listing = foodListingRepository.findById(foodListingId)
                .orElseThrow(() -> new ResourceNotFoundException("Food listing not found: " + foodListingId));

        if (listing.getStatus() != FoodStatus.AVAILABLE && listing.getStatus() != FoodStatus.RESERVED) {
            throw new BadRequestException("Listing is not available for matching: " + listing.getStatus());
        }

        UUID attemptId = UUID.randomUUID();
        long startNano = System.nanoTime();

        List<Receiver> availableReceivers = receiverRepository.findByIsAvailableTrue();
        List<MatchingEngine.MatchCandidate> candidates = matchingEngine.findRankedMatches(listing, availableReceivers);
        long elapsedMs = (System.nanoTime() - startNano) / 1_000_000;

        List<Match> savedMatches = new ArrayList<>();

        for (MatchingEngine.MatchCandidate cand : candidates) {
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
            match.setAttemptId(attemptId);
            match.setRequestedQuantity(listing.getQuantity());
            match.setAllocatedQuantity(cand.getAllocatedQuantity());
            match.setSplitAllocation(cand.isSplitAllocation());
            match.setSplitBatchNumber(cand.getSplitBatchNumber());
            match.setExecutionTimeMs(elapsedMs);

            match = matchRepository.save(match);
            savedMatches.add(match);
        }

        // Notify top receiver
        if (!savedMatches.isEmpty()) {
            Match topMatch = savedMatches.get(0);
            topMatch.setStatus(MatchStatus.NOTIFIED);
            matchRepository.save(topMatch);

            listing.setStatus(FoodStatus.RESERVED);
            foodListingRepository.save(listing);

            notificationService.createAndSend(
                    topMatch.getReceiver().getUser(),
                    "New Surplus Food Available (" + topMatch.getMatchScore() + "% Match)",
                    "Urgent: " + topMatch.getAllocatedQuantity() + " " + listing.getUnit() + " of " + listing.getFoodName()
                            + " available " + topMatch.getDistanceKm() + " km away. Approx "
                            + (listing.getAvailableMinutesRemaining() != null ? listing.getAvailableMinutesRemaining() : 60)
                            + " mins remaining.",
                    NotificationType.SUITABLE_RECEIVER_FOUND,
                    topMatch.getId().toString()
            );

            auditService.log("SYSTEM", "MATCH_GENERATED", "Match", topMatch.getId().toString(),
                    "Top match generated for receiver: " + topMatch.getReceiver().getOrganizationName()
                            + " with score " + topMatch.getMatchScore() + " (Attempt: " + attemptId + ")");
        } else {
            auditService.log("SYSTEM", "MATCH_FALLBACK", "FoodListing", listing.getId().toString(),
                    "No receiver found within boundary for attempt: " + attemptId);
        }

        return savedMatches.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    /**
     * Proposes split batches across multiple receivers when surplus volume is high.
     */
    @Transactional
    public List<MatchDto> generateSplitMatchesForListing(UUID foodListingId) {
        FoodListing listing = foodListingRepository.findById(foodListingId)
                .orElseThrow(() -> new ResourceNotFoundException("Food listing not found: " + foodListingId));

        UUID attemptId = UUID.randomUUID();
        long startNano = System.nanoTime();

        List<Receiver> availableReceivers = receiverRepository.findByIsAvailableTrue();
        List<MatchingEngine.MatchCandidate> splits = matchingEngine.findSplitAllocationMatches(listing, availableReceivers);
        long elapsedMs = (System.nanoTime() - startNano) / 1_000_000;

        List<Match> saved = new ArrayList<>();
        for (MatchingEngine.MatchCandidate cand : splits) {
            Match m = new Match(
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
            m.setAttemptId(attemptId);
            m.setRequestedQuantity(listing.getQuantity());
            m.setAllocatedQuantity(cand.getAllocatedQuantity());
            m.setSplitAllocation(true);
            m.setSplitBatchNumber(cand.getSplitBatchNumber());
            m.setExecutionTimeMs(elapsedMs);
            m.setStatus(MatchStatus.PROPOSED);
            saved.add(matchRepository.save(m));
        }

        auditService.log("SYSTEM", "SPLIT_MATCHES_GENERATED", "FoodListing", listing.getId().toString(),
                "Generated " + saved.size() + " split allocation proposals across Hyderabad receivers");

        return saved.stream().map(this::mapToDto).collect(Collectors.toList());
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

        // 1. Volunteer assignment
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

        // 2. Create durable double-entry donation transaction with concurrency locking
        DonationTransaction tx = donationTransactionService.createTransaction(match, assignedVolunteer);

        // 3. Update match status
        match.setStatus(MatchStatus.ACCEPTED);
        match.setRespondedAt(LocalDateTime.now());
        if (req != null && req.getNotes() != null) {
            match.setResponseNotes(req.getNotes());
        }
        match = matchRepository.save(match);

        // 4. Create pickup assignment with synchronous OTPs
        PickupAssignment pickup = new PickupAssignment(match, assignedVolunteer);
        pickup.setPickupOtp(tx.getPickupOtp());
        pickup.setDeliveryOtp(tx.getDeliveryOtp());
        pickup.setStatus(PickupStatus.ASSIGNED);

        if (assignedVolunteer != null) {
            assignedVolunteer.setActivePickupsCount(assignedVolunteer.getActivePickupsCount() + 1);
            volunteerRepository.save(assignedVolunteer);
        }
        pickup = pickupAssignmentRepository.save(pickup);

        // 5. Append-only event history: ASSIGNED
        PickupEvent event = new PickupEvent(
                pickup,
                userEmail,
                "RECEIVER",
                null,
                PickupStatus.ASSIGNED,
                tx.getQuantityReserved(),
                "SYSTEM_ACCEPT",
                listing.getLatitude(),
                listing.getLongitude(),
                "Match accepted by " + match.getReceiver().getOrganizationName() + ". Transaction created: " + tx.getId()
        );
        pickupEventRepository.save(event);

        // 6. Update listing status
        listing.setStatus(FoodStatus.PICKUP_ASSIGNED);
        foodListingRepository.save(listing);

        // 7. Reject other non-split proposals for this batch
        if (!match.isSplitAllocation()) {
            List<Match> otherMatches = matchRepository.findByFoodListingId(listing.getId());
            for (Match other : otherMatches) {
                if (!other.getId().equals(match.getId()) && other.getStatus() != MatchStatus.ACCEPTED) {
                    other.setStatus(MatchStatus.REJECTED);
                    other.setResponseNotes("Food accepted by another receiver");
                    matchRepository.save(other);
                }
            }
        }

        // 8. Notifications with secure OTP instructions
        // Provider gets Pickup OTP to verify volunteer handover
        notificationService.createAndSend(
                listing.getProvider().getUser(),
                "Donation Accepted! Pickup OTP: " + tx.getPickupOtp(),
                match.getReceiver().getOrganizationName() + " has accepted " + tx.getQuantityReserved() + " " + listing.getUnit()
                        + " of " + listing.getFoodName() + ". Disclose Pickup OTP [" + tx.getPickupOtp() + "] to volunteer upon handover.",
                NotificationType.FOOD_ACCEPTED,
                pickup.getId().toString()
        );

        // Receiver gets Delivery OTP to verify safe arrival
        notificationService.createAndSend(
                match.getReceiver().getUser(),
                "Pickup Dispatched! Delivery OTP: " + tx.getDeliveryOtp(),
                "Volunteer dispatched. Provide Delivery OTP [" + tx.getDeliveryOtp() + "] to volunteer only after receiving and inspecting the food.",
                NotificationType.FOOD_ACCEPTED,
                pickup.getId().toString()
        );

        // Volunteer gets pickup notification
        if (assignedVolunteer != null) {
            notificationService.createAndSend(
                    assignedVolunteer.getUser(),
                    "New Pickup Task Assigned",
                    "Pickup " + listing.getFoodName() + " from " + listing.getProvider().getOrganizationName()
                            + " and deliver to " + match.getReceiver().getOrganizationName(),
                    NotificationType.PICKUP_ASSIGNED,
                    pickup.getId().toString()
            );
        }

        auditService.log(userEmail, "ACCEPT_MATCH", "Match", match.getId().toString(),
                "Receiver accepted match. Transaction: " + tx.getId() + ", Pickup: " + pickup.getId());

        try {
            messagingTemplate.convertAndSend("/topic/matches/accepted", mapToDto(match));
        } catch (Exception ignored) {}

        return mapToDto(match);
    }

    @Transactional
    public MatchDto claimListing(UUID foodListingId, java.util.Map<String, Object> req, String userEmail) {
        FoodListing listing = foodListingRepository.findById(foodListingId)
                .orElseThrow(() -> new ResourceNotFoundException("Food listing not found: " + foodListingId));

        if (listing.getStatus() != FoodStatus.AVAILABLE && listing.getStatus() != FoodStatus.RESERVED) {
            throw new BadRequestException("This food listing is no longer available (Status: " + listing.getStatus() + ")");
        }
        if (listing.getRemainingQuantity() <= 0) {
            throw new BadRequestException("All portions of this food listing have already been claimed");
        }
        if (listing.getAvailableUntil() != null && listing.getAvailableUntil().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("This food listing has expired and cannot be claimed");
        }

        User user = userRepository.findByEmail(userEmail).orElse(null);
        Receiver receiver = null;
        if (user != null) {
            receiver = receiverRepository.findByUser(user).orElse(null);
        }
        if (receiver == null) {
            List<Receiver> receivers = receiverRepository.findByIsAvailableTrue();
            if (!receivers.isEmpty()) {
                receiver = receivers.get(0);
            } else {
                throw new BadRequestException("No registered receiver found to claim this listing");
            }
        }

        Receiver finalReceiver = receiver;
        Match match = matchRepository.findByFoodListingId(listing.getId()).stream()
                .filter(m -> m.getReceiver().getId().equals(finalReceiver.getId()))
                .findFirst()
                .orElseGet(() -> {
                    Match m = new Match(listing, finalReceiver, 95.0, 95.0, 95.0, 90.0, 95.0, 95.0, 95.0, 2.5, 15);
                    m.setRequestedQuantity(listing.getRemainingQuantity());
                    m.setAllocatedQuantity(listing.getRemainingQuantity());
                    return matchRepository.save(m);
                });

        Double qtyToClaim = req != null && req.get("quantity") != null ? Double.valueOf(req.get("quantity").toString()) : listing.getRemainingQuantity();
        if (qtyToClaim > listing.getRemainingQuantity()) {
            throw new BadRequestException("Requested quantity (" + qtyToClaim + ") exceeds available remaining quantity (" + listing.getRemainingQuantity() + ")");
        }
        match.setAllocatedQuantity(qtyToClaim);

        String notes = req != null && req.get("notes") != null ? req.get("notes").toString() : "Direct community claim via SurplusFlow Dashboard";
        AcceptMatchRequest acceptReq = new AcceptMatchRequest();
        acceptReq.setNotes(notes);

        return acceptMatch(match.getId(), acceptReq, userEmail);
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

        // Cascade Fallback Logic: Notify the next ranked proposed receiver
        FoodListing listing = match.getFoodListing();
        List<Match> pendingMatches = matchRepository.findByFoodListingIdOrderByMatchScoreDesc(listing.getId());
        Match nextMatch = null;
        for (Match candidate : pendingMatches) {
            if (candidate.getStatus() == MatchStatus.PROPOSED && !candidate.getId().equals(match.getId())) {
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
                    "Cascade proposal: " + listing.getQuantity() + " " + listing.getUnit() + " of " + listing.getFoodName()
                            + " available " + nextMatch.getDistanceKm() + " km away.",
                    NotificationType.SUITABLE_RECEIVER_FOUND,
                    nextMatch.getId().toString()
            );

            auditService.log("SYSTEM", "FALLBACK_NEXT_RECEIVER", "Match", nextMatch.getId().toString(),
                    "Receiver rejected. Cascade fallback notified next receiver: " + nextMatch.getReceiver().getOrganizationName());
        } else {
            // Reopen listing status to AVAILABLE
            listing.setStatus(FoodStatus.AVAILABLE);
            foodListingRepository.save(listing);

            auditService.log("SYSTEM", "FALLBACK_NO_MORE_RECEIVERS", "FoodListing", listing.getId().toString(),
                    "All ranked receivers rejected. Listing returned to available pool.");
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
        dto.setAttemptId(m.getAttemptId());
        dto.setRequestedQuantity(m.getRequestedQuantity());
        dto.setAllocatedQuantity(m.getAllocatedQuantity());
        dto.setSplitAllocation(m.isSplitAllocation());
        dto.setSplitBatchNumber(m.getSplitBatchNumber());
        dto.setExecutionTimeMs(m.getExecutionTimeMs());
        return dto;
    }
}

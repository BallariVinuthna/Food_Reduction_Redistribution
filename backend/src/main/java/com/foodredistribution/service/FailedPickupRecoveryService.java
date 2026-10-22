package com.foodredistribution.service;

import com.foodredistribution.entity.*;
import com.foodredistribution.repository.FoodListingRepository;
import com.foodredistribution.repository.PickupAssignmentRepository;
import com.foodredistribution.repository.VolunteerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class FailedPickupRecoveryService {

    private static final Logger logger = LoggerFactory.getLogger(FailedPickupRecoveryService.class);

    private final PickupAssignmentRepository pickupAssignmentRepository;
    private final FoodListingRepository foodListingRepository;
    private final VolunteerRepository volunteerRepository;
    private final NotificationService notificationService;

    public FailedPickupRecoveryService(PickupAssignmentRepository pickupAssignmentRepository,
                                       FoodListingRepository foodListingRepository,
                                       VolunteerRepository volunteerRepository,
                                       NotificationService notificationService) {
        this.pickupAssignmentRepository = pickupAssignmentRepository;
        this.foodListingRepository = foodListingRepository;
        this.volunteerRepository = volunteerRepository;
        this.notificationService = notificationService;
    }

    /**
     * Recovery workflow when a volunteer cancels or an assignment misses its pickup window.
     */
    @Transactional
    public Map<String, Object> recoverFailedPickup(String pickupId, String reason) {
        UUID assignmentUuid = null;
        try {
            assignmentUuid = UUID.fromString(pickupId);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid UUID format: " + pickupId);
        }

        PickupAssignment pickup = pickupAssignmentRepository.findById(assignmentUuid)
                .orElseThrow(() -> new IllegalArgumentException("Pickup assignment not found: " + pickupId));

        FoodListing listing = pickup.getMatch() != null ? pickup.getMatch().getFoodListing() : null;

        Map<String, Object> report = new HashMap<>();
        report.put("pickupId", pickupId);
        report.put("originalVolunteer", pickup.getVolunteer() != null ? pickup.getVolunteer().getFullName() : "Unassigned");
        report.put("cancellationReason", reason);

        LocalDateTime now = LocalDateTime.now();
        boolean safeWindowFeasible = false;
        long minutesLeft = 0;

        if (listing != null && listing.getAvailableUntil() != null) {
            minutesLeft = java.time.Duration.between(now, listing.getAvailableUntil()).toMinutes();
            safeWindowFeasible = minutesLeft >= 45; // Minimum 45 minutes needed for backup dispatch & transit
        }

        report.put("remainingSafeMinutes", minutesLeft);

        if (!safeWindowFeasible) {
            // Cannot safely reassign — food window has expired or is too tight
            pickup.setStatus(PickupStatus.FAILED);
            pickup.setFailedReason("Safe pickup window elapsed (" + minutesLeft + " mins left). Too late for safe backup handover.");
            pickupAssignmentRepository.save(pickup);

            if (listing != null) {
                listing.setStatus(FoodStatus.EXPIRED);
                foodListingRepository.save(listing);
            }

            report.put("recoveryOutcome", "EXPIRED_UNRECOVERABLE");
            report.put("message", "Donation expired safely; cannot dispatch backup volunteer within safe thermal window.");
            logger.warn("Pickup {} expired without recovery: {} minutes left.", pickupId, minutesLeft);
            return report;
        }

        // Safe window exists — search for eligible backup volunteer in Hyderabad
        List<Volunteer> volunteers = volunteerRepository.findByIsAvailableTrue();
        Volunteer backupVolunteer = null;
        UUID existingVolId = pickup.getVolunteer() != null ? pickup.getVolunteer().getId() : null;

        for (Volunteer v : volunteers) {
            if (existingVolId == null || !v.getId().equals(existingVolId)) {
                backupVolunteer = v;
                break;
            }
        }

        if (backupVolunteer != null) {
            String prevVol = pickup.getVolunteer() != null ? pickup.getVolunteer().getFullName() : "Previous Volunteer";
            pickup.setVolunteer(backupVolunteer);
            pickup.setStatus(PickupStatus.ASSIGNED);
            pickup.setAssignedAt(now);
            pickupAssignmentRepository.save(pickup);

            // Notify replacement volunteer
            if (backupVolunteer.getUser() != null) {
                String foodName = listing != null ? listing.getFoodName() : "Surplus Meal";
                String qty = (listing != null ? listing.getQuantity() : 30.0) + " " + (listing != null ? listing.getUnit() : "MEALS");
                String provName = listing != null && listing.getProvider() != null ? listing.getProvider().getOrganizationName() : "Donor Kitchen";

                notificationService.createAndSend(
                        backupVolunteer.getUser(),
                        "URGENT: Reassigned Food Rescue Mission",
                        String.format("You are reassigned as backup for %s (%s). Please collect from %s before deadline.", foodName, qty, provName),
                        NotificationType.PICKUP_ASSIGNED,
                        pickup.getId().toString()
                );
            }

            report.put("recoveryOutcome", "SUCCESSFULLY_REASSIGNED");
            report.put("newVolunteerName", backupVolunteer.getFullName());
            report.put("newVolunteerPhone", backupVolunteer.getPhone());
            report.put("message", "Pickup safely reassigned to backup volunteer " + backupVolunteer.getFullName());
            logger.info("Successfully recovered pickup {} by reassigning from {} to {}", pickupId, prevVol, backupVolunteer.getFullName());
        } else {
            // No backup available right now — escalate
            report.put("recoveryOutcome", "ESCALATED_NO_BACKUP");
            report.put("message", "No backup volunteers currently available. Mission escalated to NGO coordinator.");
            logger.warn("No backup volunteer found for recovery of pickup {}", pickupId);
        }

        return report;
    }

    /**
     * Run scan over all active pickups to catch overdue missions.
     */
    @Transactional
    public List<Map<String, Object>> scanAndRecoverOverduePickups() {
        List<PickupAssignment> inFlight = pickupAssignmentRepository.findByStatus(PickupStatus.ASSIGNED);
        List<Map<String, Object>> recoveryResults = new ArrayList<>();

        for (PickupAssignment p : inFlight) {
            // If assigned for more than 40 minutes without en route update
            if (p.getAssignedAt() != null && p.getAssignedAt().isBefore(LocalDateTime.now().minusMinutes(40))) {
                Map<String, Object> outcome = recoverFailedPickup(p.getId().toString(), "Volunteer failed to advance mission status within 40 minutes");
                recoveryResults.add(outcome);
            }
        }

        return recoveryResults;
    }
}

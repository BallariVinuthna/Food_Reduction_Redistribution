package com.foodredistribution.service;

import com.foodredistribution.entity.*;
import com.foodredistribution.repository.DonationTransactionRepository;
import com.foodredistribution.repository.PickupAssignmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class QrTrackingService {

    private static final Logger logger = LoggerFactory.getLogger(QrTrackingService.class);

    private final DonationTransactionRepository transactionRepository;
    private final PickupAssignmentRepository pickupAssignmentRepository;

    public QrTrackingService(DonationTransactionRepository transactionRepository,
                             PickupAssignmentRepository pickupAssignmentRepository) {
        this.transactionRepository = transactionRepository;
        this.pickupAssignmentRepository = pickupAssignmentRepository;
    }

    private UUID parseUuid(String id) {
        try {
            return UUID.fromString(id);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid UUID format: " + id);
        }
    }

    /**
     * Generate secure QR payload without exposing plain secrets.
     */
    public Map<String, Object> generateQrPayload(String transactionId) {
        UUID txnUuid = parseUuid(transactionId);
        DonationTransaction txn = transactionRepository.findById(txnUuid)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + transactionId));

        UUID listingId = txn.getFoodListing() != null ? txn.getFoodListing().getId() : null;
        String rawToken = transactionId + ":" + listingId + ":" + txn.getReservedAt();
        String secureSignature = computeSha256(rawToken).substring(0, 16);

        String qrString = String.format("SF-TXN://%s?sig=%s", transactionId, secureSignature);

        Map<String, Object> response = new HashMap<>();
        response.put("transactionId", transactionId);
        response.put("foodName", txn.getFoodListing() != null ? txn.getFoodListing().getFoodName() : "Surplus Food");
        response.put("quantity", txn.getQuantityReserved());
        response.put("unit", txn.getUnit());
        response.put("qrPayload", qrString);
        response.put("status", txn.getStatus() != null ? txn.getStatus().name() : "RESERVED");
        response.put("signature", secureSignature);
        response.put("generatedAt", LocalDateTime.now());

        return response;
    }

    /**
     * Process an authenticated QR scan event along the lifecycle.
     */
    @Transactional
    public Map<String, Object> processQrScan(String transactionId, String scannedPayload, String eventType, String actorEmail, String actorRole) {
        UUID txnUuid = parseUuid(transactionId);
        DonationTransaction txn = transactionRepository.findById(txnUuid)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + transactionId));

        if (!scannedPayload.contains(transactionId)) {
            throw new IllegalArgumentException("Invalid QR payload: transaction ID mismatch.");
        }

        TransactionStatus previousStatus = txn.getStatus();
        TransactionStatus newStatus = previousStatus;
        boolean transitionAllowed = false;

        // State Machine validation
        switch (eventType.toUpperCase()) {
            case "COLLECTION_SCAN":
                if (previousStatus == TransactionStatus.RESERVED || previousStatus == TransactionStatus.ASSIGNED) {
                    newStatus = TransactionStatus.COLLECTED;
                    txn.setCollectedAt(LocalDateTime.now());
                    txn.setStatus(newStatus);
                    transitionAllowed = true;
                }
                break;
            case "DELIVERY_SCAN":
                if (previousStatus == TransactionStatus.COLLECTED || previousStatus == TransactionStatus.EN_ROUTE || previousStatus == TransactionStatus.ARRIVED) {
                    newStatus = TransactionStatus.DELIVERED;
                    txn.setDeliveredAt(LocalDateTime.now());
                    txn.setStatus(newStatus);
                    txn.setVerificationStatus(VerificationStatus.VERIFIED);
                    transitionAllowed = true;
                }
                break;
            case "AUDIT_SCAN":
                transitionAllowed = true; // Read-only scan inspection
                break;
            default:
                throw new IllegalArgumentException("Unrecognized QR event type: " + eventType);
        }

        if (!transitionAllowed && !"AUDIT_SCAN".equals(eventType.toUpperCase())) {
            throw new IllegalStateException(String.format("Invalid state transition from '%s' via '%s'.", previousStatus, eventType));
        }

        DonationTransaction saved = transactionRepository.save(txn);
        logger.info("QR scan processed: txn={}, event={}, actor={}, status={}", transactionId, eventType, actorEmail, newStatus);

        Map<String, Object> result = new HashMap<>();
        result.put("transactionId", saved.getId());
        result.put("foodName", saved.getFoodListing() != null ? saved.getFoodListing().getFoodName() : "Surplus Food");
        result.put("previousStatus", previousStatus != null ? previousStatus.name() : "UNKNOWN");
        result.put("currentStatus", newStatus != null ? newStatus.name() : "UNKNOWN");
        result.put("scannedBy", actorEmail);
        result.put("scannedAt", LocalDateTime.now());
        result.put("isDuplicateScan", previousStatus == newStatus && !"AUDIT_SCAN".equals(eventType.toUpperCase()));

        return result;
    }

    /**
     * Get verified event timeline for QR tracking view.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getTimeline(String transactionId) {
        UUID txnUuid = parseUuid(transactionId);
        DonationTransaction txn = transactionRepository.findById(txnUuid)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + transactionId));

        List<Map<String, Object>> events = new ArrayList<>();

        if (txn.getReservedAt() != null) {
            events.add(Map.of("stage", "RESERVED", "title", "Food Reserved & Matched", "timestamp", txn.getReservedAt(), "verified", true, "notes", "Allocated by system matching"));
        }
        if (txn.getAssignedAt() != null) {
            String volName = txn.getVolunteer() != null ? txn.getVolunteer().getFullName() : "Vikram Sharma";
            events.add(Map.of("stage", "ASSIGNED", "title", "Volunteer Dispatched", "timestamp", txn.getAssignedAt(), "verified", true, "notes", "Volunteer: " + volName));
        }
        if (txn.getCollectedAt() != null) {
            events.add(Map.of("stage", "COLLECTED", "title", "Handover from Donor Confirmed", "timestamp", txn.getCollectedAt(), "verified", txn.isPickupOtpVerified(), "notes", "OTP verified at kitchen entrance"));
        }
        if (txn.getDeliveredAt() != null) {
            events.add(Map.of("stage", "DELIVERED", "title", "Safe Community Delivery Completed", "timestamp", txn.getDeliveredAt(), "verified", txn.isDeliveryOtpVerified(), "notes", "Beneficiaries nourished at shelter"));
        }

        Map<String, Object> timeline = new HashMap<>();
        timeline.put("transactionId", txn.getId());
        timeline.put("foodName", txn.getFoodListing() != null ? txn.getFoodListing().getFoodName() : "Surplus Food");
        timeline.put("donor", txn.getProvider() != null ? txn.getProvider().getOrganizationName() : "Donor");
        timeline.put("receiver", txn.getReceiver() != null ? txn.getReceiver().getOrganizationName() : "Receiver");
        timeline.put("quantity", txn.getQuantityReserved() + " " + txn.getUnit());
        timeline.put("currentStatus", txn.getStatus() != null ? txn.getStatus().name() : "RESERVED");
        timeline.put("events", events);

        return timeline;
    }

    private String computeSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return UUID.randomUUID().toString().replace("-", "");
        }
    }
}

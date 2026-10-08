package com.foodredistribution.service;

import com.foodredistribution.dto.PickupAssignmentDto;
import com.foodredistribution.dto.UpdatePickupStatusRequest;
import com.foodredistribution.entity.*;
import com.foodredistribution.exception.BadRequestException;
import com.foodredistribution.exception.ResourceNotFoundException;
import com.foodredistribution.repository.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PickupService {

    private final PickupAssignmentRepository pickupAssignmentRepository;
    private final PickupEventRepository pickupEventRepository;
    private final FoodListingRepository foodListingRepository;
    private final FoodProviderRepository foodProviderRepository;
    private final ReceiverRepository receiverRepository;
    private final VolunteerRepository volunteerRepository;
    private final NotificationService notificationService;
    private final AnalyticsService analyticsService;
    private final AuditService auditService;
    private final SimpMessagingTemplate messagingTemplate;

    public PickupService(PickupAssignmentRepository pickupAssignmentRepository,
                         PickupEventRepository pickupEventRepository,
                         FoodListingRepository foodListingRepository,
                         FoodProviderRepository foodProviderRepository,
                         ReceiverRepository receiverRepository,
                         VolunteerRepository volunteerRepository,
                         NotificationService notificationService,
                         AnalyticsService analyticsService,
                         AuditService auditService,
                         SimpMessagingTemplate messagingTemplate) {
        this.pickupAssignmentRepository = pickupAssignmentRepository;
        this.pickupEventRepository = pickupEventRepository;
        this.foodListingRepository = foodListingRepository;
        this.foodProviderRepository = foodProviderRepository;
        this.receiverRepository = receiverRepository;
        this.volunteerRepository = volunteerRepository;
        this.notificationService = notificationService;
        this.analyticsService = analyticsService;
        this.auditService = auditService;
        this.messagingTemplate = messagingTemplate;
    }

    public List<PickupAssignmentDto> getAllPickups(PickupStatus status) {
        List<PickupAssignment> pickups = (status != null)
                ? pickupAssignmentRepository.findByStatus(status)
                : pickupAssignmentRepository.findAll();
        return pickups.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<PickupAssignmentDto> getVolunteerPickups(UUID volunteerId) {
        return pickupAssignmentRepository.findByVolunteerId(volunteerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public PickupAssignmentDto getPickupById(UUID id) {
        PickupAssignment pickup = pickupAssignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup assignment not found: " + id));
        return mapToDto(pickup);
    }

    @Transactional
    public PickupAssignmentDto assignVolunteer(UUID pickupId, UUID volunteerId) {
        PickupAssignment pickup = pickupAssignmentRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup assignment not found: " + pickupId));
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found: " + volunteerId));

        pickup.setVolunteer(volunteer);
        pickup.setStatus(PickupStatus.ASSIGNED);
        pickup = pickupAssignmentRepository.save(pickup);

        volunteer.setActivePickupsCount(volunteer.getActivePickupsCount() + 1);
        volunteerRepository.save(volunteer);

        notificationService.createAndSend(
                volunteer.getUser(),
                "Pickup Task Assigned",
                "You have been assigned to pick up " + pickup.getMatch().getFoodListing().getFoodName(),
                NotificationType.PICKUP_ASSIGNED,
                pickup.getId().toString()
        );

        return mapToDto(pickup);
    }

    @Transactional
    public PickupAssignmentDto updatePickupStatus(UUID pickupId, UpdatePickupStatusRequest req, String userEmail) {
        PickupAssignment pickup = pickupAssignmentRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup assignment not found: " + pickupId));

        PickupStatus newStatus = req.getStatus();
        pickup.setStatus(newStatus);
        LocalDateTime now = LocalDateTime.now();

        FoodListing listing = pickup.getMatch().getFoodListing();
        FoodProvider provider = listing.getProvider();
        Receiver receiver = pickup.getMatch().getReceiver();
        Volunteer volunteer = pickup.getVolunteer();

        if (req.getProofNotes() != null) {
            pickup.setProofNotes(req.getProofNotes());
        }
        if (req.getProofPhotoUrl() != null) {
            pickup.setProofPhotoUrl(req.getProofPhotoUrl());
        }

        switch (newStatus) {
            case EN_ROUTE:
                pickup.setEnRouteAt(now);
                if (provider.getUser() != null) {
                    notificationService.createAndSend(
                            provider.getUser(),
                            "Volunteer En Route",
                            (volunteer != null ? volunteer.getFullName() : "Volunteer") + " is en route to collect the food surplus.",
                            NotificationType.VOLUNTEER_APPROACHING,
                            pickup.getId().toString()
                    );
                }
                break;

            case ARRIVED:
                pickup.setArrivedAt(now);
                break;

            case COLLECTED:
                pickup.setPickedUpAt(now);
                listing.setStatus(FoodStatus.COLLECTED);
                foodListingRepository.save(listing);

                if (receiver.getUser() != null) {
                    notificationService.createAndSend(
                            receiver.getUser(),
                            "Food Collected from Provider",
                            listing.getQuantity() + " " + listing.getUnit() + " of " + listing.getFoodName() + " has been collected and is en route to you.",
                            NotificationType.FOOD_COLLECTED,
                            pickup.getId().toString()
                    );
                }
                break;

            case DELIVERED:
                pickup.setDeliveredAt(now);
                listing.setStatus(FoodStatus.REDISTRIBUTED);
                foodListingRepository.save(listing);

                // Update provider statistics
                provider.setTotalDonatedMeals(provider.getTotalDonatedMeals() + listing.getQuantity().intValue());
                provider.setActiveListingsCount(Math.max(0, provider.getActiveListingsCount() - 1));
                foodProviderRepository.save(provider);

                // Update receiver statistics
                receiver.setTotalReceivedMeals(receiver.getTotalReceivedMeals() + listing.getQuantity().intValue());
                receiverRepository.save(receiver);

                // Update volunteer statistics
                if (volunteer != null) {
                    volunteer.setTotalCompletedPickups(volunteer.getTotalCompletedPickups() + 1);
                    volunteer.setActivePickupsCount(Math.max(0, volunteer.getActivePickupsCount() - 1));
                    volunteerRepository.save(volunteer);
                }

                // Notify both parties
                if (provider.getUser() != null) {
                    notificationService.createAndSend(
                            provider.getUser(),
                            "Food Successfully Redistributed!",
                            "Your donation of " + listing.getQuantity() + " " + listing.getUnit() + " of " + listing.getFoodName() + " was safely delivered to " + receiver.getOrganizationName(),
                            NotificationType.FOOD_DELIVERED,
                            pickup.getId().toString()
                    );
                }
                if (receiver.getUser() != null) {
                    notificationService.createAndSend(
                            receiver.getUser(),
                            "Delivery Complete",
                            "Enjoy! " + listing.getQuantity() + " " + listing.getUnit() + " of " + listing.getFoodName() + " has arrived.",
                            NotificationType.FOOD_DELIVERED,
                            pickup.getId().toString()
                    );
                }

                // Trigger analytics calculation
                analyticsService.recalculateImpactMetrics();
                break;

            case FAILED:
                listing.setStatus(FoodStatus.CANCELLED);
                foodListingRepository.save(listing);
                if (volunteer != null) {
                    volunteer.setActivePickupsCount(Math.max(0, volunteer.getActivePickupsCount() - 1));
                    volunteerRepository.save(volunteer);
                }
                break;
        }

        pickup = pickupAssignmentRepository.save(pickup);

        // Record tracking event
        PickupEvent event = new PickupEvent(
                pickup,
                newStatus.name(),
                req.getCurrentLatitude() != null ? req.getCurrentLatitude() : (volunteer != null ? volunteer.getCurrentLatitude() : null),
                req.getCurrentLongitude() != null ? req.getCurrentLongitude() : (volunteer != null ? volunteer.getCurrentLongitude() : null),
                "Status transitioned to " + newStatus
        );
        pickupEventRepository.save(event);

        auditService.log(userEmail, "PICKUP_STATUS_UPDATE", "PickupAssignment", pickup.getId().toString(),
                "Status updated to " + newStatus);

        PickupAssignmentDto dto = mapToDto(pickup);
        try {
            messagingTemplate.convertAndSend("/topic/pickups/" + pickup.getId(), dto);
        } catch (Exception ignored) {}

        return dto;
    }

    public PickupAssignmentDto mapToDto(PickupAssignment p) {
        PickupAssignmentDto dto = new PickupAssignmentDto();
        dto.setId(p.getId());
        dto.setMatchId(p.getMatch().getId());
        FoodListing listing = p.getMatch().getFoodListing();
        dto.setFoodListingId(listing.getId());
        dto.setFoodName(listing.getFoodName());
        dto.setQuantity(listing.getQuantity());
        dto.setUnit(listing.getUnit());

        FoodProvider provider = listing.getProvider();
        dto.setProviderOrganizationName(provider.getOrganizationName());
        dto.setProviderAddress(listing.getAddress());
        dto.setProviderLatitude(listing.getLatitude());
        dto.setProviderLongitude(listing.getLongitude());
        dto.setProviderPhone(listing.getContactPhone());

        Receiver receiver = p.getMatch().getReceiver();
        dto.setReceiverOrganizationName(receiver.getOrganizationName());
        dto.setReceiverAddress(receiver.getAddress());
        dto.setReceiverLatitude(receiver.getLatitude());
        dto.setReceiverLongitude(receiver.getLongitude());
        dto.setReceiverPhone(receiver.getContactPhone());

        if (p.getVolunteer() != null) {
            dto.setVolunteerId(p.getVolunteer().getId());
            dto.setVolunteerName(p.getVolunteer().getFullName());
            dto.setVolunteerPhone(p.getVolunteer().getPhone());
        }

        dto.setStatus(p.getStatus());
        dto.setAssignedAt(p.getAssignedAt());
        dto.setEnRouteAt(p.getEnRouteAt());
        dto.setArrivedAt(p.getArrivedAt());
        dto.setPickedUpAt(p.getPickedUpAt());
        dto.setDeliveredAt(p.getDeliveredAt());
        dto.setProofNotes(p.getProofNotes());
        dto.setProofPhotoUrl(p.getProofPhotoUrl());

        return dto;
    }
}

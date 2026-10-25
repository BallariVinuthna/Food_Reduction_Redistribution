package com.foodredistribution.service;

import com.foodredistribution.dto.CreateFoodListingRequest;
import com.foodredistribution.dto.FoodListingDto;
import com.foodredistribution.dto.FoodSafetyCheckDto;
import com.foodredistribution.entity.*;
import com.foodredistribution.exception.BadRequestException;
import com.foodredistribution.exception.ResourceNotFoundException;
import com.foodredistribution.matching.MatchingEngine;
import com.foodredistribution.repository.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class FoodListingService {

    private static final Logger logger = LoggerFactory.getLogger(FoodListingService.class);

    private final FoodListingRepository foodListingRepository;
    private final FoodSafetyCheckRepository foodSafetyCheckRepository;
    private final FoodProviderRepository foodProviderRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;
    private final SimpMessagingTemplate messagingTemplate;
    private final LiveDemoSimulatorService liveDemoSimulatorService;

    public FoodListingService(FoodListingRepository foodListingRepository,
                              FoodSafetyCheckRepository foodSafetyCheckRepository,
                              FoodProviderRepository foodProviderRepository,
                              UserRepository userRepository,
                              NotificationService notificationService,
                              AuditService auditService,
                              SimpMessagingTemplate messagingTemplate,
                              LiveDemoSimulatorService liveDemoSimulatorService) {
        this.foodListingRepository = foodListingRepository;
        this.foodSafetyCheckRepository = foodSafetyCheckRepository;
        this.foodProviderRepository = foodProviderRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
        this.messagingTemplate = messagingTemplate;
        this.liveDemoSimulatorService = liveDemoSimulatorService;
    }

    @Transactional
    public FoodListingDto createListing(String userEmail, CreateFoodListingRequest req) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        FoodProvider provider = foodProviderRepository.findByUser(user)
                .orElseGet(() -> {
                    String orgName = user.getFullName() != null && !user.getFullName().isBlank()
                            ? user.getFullName()
                            : "Surplus Food Redistribution Provider";
                    String providerType = user.getRole() == com.foodredistribution.entity.Role.ADMIN
                            ? "CENTRAL_HUB"
                            : (user.getRole() == com.foodredistribution.entity.Role.NGO_RECEIVER ? "NGO_HUB" : "DONOR_COMMUNITY");
                    String contactPerson = user.getFullName() != null ? user.getFullName() : "Operations Lead";
                    String phone = req.getContactPhone() != null && !req.getContactPhone().isBlank()
                            ? req.getContactPhone()
                            : (user.getPhone() != null ? user.getPhone() : "+91 9876543210");
                    String addr = req.getAddress() != null && !req.getAddress().isBlank()
                            ? req.getAddress()
                            : "Road No. 1, Banjara Hills, Hyderabad";
                    double lat = req.getLatitude() != null ? req.getLatitude() : 17.4156;
                    double lon = req.getLongitude() != null ? req.getLongitude() : 78.4487;

                    FoodProvider autoProvider = new FoodProvider(
                            user,
                            orgName,
                            providerType,
                            addr,
                            lat,
                            lon,
                            contactPerson,
                            phone
                    );
                    return foodProviderRepository.save(autoProvider);
                });

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime availableUntil = req.getAvailableUntil();
        LocalDateTime availableFrom = req.getAvailableFrom() != null ? req.getAvailableFrom() : now;
        LocalDateTime prepTime = req.getPreparationTime() != null ? req.getPreparationTime() : now.minusHours(1);

        // Auto-correct if client sent UTC ISO timestamps (e.g. JavaScript toISOString) to a server running in local timezone
        if (availableUntil != null && availableUntil.isBefore(now.minusMinutes(2))) {
            java.time.ZoneOffset currentOffset = java.time.ZoneId.systemDefault().getRules().getOffset(java.time.Instant.now());
            int offsetSeconds = currentOffset.getTotalSeconds();
            if (offsetSeconds != 0 && availableUntil.plusSeconds(offsetSeconds).isAfter(now)) {
                availableUntil = availableUntil.plusSeconds(offsetSeconds);
                if (availableFrom != null) availableFrom = availableFrom.plusSeconds(offsetSeconds);
                if (prepTime != null) prepTime = prepTime.plusSeconds(offsetSeconds);
            }
        }

        if (availableUntil == null || availableUntil.isBefore(now)) {
            throw new BadRequestException("Available until time must be in the future");
        }

        FoodListing listing = new FoodListing(
                provider,
                req.getFoodName(),
                req.getFoodCategory(),
                req.getQuantity(),
                req.getUnit(),
                prepTime,
                availableFrom,
                availableUntil,
                req.getAddress(),
                req.getLatitude(),
                req.getLongitude(),
                req.getFoodCondition(),
                req.isVegetarian(),
                req.getAllergenInfo(),
                req.getStorageCondition(),
                req.getPickupInstructions(),
                req.getPhotoUrl(),
                req.getContactPhone() != null ? req.getContactPhone() : provider.getContactPhone()
        );
        listing = foodListingRepository.save(listing);

        FoodSafetyCheck safetyCheck = new FoodSafetyCheck(
                listing,
                req.isTemperatureSafe(),
                req.isCleanPackaging(),
                req.isPreparedWithinSafeWindow(),
                req.isAllergenDeclared(),
                req.isProviderCertified(),
                req.getSafetyNotes()
        );
        safetyCheck = foodSafetyCheckRepository.save(safetyCheck);

        // Update provider active count
        provider.setActiveListingsCount(provider.getActiveListingsCount() + 1);
        foodProviderRepository.save(provider);

        auditService.log(userEmail, "CREATE_SURPLUS", "FoodListing", listing.getId().toString(),
                "Listed " + listing.getQuantity() + " " + listing.getUnit() + " of " + listing.getFoodName());

        FoodListingDto dto = mapToDto(listing, safetyCheck);

        // Broadcast to WebSocket clients
        try {
            messagingTemplate.convertAndSend("/topic/listings/new", dto);
        } catch (Exception ignored) {}

        return dto;
    }

    public List<FoodListingDto> getActiveListings() {
        LocalDateTime now = LocalDateTime.now();
        List<FoodListing> listings = foodListingRepository.findActiveSurplus(now);
        if (listings.size() < 3) {
            try {
                liveDemoSimulatorService.ensureVibrantDemoData();
                listings = foodListingRepository.findActiveSurplus(now);
            } catch (Exception e) {
                logger.warn("Live demo data check note: {}", e.getMessage());
            }
        }
        return listings.stream()
                .map(l -> {
                    l.recalculateUrgency();
                    FoodSafetyCheck safety = foodSafetyCheckRepository.findByFoodListing(l).orElse(null);
                    return mapToDto(l, safety);
                })
                .collect(Collectors.toList());
    }

    public List<FoodListingDto> getAllListings(FoodStatus status, String category) {
        List<FoodListing> listings = (status != null)
                ? foodListingRepository.findByStatus(status)
                : foodListingRepository.findAll();

        return listings.stream()
                .filter(l -> category == null || l.getFoodCategory().equalsIgnoreCase(category))
                .map(l -> {
                    l.recalculateUrgency();
                    FoodSafetyCheck safety = foodSafetyCheckRepository.findByFoodListing(l).orElse(null);
                    return mapToDto(l, safety);
                })
                .collect(Collectors.toList());
    }

    public FoodListingDto getListingById(UUID id) {
        FoodListing listing = foodListingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food listing not found: " + id));
        listing.recalculateUrgency();
        FoodSafetyCheck safety = foodSafetyCheckRepository.findByFoodListing(listing).orElse(null);
        return mapToDto(listing, safety);
    }

    public List<FoodListingDto> getProviderListings(UUID providerId) {
        return foodListingRepository.findByProviderId(providerId).stream()
                .map(l -> {
                    l.recalculateUrgency();
                    FoodSafetyCheck safety = foodSafetyCheckRepository.findByFoodListing(l).orElse(null);
                    return mapToDto(l, safety);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void checkAndExpireListings() {
        LocalDateTime now = LocalDateTime.now();
        List<FoodListing> expired = foodListingRepository.findExpiredPendingListings(now);
        for (FoodListing listing : expired) {
            listing.setStatus(FoodStatus.EXPIRED);
            foodListingRepository.save(listing);

            auditService.log("SYSTEM", "FOOD_EXPIRED", "FoodListing", listing.getId().toString(),
                    "Food listing expired: " + listing.getFoodName());

            if (listing.getProvider() != null && listing.getProvider().getUser() != null) {
                notificationService.createAndSend(
                        listing.getProvider().getUser(),
                        "Surplus Food Expired",
                        "Listing for " + listing.getFoodName() + " has reached its available time window without collection.",
                        NotificationType.FOOD_EXPIRED,
                        listing.getId().toString()
                );
            }
        }
    }

    public FoodListingDto mapToDto(FoodListing listing, FoodSafetyCheck safetyCheck) {
        FoodListingDto dto = new FoodListingDto();
        dto.setId(listing.getId());
        dto.setProviderId(listing.getProvider().getId());
        dto.setProviderOrganizationName(listing.getProvider().getOrganizationName());
        dto.setFoodName(listing.getFoodName());
        dto.setFoodCategory(listing.getFoodCategory());
        dto.setQuantity(listing.getQuantity());
        dto.setVersion(listing.getVersion());
        dto.setReservedQuantity(listing.getReservedQuantity());
        dto.setRemainingQuantity(listing.getRemainingQuantity());
        dto.setUnit(listing.getUnit());
        dto.setPreparationTime(listing.getPreparationTime());
        dto.setAvailableFrom(listing.getAvailableFrom());
        dto.setAvailableUntil(listing.getAvailableUntil());
        dto.setAddress(listing.getAddress());
        dto.setLatitude(listing.getLatitude());
        dto.setLongitude(listing.getLongitude());
        dto.setFoodCondition(listing.getFoodCondition());
        dto.setVegetarian(listing.isVegetarian());
        dto.setAllergenInfo(listing.getAllergenInfo());
        dto.setStorageCondition(listing.getStorageCondition());
        dto.setPickupInstructions(listing.getPickupInstructions());
        dto.setPhotoUrl(listing.getPhotoUrl());
        dto.setContactPhone(listing.getContactPhone());
        dto.setStatus(listing.getStatus());
        dto.setUrgencyLevel(listing.getUrgencyLevel());
        dto.setAvailableMinutesRemaining(listing.getAvailableMinutesRemaining());
        dto.setCreatedAt(listing.getCreatedAt());
        dto.setUpdatedAt(listing.getUpdatedAt());

        if (safetyCheck != null) {
            dto.setSafetyCheck(new FoodSafetyCheckDto(
                    safetyCheck.getId(),
                    safetyCheck.isTemperatureSafe(),
                    safetyCheck.isCleanPackaging(),
                    safetyCheck.isPreparedWithinSafeWindow(),
                    safetyCheck.isAllergenDeclared(),
                    safetyCheck.isProviderCertified(),
                    safetyCheck.getNotes(),
                    safetyCheck.getCheckedAt()
            ));
        }
        return dto;
    }
}

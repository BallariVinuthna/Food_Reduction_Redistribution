package com.foodredistribution.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodredistribution.dto.ConfirmImageAssessmentRequest;
import com.foodredistribution.dto.FoodImageAssessmentDto;
import com.foodredistribution.entity.FoodImageCheck;
import com.foodredistribution.repository.FoodImageCheckRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class FoodImageCheckService {

    private static final Logger logger = LoggerFactory.getLogger(FoodImageCheckService.class);

    private final FoodImageCheckRepository repository;
    private final CloudinaryStorageService storageService;
    private final OpenAiService openAiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public FoodImageCheckService(FoodImageCheckRepository repository,
                                  CloudinaryStorageService storageService,
                                  OpenAiService openAiService) {
        this.repository = repository;
        this.storageService = storageService;
        this.openAiService = openAiService;
    }

    /**
     * Uploads the food image, runs visual analysis, persists assessment to MySQL, and returns DTO.
     */
    @Transactional
    public FoodImageAssessmentDto uploadAndAnalyzeImage(MultipartFile file, String userEmail) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Food image file is required.");
        }

        // 1. Upload image to Cloudinary (or fallback storage)
        String imageUrl = storageService.uploadImage(file);
        String contentType = file.getContentType();
        long sizeBytes = file.getSize();
        String originalFilename = file.getOriginalFilename();

        // 2. Perform visual analysis (OpenAI Vision with heuristic fallback)
        Map<String, Object> aiResult = openAiService.analyzeFoodImageVisual(file.getBytes(), contentType, originalFilename);

        // 3. Persist assessment record in database
        FoodImageCheck check = new FoodImageCheck(userEmail, imageUrl, contentType, sizeBytes);
        check.setDetectedFoodName((String) aiResult.getOrDefault("detectedFoodName", "Prepared Meal"));
        check.setDetectedCategory((String) aiResult.getOrDefault("detectedCategory", "COOKED_MEALS"));

        Object conf = aiResult.get("confidenceScore");
        check.setConfidenceScore(conf instanceof Number ? ((Number) conf).doubleValue() : 0.90);

        List<String> visibleChars = (List<String>) aiResult.getOrDefault("visibleCharacteristics", Collections.emptyList());
        List<String> visualConcerns = (List<String>) aiResult.getOrDefault("visualConcerns", Collections.emptyList());
        List<String> nextSteps = (List<String>) aiResult.getOrDefault("recommendedNextSteps", Collections.emptyList());

        check.setVisibleCharacteristics(objectMapper.writeValueAsString(visibleChars));
        check.setVisualConcerns(objectMapper.writeValueAsString(visualConcerns));
        check.setRecommendedSteps(objectMapper.writeValueAsString(nextSteps));
        check.setAdvisoryDisclaimer((String) aiResult.getOrDefault("advisoryDisclaimer", OpenAiService.ADVISORY_FOOD_SAFETY_DISCLAIMER));
        check.setReviewStatus("PENDING_CONFIRMATION");
        check.setCreatedAt(LocalDateTime.now());
        check.setUpdatedAt(LocalDateTime.now());

        FoodImageCheck saved = repository.save(check);
        logger.info("Created FoodImageCheck record: id={}, foodName={}, user={}", saved.getId(), saved.getDetectedFoodName(), userEmail);

        return mapToDto(saved, visibleChars, visualConcerns, nextSteps, (String) aiResult.get("storageRecommendation"), (String) aiResult.get("suggestedSafeWindow"));
    }

    /**
     * Confirms or corrects donor-confirmed food details.
     */
    @Transactional
    public FoodImageAssessmentDto confirmAssessment(String checkId, ConfirmImageAssessmentRequest request, String userEmail) {
        FoodImageCheck check = repository.findById(checkId)
                .orElseThrow(() -> new IllegalArgumentException("Food image check not found: " + checkId));

        if (request.getConfirmedFoodName() != null) check.setDonorConfirmedFoodName(request.getConfirmedFoodName());
        if (request.getConfirmedCategory() != null) check.setDonorConfirmedCategory(request.getConfirmedCategory());
        if (request.getConfirmedQuantity() != null) check.setDonorConfirmedQuantity(request.getConfirmedQuantity());
        if (request.getConfirmedUnit() != null) check.setDonorConfirmedUnit(request.getConfirmedUnit());
        if (request.getConfirmedStorage() != null) check.setDonorConfirmedStorage(request.getConfirmedStorage());
        if (request.getConfirmedAllergens() != null) check.setDonorConfirmedAllergens(request.getConfirmedAllergens());
        if (request.getConfirmedMinutes() != null) check.setDonorConfirmedMinutes(request.getConfirmedMinutes());

        if (Boolean.TRUE.equals(request.getApplyToListing())) {
            check.setReviewStatus("APPLIED_TO_LISTING");
        } else {
            check.setReviewStatus("CONFIRMED");
        }
        check.setUpdatedAt(LocalDateTime.now());

        FoodImageCheck saved = repository.save(check);
        logger.info("Updated FoodImageCheck id={} to status={}", saved.getId(), saved.getReviewStatus());

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<FoodImageAssessmentDto> getUserHistory(String userEmail) {
        return repository.findByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    private FoodImageAssessmentDto mapToDto(FoodImageCheck entity) {
        List<String> visibleChars = parseJsonList(entity.getVisibleCharacteristics());
        List<String> visualConcerns = parseJsonList(entity.getVisualConcerns());
        List<String> nextSteps = parseJsonList(entity.getRecommendedSteps());
        return mapToDto(entity, visibleChars, visualConcerns, nextSteps, null, null);
    }

    private FoodImageAssessmentDto mapToDto(FoodImageCheck entity,
                                           List<String> visibleChars,
                                           List<String> visualConcerns,
                                           List<String> nextSteps,
                                           String storageRec,
                                           String windowRec) {
        FoodImageAssessmentDto dto = new FoodImageAssessmentDto();
        dto.setId(entity.getId());
        dto.setImageUrl(entity.getImageUrl());
        dto.setImageFormat(entity.getImageFormat());
        dto.setFileSizeBytes(entity.getFileSizeBytes());
        dto.setDetectedFoodName(entity.getDetectedFoodName());
        dto.setDetectedCategory(entity.getDetectedCategory());
        dto.setConfidenceScore(entity.getConfidenceScore());
        dto.setVisibleCharacteristics(visibleChars);
        dto.setVisualConcerns(visualConcerns);
        dto.setRecommendedNextSteps(nextSteps);
        dto.setStorageRecommendation(storageRec != null ? storageRec : (entity.getDonorConfirmedStorage() != null ? entity.getDonorConfirmedStorage() : "HEATED_CONTAINER"));
        dto.setSuggestedSafeWindow(windowRec != null ? windowRec : "90-120 minutes");
        dto.setAdvisoryDisclaimer(entity.getAdvisoryDisclaimer());
        dto.setReviewStatus(entity.getReviewStatus());
        dto.setCreatedAt(entity.getCreatedAt());

        dto.setDonorConfirmedFoodName(entity.getDonorConfirmedFoodName());
        dto.setDonorConfirmedCategory(entity.getDonorConfirmedCategory());
        dto.setDonorConfirmedQuantity(entity.getDonorConfirmedQuantity());
        dto.setDonorConfirmedUnit(entity.getDonorConfirmedUnit());
        dto.setDonorConfirmedStorage(entity.getDonorConfirmedStorage());
        dto.setDonorConfirmedAllergens(entity.getDonorConfirmedAllergens());
        dto.setDonorConfirmedMinutes(entity.getDonorConfirmedMinutes());

        return dto;
    }

    private List<String> parseJsonList(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}

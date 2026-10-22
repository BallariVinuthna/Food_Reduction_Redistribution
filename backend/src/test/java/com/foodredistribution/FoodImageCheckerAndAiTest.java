package com.foodredistribution;

import com.foodredistribution.dto.AiChatRequest;
import com.foodredistribution.dto.AiChatResponse;
import com.foodredistribution.dto.ConfirmImageAssessmentRequest;
import com.foodredistribution.dto.FoodImageAssessmentDto;
import com.foodredistribution.entity.FoodImageCheck;
import com.foodredistribution.repository.FoodImageCheckRepository;
import com.foodredistribution.service.CloudinaryStorageService;
import com.foodredistribution.service.FoodImageCheckService;
import com.foodredistribution.service.OpenAiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class FoodImageCheckerAndAiTest {

    @Autowired
    private FoodImageCheckService foodImageCheckService;

    @Autowired
    private FoodImageCheckRepository repository;

    @Autowired
    private OpenAiService openAiService;

    @Autowired
    private CloudinaryStorageService storageService;

    private MockMultipartFile validBiryaniImage;
    private MockMultipartFile invalidPdfFile;
    private MockMultipartFile oversizedFile;

    @BeforeEach
    void setUp() {
        // Valid JPEG image mock
        byte[] sampleJpegBytes = new byte[]{
                (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0,
                0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01
        };
        validBiryaniImage = new MockMultipartFile(
                "file",
                "veg_biryani_hot.jpg",
                "image/jpeg",
                sampleJpegBytes
        );

        // Invalid PDF
        invalidPdfFile = new MockMultipartFile(
                "file",
                "document.pdf",
                "application/pdf",
                new byte[]{0x25, 0x50, 0x44, 0x46}
        );

        // Oversized >10MB
        byte[] largeBytes = new byte[11 * 1024 * 1024];
        oversizedFile = new MockMultipartFile(
                "file",
                "huge_photo.jpg",
                "image/jpeg",
                largeBytes
        );
    }

    @Test
    @DisplayName("Should successfully analyze valid food image and persist assessment")
    void testValidImageAnalysisAndPersistence() throws Exception {
        FoodImageAssessmentDto assessment = foodImageCheckService.uploadAndAnalyzeImage(validBiryaniImage, "provider@demo.local");

        assertNotNull(assessment);
        assertNotNull(assessment.getId());
        assertNotNull(assessment.getImageUrl());
        assertEquals("image/jpeg", assessment.getImageFormat());
        assertNotNull(assessment.getDetectedFoodName());
        assertTrue(assessment.getDetectedFoodName().toLowerCase().contains("biryani") || assessment.getDetectedFoodName().toLowerCase().contains("meal"));
        assertEquals("COOKED_MEALS", assessment.getDetectedCategory());
        assertTrue(assessment.getConfidenceScore() >= 0.70);
        assertNotNull(assessment.getAdvisoryDisclaimer());
        assertTrue(assessment.getAdvisoryDisclaimer().contains("ADVISORY VISUAL ASSESSMENT ONLY"));
        assertFalse(assessment.getVisibleCharacteristics().isEmpty());
        assertFalse(assessment.getVisualConcerns().isEmpty());
        assertEquals("PENDING_CONFIRMATION", assessment.getReviewStatus());

        // Verify entity persisted in MySQL
        FoodImageCheck persisted = repository.findById(assessment.getId()).orElse(null);
        assertNotNull(persisted);
        assertEquals("provider@demo.local", persisted.getUserEmail());
        assertEquals(assessment.getDetectedFoodName(), persisted.getDetectedFoodName());
    }

    @Test
    @DisplayName("Should reject unsupported file formats (PDF)")
    void testUnsupportedFileFormatRejection() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            storageService.uploadImage(invalidPdfFile);
        });
        assertTrue(exception.getMessage().contains("Unsupported image format"));
    }

    @Test
    @DisplayName("Should reject oversized files (>10MB)")
    void testOversizedFileRejection() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            storageService.uploadImage(oversizedFile);
        });
        assertTrue(exception.getMessage().contains("exceeds 10MB"));
    }

    @Test
    @DisplayName("Should allow donor to review, correct, and confirm AI assessment")
    void testDonorConfirmationAndAdjustment() throws Exception {
        FoodImageAssessmentDto initial = foodImageCheckService.uploadAndAnalyzeImage(validBiryaniImage, "provider@demo.local");

        ConfirmImageAssessmentRequest confirmReq = new ConfirmImageAssessmentRequest();
        confirmReq.setConfirmedFoodName("Hyderabadi Dum Biryani Special");
        confirmReq.setConfirmedCategory("COOKED_MEALS");
        confirmReq.setConfirmedQuantity(75.0);
        confirmReq.setConfirmedUnit("MEALS");
        confirmReq.setConfirmedStorage("HEATED_CONTAINER");
        confirmReq.setConfirmedAllergens("Vegetarian • Contains Dairy (Ghee)");
        confirmReq.setConfirmedMinutes(120);
        confirmReq.setApplyToListing(true);

        FoodImageAssessmentDto confirmed = foodImageCheckService.confirmAssessment(initial.getId(), confirmReq, "provider@demo.local");

        assertNotNull(confirmed);
        assertEquals("Hyderabadi Dum Biryani Special", confirmed.getDonorConfirmedFoodName());
        assertEquals(75.0, confirmed.getDonorConfirmedQuantity());
        assertEquals("APPLIED_TO_LISTING", confirmed.getReviewStatus());
        assertEquals(120, confirmed.getDonorConfirmedMinutes());

        FoodImageCheck persisted = repository.findById(initial.getId()).orElse(null);
        assertNotNull(persisted);
        assertEquals("APPLIED_TO_LISTING", persisted.getReviewStatus());
        assertEquals("Hyderabadi Dum Biryani Special", persisted.getDonorConfirmedFoodName());
    }

    @Test
    @DisplayName("Should provide intelligent chatbot answers for food safety and OTP doubts")
    void testAiChatbotResponses() {
        // Test Food Safety 2-hour rule question
        AiChatResponse responseSafety = openAiService.answerChatbotQuery("What is the 2-hour safety rule?", List.of());
        assertNotNull(responseSafety);
        assertNotNull(responseSafety.getReply());
        assertTrue(responseSafety.getReply().contains("60°C") || responseSafety.getReply().contains("2-Hour"));
        assertFalse(responseSafety.getSuggestedFollowUps().isEmpty());

        // Test OTP Handover question
        AiChatResponse responseOtp = openAiService.answerChatbotQuery("How does OTP handover verification work?", List.of());
        assertNotNull(responseOtp);
        assertNotNull(responseOtp.getReply());
        assertTrue(responseOtp.getReply().contains("OTP") || responseOtp.getReply().contains("Handover"));

        // Test Donation question
        AiChatResponse responseDonation = openAiService.answerChatbotQuery("How to donate food?", List.of());
        assertNotNull(responseDonation);
        assertNotNull(responseDonation.getReply());
        assertTrue(responseDonation.getReply().contains("Donate") || responseDonation.getReply().contains("Check"));
    }
}

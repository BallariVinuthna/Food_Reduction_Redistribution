package com.foodredistribution.controller;

import com.foodredistribution.dto.AiChatRequest;
import com.foodredistribution.dto.AiChatResponse;
import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.dto.ConfirmImageAssessmentRequest;
import com.foodredistribution.dto.FoodImageAssessmentDto;
import com.foodredistribution.service.FoodImageCheckService;
import com.foodredistribution.service.OpenAiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiAssistanceController {

    private final OpenAiService openAiService;
    private final FoodImageCheckService foodImageCheckService;

    public AiAssistanceController(OpenAiService openAiService, FoodImageCheckService foodImageCheckService) {
        this.openAiService = openAiService;
        this.foodImageCheckService = foodImageCheckService;
    }

    /**
     * AI Food Image Checker: Upload food image, validate format/size, run visual analysis,
     * upload to Cloudinary/local storage, and persist assessment to MySQL.
     */
    @PostMapping("/image-check/upload-and-analyze")
    public ResponseEntity<ApiResponse<FoodImageAssessmentDto>> uploadAndAnalyzeImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        String userEmail = authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")
                ? authentication.getName()
                : "provider@demo.local";

        // 1. Validation: File presence
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Food image file is required."));
        }

        // 2. Validation: Format
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png") && !contentType.equals("image/webp"))) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body(ApiResponse.error("Unsupported file format. Only JPEG, PNG, and WEBP images are supported."));
        }

        // 3. Validation: Size (Max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body(ApiResponse.error("File size exceeds 10MB maximum limit. Please upload a smaller image."));
        }

        try {
            FoodImageAssessmentDto assessment = foodImageCheckService.uploadAndAnalyzeImage(file, userEmail);
            return ResponseEntity.ok(ApiResponse.ok(assessment));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to analyze food image: " + e.getMessage()));
        }
    }

    /**
     * Donor confirmation / correction of AI-identified food details.
     */
    @PostMapping("/image-check/{id}/confirm")
    public ResponseEntity<ApiResponse<FoodImageAssessmentDto>> confirmImageCheck(
            @PathVariable String id,
            @RequestBody ConfirmImageAssessmentRequest request,
            Authentication authentication) {

        String userEmail = authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")
                ? authentication.getName()
                : "provider@demo.local";

        try {
            FoodImageAssessmentDto updated = foodImageCheckService.confirmAssessment(id, request, userEmail);
            return ResponseEntity.ok(ApiResponse.ok(updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update confirmation: " + e.getMessage()));
        }
    }

    /**
     * Get user's past image check history.
     */
    @GetMapping("/image-check/history")
    public ResponseEntity<ApiResponse<List<FoodImageAssessmentDto>>> getImageCheckHistory(Authentication authentication) {
        String userEmail = authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")
                ? authentication.getName()
                : "provider@demo.local";

        List<FoodImageAssessmentDto> history = foodImageCheckService.getUserHistory(userEmail);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    /**
     * AI Chatbot Assistant for answering doubts about food safety, donation workflows, and operations.
     */
    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chatWithAi(@RequestBody AiChatRequest request) {
        AiChatResponse response = openAiService.answerChatbotQuery(request.getMessage(), request.getHistory());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * Serve uploaded images safely.
     */
    @GetMapping(value = {"/uploads/images/{filename}", "/uploads/food-images/{filename}"})
    public ResponseEntity<org.springframework.core.io.Resource> serveUploadedImage(@PathVariable String filename) {
        try {
            java.nio.file.Path filePath = java.nio.file.Paths.get("uploads", "food-images", filename).toAbsolutePath().normalize();
            if (!java.nio.file.Files.exists(filePath)) {
                filePath = java.nio.file.Paths.get("uploads", filename).toAbsolutePath().normalize();
            }
            if (java.nio.file.Files.exists(filePath)) {
                org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());
                String contentType = java.nio.file.Files.probeContentType(filePath);
                if (contentType == null) contentType = "image/jpeg";
                return ResponseEntity.ok()
                        .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, contentType)
                        .body(resource);
            }
        } catch (Exception e) {
            // ignore
        }
        return ResponseEntity.notFound().build();
    }
}


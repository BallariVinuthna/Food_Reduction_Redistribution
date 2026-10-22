package com.foodredistribution.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

@Service
public class CloudinaryStorageService {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryStorageService.class);

    @Value("${app.cloudinary.cloud-name:pfyvtc1h}")
    private String cloudName;

    @Value("${app.cloudinary.api-key:864858557272116}")
    private String apiKey;

    @Value("${app.cloudinary.upload-preset:food}")
    private String uploadPreset;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Path localUploadDir = Paths.get("uploads", "food-images");

    public CloudinaryStorageService() {
        try {
            Files.createDirectories(localUploadDir);
        } catch (Exception e) {
            logger.warn("Could not create local upload directory: {}", e.getMessage());
        }
    }

    /**
     * Uploads an image file to Cloudinary with fallback to local persistent storage.
     */
    public String uploadImage(MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png") && !contentType.equals("image/webp"))) {
            throw new IllegalArgumentException("Unsupported image format. Allowed formats: JPEG, PNG, WEBP.");
        }

        // Limit to 10MB
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 10MB maximum limit.");
        }

        byte[] bytes = file.getBytes();
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg";
        String extension = getFileExtension(originalFilename);

        // 1. Try Cloudinary direct upload
        if (cloudName != null && !cloudName.isBlank()) {
            try {
                String cloudinaryUrl = uploadToCloudinaryHttp(bytes, contentType, originalFilename);
                if (cloudinaryUrl != null && !cloudinaryUrl.isBlank()) {
                    logger.info("Successfully uploaded image to Cloudinary: {}", cloudinaryUrl);
                    return cloudinaryUrl;
                }
            } catch (Exception e) {
                logger.warn("Cloudinary upload failed ({}); falling back to local storage.", e.getMessage());
            }
        }

        // 2. Fallback: Save to local directory and return local accessible URL
        String savedFilename = UUID.randomUUID().toString() + "." + extension;
        Path targetPath = localUploadDir.resolve(savedFilename);
        Files.write(targetPath, bytes);

        logger.info("Saved image to local storage at: {}", targetPath.toAbsolutePath());
        return "/api/ai/uploads/images/" + savedFilename;
    }

    private String uploadToCloudinaryHttp(byte[] fileBytes, String contentType, String filename) {
        try {
            String boundary = "----SurplusFlowBoundary" + System.currentTimeMillis();
            String base64Image = "data:" + contentType + ";base64," + Base64.getEncoder().encodeToString(fileBytes);

            // Construct multipart body
            StringBuilder sb = new StringBuilder();
            sb.append("--").append(boundary).append("\r\n");
            sb.append("Content-Disposition: form-data; name=\"upload_preset\"\r\n\r\n");
            sb.append(uploadPreset != null && !uploadPreset.isBlank() ? uploadPreset : "food").append("\r\n");

            sb.append("--").append(boundary).append("\r\n");
            sb.append("Content-Disposition: form-data; name=\"file\"\r\n\r\n");
            sb.append(base64Image).append("\r\n");

            sb.append("--").append(boundary).append("--\r\n");

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload"))
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofString(sb.toString()))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode json = objectMapper.readTree(response.body());
                if (json.has("secure_url")) {
                    return json.get("secure_url").asText();
                }
            } else {
                logger.warn("Cloudinary returned HTTP {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            logger.warn("Error uploading to Cloudinary: {}", e.getMessage());
        }
        return null;
    }

    private String getFileExtension(String filename) {
        int idx = filename.lastIndexOf('.');
        if (idx > 0 && idx < filename.length() - 1) {
            return filename.substring(idx + 1).toLowerCase();
        }
        return "jpg";
    }

    public Path getLocalUploadDir() {
        return localUploadDir;
    }
}

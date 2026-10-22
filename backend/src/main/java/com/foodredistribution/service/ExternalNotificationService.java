package com.foodredistribution.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class ExternalNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(ExternalNotificationService.class);

    @Value("${app.email.resend-api-key:}")
    private String resendApiKey;

    @Value("${app.email.from-address:onboarding@resend.dev}")
    private String emailFrom;

    @Value("${app.sms.twilio-sid:}")
    private String twilioSid;

    @Value("${app.sms.twilio-secret:}")
    private String twilioSecret;

    @Value("${app.sms.from-phone:+18005550199}")
    private String twilioFromPhone;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public boolean sendEmail(String to, String subject, String htmlContent) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            logger.warn("Resend API key not configured, skipping email dispatch to {}", to);
            return false;
        }

        try {
            String jsonPayload = String.format(
                    "{\"from\":\"SurplusFlow <%s>\",\"to\":[\"%s\"],\"subject\":\"%s\",\"html\":\"%s\"}",
                    emailFrom,
                    to,
                    subject.replace("\"", "\\\""),
                    htmlContent.replace("\"", "\\\"").replace("\n", "")
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                logger.info("Email successfully dispatched via Resend to {}: HTTP {}", to, response.statusCode());
                return true;
            } else {
                logger.warn("Resend email dispatch returned non-200 ({}): {}", response.statusCode(), response.body());
                return false;
            }
        } catch (Exception e) {
            logger.error("Failed to send email via Resend: {}", e.getMessage());
            return false;
        }
    }

    public boolean sendSms(String toPhone, String message) {
        if (twilioSid == null || twilioSecret == null || twilioSid.isBlank()) {
            logger.warn("Twilio credentials not configured, skipping SMS to {}", toPhone);
            return false;
        }

        try {
            String authHeader = "Basic " + Base64.getEncoder().encodeToString((twilioSid + ":" + twilioSecret).getBytes());
            String formBody = "To=" + java.net.URLEncoder.encode(toPhone, "UTF-8")
                    + "&From=" + java.net.URLEncoder.encode(twilioFromPhone, "UTF-8")
                    + "&Body=" + java.net.URLEncoder.encode(message, "UTF-8");

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.twilio.com/2010-04-01/Accounts/" + twilioSid + "/Messages.json"))
                    .header("Authorization", authHeader)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(formBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            logger.info("Twilio SMS dispatch attempt to {}: HTTP {}", toPhone, response.statusCode());
            return response.statusCode() >= 200 && response.statusCode() < 300;
        } catch (Exception e) {
            logger.error("Failed to send SMS via Twilio: {}", e.getMessage());
            return false;
        }
    }
}

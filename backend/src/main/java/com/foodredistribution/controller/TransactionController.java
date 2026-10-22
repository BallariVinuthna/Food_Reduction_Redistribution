package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.dto.DonationTransactionDto;
import com.foodredistribution.service.DonationTransactionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final DonationTransactionService donationTransactionService;

    public TransactionController(DonationTransactionService donationTransactionService) {
        this.donationTransactionService = donationTransactionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DonationTransactionDto>>> getAllTransactions(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<DonationTransactionDto> page = donationTransactionService.getAllTransactions(pageable);
        return ResponseEntity.ok(ApiResponse.ok(page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DonationTransactionDto>> getTransactionById(@PathVariable UUID id) {
        DonationTransactionDto dto = donationTransactionService.getTransactionById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<ApiResponse<List<DonationTransactionDto>>> getTransactionsForListing(@PathVariable UUID listingId) {
        List<DonationTransactionDto> list = donationTransactionService.getTransactionsForListing(listingId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/{id}/verify-pickup")
    public ResponseEntity<ApiResponse<DonationTransactionDto>> verifyPickupOtp(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> req,
            Authentication authentication) {
        String otp = (String) req.get("otp");
        Double actualQuantity = req.get("actualQuantity") != null ? Double.valueOf(req.get("actualQuantity").toString()) : null;
        String userEmail = authentication != null ? authentication.getName() : "volunteer@demo.local";

        DonationTransactionDto dto = donationTransactionService.verifyPickupOtp(id, otp, actualQuantity, userEmail);
        return ResponseEntity.ok(ApiResponse.ok("Pickup OTP successfully verified", dto));
    }

    @PostMapping("/{id}/verify-delivery")
    public ResponseEntity<ApiResponse<DonationTransactionDto>> verifyDeliveryOtp(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> req,
            Authentication authentication) {
        String otp = (String) req.get("otp");
        Double actualQuantity = req.get("actualQuantity") != null ? Double.valueOf(req.get("actualQuantity").toString()) : null;
        String userEmail = authentication != null ? authentication.getName() : "volunteer@demo.local";

        DonationTransactionDto dto = donationTransactionService.verifyDeliveryOtp(id, otp, actualQuantity, userEmail);
        return ResponseEntity.ok(ApiResponse.ok("Delivery OTP successfully verified", dto));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<DonationTransactionDto>> cancelTransaction(
            @PathVariable UUID id,
            @RequestBody Map<String, String> req,
            Authentication authentication) {
        String reason = req.getOrDefault("reason", "Cancelled by user");
        String userEmail = authentication != null ? authentication.getName() : "user@demo.local";

        DonationTransactionDto dto = donationTransactionService.cancelTransaction(id, reason, userEmail);
        return ResponseEntity.ok(ApiResponse.ok("Transaction cancelled", dto));
    }

    @PostMapping("/{id}/report-failed")
    public ResponseEntity<ApiResponse<DonationTransactionDto>> reportFailedHandover(
            @PathVariable UUID id,
            @RequestBody Map<String, String> req,
            Authentication authentication) {
        String reason = req.getOrDefault("reason", "Handover failed");
        String userEmail = authentication != null ? authentication.getName() : "volunteer@demo.local";

        DonationTransactionDto dto = donationTransactionService.reportFailedHandover(id, reason, userEmail);
        return ResponseEntity.ok(ApiResponse.ok("Handover marked as failed", dto));
    }
}

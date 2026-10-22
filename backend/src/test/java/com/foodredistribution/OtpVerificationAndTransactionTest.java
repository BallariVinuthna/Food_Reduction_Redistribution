package com.foodredistribution;

import com.foodredistribution.dto.DonationTransactionDto;
import com.foodredistribution.entity.*;
import com.foodredistribution.exception.BadRequestException;
import com.foodredistribution.repository.DonationTransactionRepository;
import com.foodredistribution.repository.FoodListingRepository;
import com.foodredistribution.service.AuditService;
import com.foodredistribution.service.DonationTransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OtpVerificationAndTransactionTest {

    @Mock
    private DonationTransactionRepository donationTransactionRepository;

    @Mock
    private FoodListingRepository foodListingRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private DonationTransactionService transactionService;

    private DonationTransaction sampleTransaction;
    private FoodListing sampleListing;

    @BeforeEach
    void setUp() {
        sampleListing = new FoodListing();
        sampleListing.setId(UUID.randomUUID());
        sampleListing.setFoodName("Surplus Biryani");
        sampleListing.setQuantity(50.0);
        sampleListing.setReservedQuantity(0.0);
        sampleListing.setRemainingQuantity(50.0);
        sampleListing.setUnit("MEALS");

        sampleTransaction = new DonationTransaction();
        sampleTransaction.setId(UUID.randomUUID());
        sampleTransaction.setFoodListing(sampleListing);
        sampleTransaction.setQuantityReserved(50.0);
        sampleTransaction.setUnit("MEALS");
        sampleTransaction.setPickupOtp("123456");
        sampleTransaction.setDeliveryOtp("654321");
        sampleTransaction.setStatus(TransactionStatus.ASSIGNED);
        sampleTransaction.setPickupOtpVerified(false);
        sampleTransaction.setDeliveryOtpVerified(false);
    }

    @Test
    @DisplayName("Verify Pickup OTP: Fails when invalid OTP is provided")
    void testVerifyPickupOtpInvalid() {
        when(donationTransactionRepository.findById(sampleTransaction.getId()))
                .thenReturn(Optional.of(sampleTransaction));

        assertThrows(BadRequestException.class, () -> {
            transactionService.verifyPickupOtp(sampleTransaction.getId(), "999999", 50.0, "volunteer@test.local");
        });
        assertFalse(sampleTransaction.isPickupOtpVerified());
    }

    @Test
    @DisplayName("Verify Pickup OTP: Succeeds with correct OTP and updates status to COLLECTED")
    void testVerifyPickupOtpSuccess() {
        when(donationTransactionRepository.findById(sampleTransaction.getId()))
                .thenReturn(Optional.of(sampleTransaction));
        when(donationTransactionRepository.save(any(DonationTransaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        DonationTransactionDto dto = transactionService.verifyPickupOtp(
                sampleTransaction.getId(), "123456", 50.0, "volunteer@test.local");

        assertTrue(dto.isPickupOtpVerified());
        assertEquals(TransactionStatus.COLLECTED, dto.getStatus());
        assertEquals(50.0, dto.getQuantityCollected());
    }

    @Test
    @DisplayName("Verify Delivery OTP: Fails if pickup OTP was not verified first")
    void testVerifyDeliveryBeforePickupFails() {
        when(donationTransactionRepository.findById(sampleTransaction.getId()))
                .thenReturn(Optional.of(sampleTransaction));

        assertThrows(BadRequestException.class, () -> {
            transactionService.verifyDeliveryOtp(sampleTransaction.getId(), "654321", 50.0, "volunteer@test.local");
        });
    }

    @Test
    @DisplayName("Verify Delivery OTP: Succeeds after pickup is verified")
    void testVerifyDeliveryOtpSuccess() {
        sampleTransaction.setPickupOtpVerified(true);
        sampleTransaction.setStatus(TransactionStatus.COLLECTED);

        when(donationTransactionRepository.findById(sampleTransaction.getId()))
                .thenReturn(Optional.of(sampleTransaction));
        when(donationTransactionRepository.save(any(DonationTransaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        DonationTransactionDto dto = transactionService.verifyDeliveryOtp(
                sampleTransaction.getId(), "654321", 50.0, "volunteer@test.local");

        assertTrue(dto.isDeliveryOtpVerified());
        assertEquals(TransactionStatus.DELIVERED, dto.getStatus());
        assertEquals(50.0, dto.getQuantityDelivered());
    }

    @Test
    @DisplayName("Double-reservation prevention: reserveQuantity rejects excess allocation")
    void testDoubleReservationPrevention() {
        FoodListing listing = new FoodListing();
        listing.setQuantity(100.0);
        listing.setReservedQuantity(80.0);
        listing.setRemainingQuantity(20.0);

        // Trying to reserve 30 when only 20 is remaining
        boolean success = listing.reserveQuantity(30.0);
        assertFalse(success);
        assertEquals(20.0, listing.getRemainingQuantity());
        assertEquals(80.0, listing.getReservedQuantity());

        // Reserving 20 should succeed
        boolean success2 = listing.reserveQuantity(20.0);
        assertTrue(success2);
        assertEquals(0.0, listing.getRemainingQuantity());
        assertEquals(100.0, listing.getReservedQuantity());
    }
}

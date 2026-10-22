package com.foodredistribution.repository;

import com.foodredistribution.entity.DonationTransaction;
import com.foodredistribution.entity.TransactionStatus;
import com.foodredistribution.entity.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DonationTransactionRepository extends JpaRepository<DonationTransaction, UUID> {

    List<DonationTransaction> findByFoodListingId(UUID foodListingId);
    List<DonationTransaction> findByProviderId(UUID providerId);
    List<DonationTransaction> findByReceiverId(UUID receiverId);
    List<DonationTransaction> findByVolunteerId(UUID volunteerId);
    List<DonationTransaction> findByStatus(TransactionStatus status);
    Page<DonationTransaction> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(TransactionStatus status);
    long countByVerificationStatus(VerificationStatus verificationStatus);

    @Query("SELECT COUNT(t) FROM DonationTransaction t WHERE t.createdAt BETWEEN :start AND :end")
    long countTransactionsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(t.quantityListed), 0.0) FROM DonationTransaction t WHERE t.createdAt BETWEEN :start AND :end")
    Double sumQuantityListedBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(t.quantityDelivered), 0.0) FROM DonationTransaction t WHERE t.status = 'DELIVERED' AND t.deliveredAt BETWEEN :start AND :end")
    Double sumQuantityDeliveredBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(t.quantityReserved), 0.0) FROM DonationTransaction t WHERE t.foodListing.id = :listingId AND t.status NOT IN ('CANCELLED', 'FAILED')")
    Double sumActiveReservedQuantityForListing(@Param("listingId") UUID listingId);

    // Grouping by Food Category
    @Query("SELECT t.foodListing.foodCategory, COUNT(t), COALESCE(SUM(t.quantityDelivered), 0.0) " +
           "FROM DonationTransaction t WHERE t.status = 'DELIVERED' " +
           "GROUP BY t.foodListing.foodCategory")
    List<Object[]> getDeliveredByCategory();

    // Grouping by Locality
    @Query("SELECT t.provider.address, COUNT(t), COALESCE(SUM(t.quantityDelivered), 0.0) " +
           "FROM DonationTransaction t WHERE t.status = 'DELIVERED' " +
           "GROUP BY t.provider.address")
    List<Object[]> getDeliveredByLocality();

    // Find by verification OTP
    Optional<DonationTransaction> findByPickupOtp(String pickupOtp);
    Optional<DonationTransaction> findByDeliveryOtp(String deliveryOtp);
}

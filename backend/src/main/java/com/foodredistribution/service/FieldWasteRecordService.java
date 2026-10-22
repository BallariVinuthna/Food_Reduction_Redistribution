package com.foodredistribution.service;

import com.foodredistribution.dto.FieldWasteRecordDto;
import com.foodredistribution.entity.FieldWasteRecord;
import com.foodredistribution.entity.VerificationStatus;
import com.foodredistribution.exception.BadRequestException;
import com.foodredistribution.exception.ResourceNotFoundException;
import com.foodredistribution.repository.FieldWasteRecordRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class FieldWasteRecordService {

    private final FieldWasteRecordRepository fieldWasteRecordRepository;
    private final AuditService auditService;

    public FieldWasteRecordService(FieldWasteRecordRepository fieldWasteRecordRepository,
                                  AuditService auditService) {
        this.fieldWasteRecordRepository = fieldWasteRecordRepository;
        this.auditService = auditService;
    }

    @Transactional
    public FieldWasteRecordDto logFieldRecord(FieldWasteRecordDto dto, String userEmail) {
        if (dto.getObservationPeriodEnd() != null && dto.getObservationPeriodStart() != null) {
            if (dto.getObservationPeriodEnd().isBefore(dto.getObservationPeriodStart())) {
                throw new BadRequestException("Observation period end cannot be before observation period start");
            }
        }

        FieldWasteRecord record = new FieldWasteRecord(
                dto.getVenueName(),
                dto.getVenueType(),
                dto.getLocality(),
                dto.getFoodCategory(),
                dto.getQuantity(),
                dto.getUnit() != null ? dto.getUnit() : "KG",
                dto.getObservationPeriodStart() != null ? dto.getObservationPeriodStart() : LocalDateTime.now().minusHours(4),
                dto.getObservationPeriodEnd() != null ? dto.getObservationPeriodEnd() : LocalDateTime.now(),
                dto.getObservationShift(),
                dto.getDataSource() != null ? dto.getDataSource() : "AUDITOR_PHYSICAL_SCALE",
                dto.getAuditorName() != null ? dto.getAuditorName() : userEmail,
                false, // Real field entries must have isDemo = false!
                dto.getNotes()
        );

        record.setVerificationStatus(VerificationStatus.PENDING_REVIEW);
        record = fieldWasteRecordRepository.save(record);

        auditService.log(userEmail, "LOG_FIELD_WASTE", "FieldWasteRecord", record.getId().toString(),
                "Logged " + record.getQuantity() + " " + record.getUnit() + " at " + record.getVenueName());

        return mapToDto(record);
    }

    @Transactional
    public FieldWasteRecordDto verifyRecord(UUID id, boolean approve, String notes, String userEmail) {
        FieldWasteRecord record = fieldWasteRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Field waste record not found: " + id));

        record.setVerificationStatus(approve ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED);
        record.setVerifiedAt(LocalDateTime.now());
        record.setVerifiedBy(userEmail);
        if (notes != null) {
            record.setNotes((record.getNotes() != null ? record.getNotes() + "; " : "") + notes);
        }
        record = fieldWasteRecordRepository.save(record);

        auditService.log(userEmail, "VERIFY_FIELD_WASTE", "FieldWasteRecord", record.getId().toString(),
                "Verification outcome: " + record.getVerificationStatus());

        return mapToDto(record);
    }

    public Page<FieldWasteRecordDto> searchRecords(Boolean isDemo, String locality, String foodCategory,
                                                   LocalDateTime startDate, LocalDateTime endDate,
                                                   Pageable pageable) {
        return fieldWasteRecordRepository.searchRecords(isDemo, locality, foodCategory, startDate, endDate, pageable)
                .map(this::mapToDto);
    }

    public FieldWasteRecordDto getRecordById(UUID id) {
        return fieldWasteRecordRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Field waste record not found: " + id));
    }

    public String exportFieldWasteCsv(Boolean isDemo) {
        var records = fieldWasteRecordRepository.findByIsDemo(isDemo != null ? isDemo : false);
        StringWriter sw = new StringWriter();
        sw.write("Record ID,Venue Name,Venue Type,Locality,Category,Quantity,Unit,Period Start,Period End,Shift,Data Source,Auditor,Verification Status,Verified By,Is Demo,Notes\n");
        for (FieldWasteRecord r : records) {
            sw.write(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.2f,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%b,\"%s\"\n",
                    r.getId(),
                    r.getVenueName().replace("\"", "'"),
                    r.getVenueType(),
                    r.getLocality(),
                    r.getFoodCategory(),
                    r.getQuantity(),
                    r.getUnit(),
                    r.getObservationPeriodStart() != null ? r.getObservationPeriodStart().toString() : "",
                    r.getObservationPeriodEnd() != null ? r.getObservationPeriodEnd().toString() : "",
                    r.getObservationShift() != null ? r.getObservationShift() : "",
                    r.getDataSource(),
                    r.getAuditorName() != null ? r.getAuditorName() : "",
                    r.getVerificationStatus(),
                    r.getVerifiedBy() != null ? r.getVerifiedBy() : "",
                    r.isDemo(),
                    r.getNotes() != null ? r.getNotes().replace("\"", "'") : ""
            ));
        }
        return sw.toString();
    }

    public FieldWasteRecordDto mapToDto(FieldWasteRecord r) {
        FieldWasteRecordDto dto = new FieldWasteRecordDto();
        dto.setId(r.getId());
        dto.setVenueName(r.getVenueName());
        dto.setVenueType(r.getVenueType());
        dto.setLocality(r.getLocality());
        dto.setFoodCategory(r.getFoodCategory());
        dto.setQuantity(r.getQuantity());
        dto.setUnit(r.getUnit());
        dto.setObservationPeriodStart(r.getObservationPeriodStart());
        dto.setObservationPeriodEnd(r.getObservationPeriodEnd());
        dto.setObservationShift(r.getObservationShift());
        dto.setDataSource(r.getDataSource());
        dto.setAuditorName(r.getAuditorName());
        dto.setVerificationStatus(r.getVerificationStatus());
        dto.setVerifiedAt(r.getVerifiedAt());
        dto.setVerifiedBy(r.getVerifiedBy());
        dto.setDemo(r.isDemo());
        dto.setNotes(r.getNotes());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}

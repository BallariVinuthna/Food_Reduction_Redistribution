package com.foodredistribution.service;

import com.foodredistribution.entity.AuditLog;
import com.foodredistribution.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String userEmail, String action, String entity, String entityId, String details) {
        AuditLog auditLog = new AuditLog(userEmail, action, entity, entityId, details);
        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }
}

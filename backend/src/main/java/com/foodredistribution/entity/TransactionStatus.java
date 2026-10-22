package com.foodredistribution.entity;

public enum TransactionStatus {
    PENDING,
    RESERVED,
    ASSIGNED,
    EN_ROUTE,
    ARRIVED,
    COLLECTED,
    DELIVERED,
    CANCELLED,
    FAILED
}

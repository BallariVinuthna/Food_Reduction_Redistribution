-- ========================================================
-- SMART FOOD WASTE REDUCTION AND REDISTRIBUTION SYSTEM
-- MySQL 8.4 Database DDL Schema (V1__schema.sql)
-- Standardized relational schema with audit trails,
-- durable transactions, OTP verification, and benchmark logging.
-- ========================================================

-- 1. USERS & ROLES
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. FOOD PROVIDERS
CREATE TABLE IF NOT EXISTS food_providers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    reliability_score DOUBLE NOT NULL DEFAULT 95.0,
    active_listings_count INT DEFAULT 0,
    total_donated_meals INT DEFAULT 0,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'VERIFIED',
    verified_at DATETIME(6),
    verified_by VARCHAR(255),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_provider_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. RECEIVERS (NGOs, Shelters)
CREATE TABLE IF NOT EXISTS receivers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    capacity_meals INT NOT NULL DEFAULT 50,
    dietary_preference VARCHAR(50) DEFAULT 'ANY',
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    reliability_score DOUBLE NOT NULL DEFAULT 96.0,
    total_received_meals INT DEFAULT 0,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'VERIFIED',
    verified_at DATETIME(6),
    verified_by VARCHAR(255),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_receiver_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. VOLUNTEERS
CREATE TABLE IF NOT EXISTS volunteers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(50) DEFAULT 'TWO_WHEELER',
    current_latitude DOUBLE,
    current_longitude DOUBLE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    active_pickups_count INT DEFAULT 0,
    total_completed_pickups INT DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_volunteer_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. FOOD LISTINGS
CREATE TABLE IF NOT EXISTS food_listings (
    id VARCHAR(36) PRIMARY KEY,
    provider_id VARCHAR(36) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    food_name VARCHAR(255) NOT NULL,
    food_category VARCHAR(100) NOT NULL,
    quantity DOUBLE NOT NULL,
    reserved_quantity DOUBLE NOT NULL DEFAULT 0.0,
    remaining_quantity DOUBLE NOT NULL DEFAULT 0.0,
    unit VARCHAR(50) NOT NULL DEFAULT 'MEALS',
    preparation_time DATETIME(6) NOT NULL,
    available_from DATETIME(6) NOT NULL,
    available_until DATETIME(6) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    food_condition VARCHAR(100) NOT NULL,
    is_vegetarian BOOLEAN NOT NULL DEFAULT TRUE,
    allergen_info VARCHAR(255),
    storage_condition VARCHAR(100) DEFAULT 'ROOM_TEMP',
    pickup_instructions TEXT,
    photo_url VARCHAR(500),
    contact_phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    urgency_level VARCHAR(50) NOT NULL DEFAULT 'LOW',
    available_minutes_remaining BIGINT,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_listing_provider FOREIGN KEY (provider_id) REFERENCES food_providers(id) ON DELETE CASCADE,
    INDEX idx_listing_status (status),
    INDEX idx_listing_urgency (urgency_level),
    INDEX idx_listing_available_until (available_until),
    INDEX idx_listing_category (food_category),
    INDEX idx_listing_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. FOOD SAFETY CHECKS
CREATE TABLE IF NOT EXISTS food_safety_checks (
    id VARCHAR(36) PRIMARY KEY,
    food_listing_id VARCHAR(36) NOT NULL,
    temperature_safe BOOLEAN NOT NULL DEFAULT TRUE,
    clean_packaging BOOLEAN NOT NULL DEFAULT TRUE,
    prepared_within_safe_window BOOLEAN NOT NULL DEFAULT TRUE,
    allergen_declared BOOLEAN NOT NULL DEFAULT TRUE,
    provider_certified BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    checked_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_safety_listing FOREIGN KEY (food_listing_id) REFERENCES food_listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. MATCHES
CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(36) PRIMARY KEY,
    food_listing_id VARCHAR(36) NOT NULL,
    receiver_id VARCHAR(36) NOT NULL,
    match_score DOUBLE NOT NULL,
    location_score DOUBLE,
    quantity_score DOUBLE,
    urgency_score DOUBLE,
    food_type_score DOUBLE,
    capacity_score DOUBLE,
    reliability_score DOUBLE,
    distance_km DOUBLE,
    estimated_pickup_minutes INT DEFAULT 20,
    status VARCHAR(50) NOT NULL DEFAULT 'PROPOSED',
    attempt_id VARCHAR(36),
    requested_quantity DOUBLE,
    allocated_quantity DOUBLE,
    is_split_allocation BOOLEAN NOT NULL DEFAULT FALSE,
    split_batch_number INT DEFAULT 1,
    execution_time_ms BIGINT,
    proposed_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    responded_at DATETIME(6),
    response_notes TEXT,
    CONSTRAINT fk_match_listing FOREIGN KEY (food_listing_id) REFERENCES food_listings(id) ON DELETE CASCADE,
    CONSTRAINT fk_match_receiver FOREIGN KEY (receiver_id) REFERENCES receivers(id) ON DELETE CASCADE,
    INDEX idx_match_listing (food_listing_id),
    INDEX idx_match_receiver (receiver_id),
    INDEX idx_match_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. PICKUP ASSIGNMENTS
CREATE TABLE IF NOT EXISTS pickup_assignments (
    id VARCHAR(36) PRIMARY KEY,
    match_id VARCHAR(36) NOT NULL,
    volunteer_id VARCHAR(36),
    status VARCHAR(50) NOT NULL DEFAULT 'ASSIGNED',
    pickup_otp VARCHAR(10),
    delivery_otp VARCHAR(10),
    pickup_otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
    delivery_otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
    actual_quantity_collected DOUBLE,
    actual_quantity_delivered DOUBLE,
    cancellation_reason VARCHAR(500),
    failed_reason VARCHAR(500),
    assigned_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    en_route_at DATETIME(6),
    arrived_at DATETIME(6),
    picked_up_at DATETIME(6),
    delivered_at DATETIME(6),
    proof_notes TEXT,
    proof_photo_url VARCHAR(500),
    CONSTRAINT fk_pickup_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    CONSTRAINT fk_pickup_volunteer FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE SET NULL,
    INDEX idx_pickup_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. PICKUP EVENTS (Append-Only Event History)
CREATE TABLE IF NOT EXISTS pickup_events (
    id VARCHAR(36) PRIMARY KEY,
    pickup_assignment_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    actor_email VARCHAR(255),
    actor_role VARCHAR(50),
    actual_quantity DOUBLE,
    verification_method VARCHAR(50),
    cancellation_reason VARCHAR(500),
    failed_reason VARCHAR(500),
    timestamp DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    latitude DOUBLE,
    longitude DOUBLE,
    description TEXT,
    CONSTRAINT fk_event_pickup FOREIGN KEY (pickup_assignment_id) REFERENCES pickup_assignments(id) ON DELETE CASCADE,
    INDEX idx_event_pickup (pickup_assignment_id),
    INDEX idx_event_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. DONATION TRANSACTIONS (Durable Double-Entry Ledger)
CREATE TABLE IF NOT EXISTS donation_transactions (
    id VARCHAR(36) PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    food_listing_id VARCHAR(36) NOT NULL,
    provider_id VARCHAR(36) NOT NULL,
    receiver_id VARCHAR(36) NOT NULL,
    volunteer_id VARCHAR(36),
    quantity_listed DOUBLE NOT NULL,
    quantity_reserved DOUBLE NOT NULL,
    quantity_collected DOUBLE,
    quantity_delivered DOUBLE,
    unit VARCHAR(50) NOT NULL DEFAULT 'MEALS',
    status VARCHAR(50) NOT NULL DEFAULT 'RESERVED',
    verification_status VARCHAR(50) NOT NULL DEFAULT 'UNVERIFIED',
    pickup_otp VARCHAR(10),
    delivery_otp VARCHAR(10),
    pickup_otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
    delivery_otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
    reserved_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    assigned_at DATETIME(6),
    en_route_at DATETIME(6),
    arrived_at DATETIME(6),
    collected_at DATETIME(6),
    delivered_at DATETIME(6),
    cancelled_at DATETIME(6),
    cancellation_reason VARCHAR(500),
    failed_reason VARCHAR(500),
    notes TEXT,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_tx_listing FOREIGN KEY (food_listing_id) REFERENCES food_listings(id) ON DELETE CASCADE,
    CONSTRAINT fk_tx_provider FOREIGN KEY (provider_id) REFERENCES food_providers(id) ON DELETE CASCADE,
    CONSTRAINT fk_tx_receiver FOREIGN KEY (receiver_id) REFERENCES receivers(id) ON DELETE CASCADE,
    CONSTRAINT fk_tx_volunteer FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE SET NULL,
    INDEX idx_tx_status (status),
    INDEX idx_tx_provider (provider_id),
    INDEX idx_tx_receiver (receiver_id),
    INDEX idx_tx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. FIELD WASTE RECORDS (Empirical Field Observations)
CREATE TABLE IF NOT EXISTS field_waste_records (
    id VARCHAR(36) PRIMARY KEY,
    venue_name VARCHAR(255) NOT NULL,
    venue_type VARCHAR(100) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    food_category VARCHAR(100) NOT NULL,
    quantity DOUBLE NOT NULL,
    unit VARCHAR(50) NOT NULL DEFAULT 'KG',
    observation_period_start DATETIME(6) NOT NULL,
    observation_period_end DATETIME(6) NOT NULL,
    observation_shift VARCHAR(100),
    data_source VARCHAR(255) NOT NULL,
    auditor_name VARCHAR(255),
    verification_status VARCHAR(50) NOT NULL DEFAULT 'UNVERIFIED',
    verified_at DATETIME(6),
    verified_by VARCHAR(255),
    is_demo BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_waste_venue_type (venue_type),
    INDEX idx_waste_locality (locality),
    INDEX idx_waste_category (food_category),
    INDEX idx_waste_verification (verification_status),
    INDEX idx_waste_demo (is_demo),
    INDEX idx_waste_period_start (observation_period_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    recipient_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    reference_id VARCHAR(255),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_notif_recipient FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_recipient (recipient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. BASELINE METRICS (Module 1 Data Points)
CREATE TABLE IF NOT EXISTS baseline_metrics (
    id VARCHAR(36) PRIMARY KEY,
    metric_key VARCHAR(100) NOT NULL UNIQUE,
    metric_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    baseline_value DOUBLE NOT NULL,
    unit VARCHAR(50) NOT NULL,
    data_source VARCHAR(255),
    notes TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. BENCHMARK RUNS (Module 5 Empirical Benchmark Executions)
CREATE TABLE IF NOT EXISTS benchmark_runs (
    id VARCHAR(36) PRIMARY KEY,
    run_id VARCHAR(100) NOT NULL UNIQUE,
    executed_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    total_scenarios INT NOT NULL DEFAULT 20,
    successful_matches INT NOT NULL DEFAULT 0,
    failed_matches INT NOT NULL DEFAULT 0,
    actual_match_success_rate DOUBLE NOT NULL DEFAULT 0.0,
    actual_average_matching_time_seconds DOUBLE NOT NULL DEFAULT 0.0,
    actual_notification_success_rate DOUBLE NOT NULL DEFAULT 0.0,
    actual_data_storage_integrity_rate DOUBLE NOT NULL DEFAULT 100.0,
    actual_workflow_success_rate DOUBLE NOT NULL DEFAULT 0.0,
    validation_outcome VARCHAR(50) NOT NULL DEFAULT 'PASS',
    recommendation TEXT,
    is_simulation BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_bench_run_id (run_id),
    INDEX idx_bench_executed_at (executed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. PROTOTYPE TESTS (Individual Scenario Execution Results)
CREATE TABLE IF NOT EXISTS prototype_tests (
    id VARCHAR(36) PRIMARY KEY,
    benchmark_run_id VARCHAR(36),
    run_id VARCHAR(100),
    scenario_name VARCHAR(255) NOT NULL,
    food_type VARCHAR(100),
    quantity DOUBLE,
    available_minutes INT,
    location_name VARCHAR(255),
    distance_km DOUBLE,
    matched_receiver_name VARCHAR(255),
    match_score DOUBLE,
    execution_time_ms BIGINT,
    match_success BOOLEAN NOT NULL,
    notification_success BOOLEAN NOT NULL DEFAULT TRUE,
    storage_success BOOLEAN NOT NULL DEFAULT TRUE,
    workflow_success BOOLEAN NOT NULL DEFAULT TRUE,
    failure_reason TEXT,
    is_simulation BOOLEAN NOT NULL DEFAULT TRUE,
    test_timestamp DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_test_benchmark_run (benchmark_run_id),
    INDEX idx_test_run_id (run_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    details TEXT,
    timestamp DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_audit_timestamp (timestamp),
    INDEX idx_audit_entity (entity, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. SYSTEM IDEAS (Module 4 Convergence Matrix)
CREATE TABLE IF NOT EXISTS system_ideas (
    id VARCHAR(36) PRIMARY KEY,
    idea_number INT NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    problem_solved TEXT NOT NULL,
    engineering_domains VARCHAR(255) NOT NULL,
    impact_score DOUBLE NOT NULL,
    feasibility_score DOUBLE NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. ADMIN CONFIG
CREATE TABLE IF NOT EXISTS admin_configs (
    id VARCHAR(36) PRIMARY KEY,
    weight_distance DOUBLE NOT NULL DEFAULT 0.30,
    weight_quantity DOUBLE NOT NULL DEFAULT 0.20,
    weight_urgency DOUBLE NOT NULL DEFAULT 0.20,
    weight_food_type DOUBLE NOT NULL DEFAULT 0.15,
    weight_capacity DOUBLE NOT NULL DEFAULT 0.10,
    weight_availability DOUBLE NOT NULL DEFAULT 0.05,
    max_search_radius_km DOUBLE NOT NULL DEFAULT 25.0,
    urgency_critical_minutes INT NOT NULL DEFAULT 60,
    urgency_high_minutes INT NOT NULL DEFAULT 120,
    urgency_medium_minutes INT NOT NULL DEFAULT 240,
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

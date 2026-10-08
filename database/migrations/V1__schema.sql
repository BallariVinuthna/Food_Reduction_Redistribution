-- ========================================================
-- SMART FOOD WASTE REDUCTION AND REDISTRIBUTION SYSTEM
-- PostgreSQL Database DDL Schema (V1__schema.sql)
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. FOOD PROVIDERS
CREATE TABLE IF NOT EXISTS food_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    reliability_score DOUBLE PRECISION DEFAULT 95.0,
    active_listings_count INT DEFAULT 0,
    total_donated_meals INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. RECEIVERS (NGOs, Shelters)
CREATE TABLE IF NOT EXISTS receivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    capacity_meals INT NOT NULL DEFAULT 50,
    dietary_preference VARCHAR(50) DEFAULT 'ANY',
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    reliability_score DOUBLE PRECISION DEFAULT 96.0,
    total_received_meals INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. VOLUNTEERS
CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(50) DEFAULT 'TWO_WHEELER',
    current_latitude DOUBLE PRECISION,
    current_longitude DOUBLE PRECISION,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    active_pickups_count INT DEFAULT 0,
    total_completed_pickups INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. FOOD LISTINGS
CREATE TABLE IF NOT EXISTS food_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES food_providers(id) ON DELETE CASCADE,
    food_name VARCHAR(255) NOT NULL,
    food_category VARCHAR(100) NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    unit VARCHAR(50) DEFAULT 'MEALS' NOT NULL,
    preparation_time TIMESTAMP NOT NULL,
    available_from TIMESTAMP NOT NULL,
    available_until TIMESTAMP NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    food_condition VARCHAR(100) NOT NULL,
    is_vegetarian BOOLEAN DEFAULT TRUE NOT NULL,
    allergen_info VARCHAR(255),
    storage_condition VARCHAR(100) DEFAULT 'ROOM_TEMP',
    pickup_instructions TEXT,
    photo_url VARCHAR(500),
    contact_phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    urgency_level VARCHAR(50) NOT NULL DEFAULT 'LOW',
    available_minutes_remaining BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_listing_status ON food_listings(status);
CREATE INDEX IF NOT EXISTS idx_listing_urgency ON food_listings(urgency_level);
CREATE INDEX IF NOT EXISTS idx_listing_available_until ON food_listings(available_until);
CREATE INDEX IF NOT EXISTS idx_listing_category ON food_listings(food_category);
CREATE INDEX IF NOT EXISTS idx_listing_location ON food_listings(latitude, longitude);

-- 6. FOOD SAFETY CHECKS
CREATE TABLE IF NOT EXISTS food_safety_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_listing_id UUID NOT NULL REFERENCES food_listings(id) ON DELETE CASCADE,
    temperature_safe BOOLEAN DEFAULT TRUE NOT NULL,
    clean_packaging BOOLEAN DEFAULT TRUE NOT NULL,
    prepared_within_safe_window BOOLEAN DEFAULT TRUE NOT NULL,
    allergen_declared BOOLEAN DEFAULT TRUE NOT NULL,
    provider_certified BOOLEAN DEFAULT TRUE NOT NULL,
    notes TEXT,
    checked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. MATCHES
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_listing_id UUID NOT NULL REFERENCES food_listings(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES receivers(id) ON DELETE CASCADE,
    match_score DOUBLE PRECISION NOT NULL,
    location_score DOUBLE PRECISION,
    quantity_score DOUBLE PRECISION,
    urgency_score DOUBLE PRECISION,
    food_type_score DOUBLE PRECISION,
    capacity_score DOUBLE PRECISION,
    reliability_score DOUBLE PRECISION,
    distance_km DOUBLE PRECISION,
    estimated_pickup_minutes INT DEFAULT 20,
    status VARCHAR(50) NOT NULL DEFAULT 'PROPOSED',
    proposed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    response_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_match_listing ON matches(food_listing_id);
CREATE INDEX IF NOT EXISTS idx_match_receiver ON matches(receiver_id);
CREATE INDEX IF NOT EXISTS idx_match_status ON matches(status);

-- 8. PICKUP ASSIGNMENTS
CREATE TABLE IF NOT EXISTS pickup_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    volunteer_id UUID REFERENCES volunteers(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ASSIGNED',
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    en_route_at TIMESTAMP,
    arrived_at TIMESTAMP,
    picked_up_at TIMESTAMP,
    delivered_at TIMESTAMP,
    proof_notes TEXT,
    proof_photo_url VARCHAR(500)
);

-- 9. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    reference_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. BASELINE METRICS (Module 1 Configurable)
CREATE TABLE IF NOT EXISTS baseline_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_key VARCHAR(100) UNIQUE NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    baseline_value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(50) NOT NULL,
    data_source VARCHAR(255),
    notes TEXT,
    is_demo BOOLEAN DEFAULT TRUE NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. PROTOTYPE TESTS (Module 5 Empirical Benchmarking)
CREATE TABLE IF NOT EXISTS prototype_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_name VARCHAR(255) NOT NULL,
    food_type VARCHAR(100),
    quantity DOUBLE PRECISION,
    available_minutes INT,
    location_name VARCHAR(255),
    distance_km DOUBLE PRECISION,
    matched_receiver_name VARCHAR(255),
    match_score DOUBLE PRECISION,
    execution_time_ms BIGINT,
    match_success BOOLEAN NOT NULL,
    notification_success BOOLEAN DEFAULT TRUE,
    storage_success BOOLEAN DEFAULT TRUE,
    workflow_success BOOLEAN DEFAULT TRUE,
    failure_reason TEXT,
    test_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    details TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. SYSTEM IDEAS (Module 4)
CREATE TABLE IF NOT EXISTS system_ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idea_number INT UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    problem_solved TEXT NOT NULL,
    engineering_domains VARCHAR(255) NOT NULL,
    impact_score DOUBLE PRECISION NOT NULL,
    feasibility_score DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT
);

-- 14. ADMIN CONFIG
CREATE TABLE IF NOT EXISTS admin_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    weight_distance DOUBLE PRECISION DEFAULT 0.30 NOT NULL,
    weight_quantity DOUBLE PRECISION DEFAULT 0.20 NOT NULL,
    weight_urgency DOUBLE PRECISION DEFAULT 0.20 NOT NULL,
    weight_food_type DOUBLE PRECISION DEFAULT 0.15 NOT NULL,
    weight_capacity DOUBLE PRECISION DEFAULT 0.10 NOT NULL,
    weight_availability DOUBLE PRECISION DEFAULT 0.05 NOT NULL,
    max_search_radius_km DOUBLE PRECISION DEFAULT 25.0 NOT NULL,
    urgency_critical_minutes INT DEFAULT 60 NOT NULL,
    urgency_high_minutes INT DEFAULT 120 NOT NULL,
    urgency_medium_minutes INT DEFAULT 240 NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

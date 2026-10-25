-- ============================================================================
-- Migration V2: Smart Surplus Prediction & Preparation Advisor
-- Enhances surplus_prediction_records for comprehensive food preparation tracking,
-- demand prediction calibrations, and donation workflow handoff.
-- ============================================================================

ALTER TABLE surplus_prediction_records 
    ADD COLUMN quantity_remaining DOUBLE DEFAULT 0.0,
    ADD COLUMN customers_served INT,
    ADD COLUMN notes VARCHAR(1000),
    ADD COLUMN safety_margin_pct DOUBLE DEFAULT 10.0,
    ADD COLUMN donation_listing_id VARCHAR(36),
    ADD COLUMN updated_at DATETIME(6);

-- Populate quantity_remaining on existing historical records
UPDATE surplus_prediction_records 
SET quantity_remaining = GREATEST(0, quantity_prepared - (IFNULL(quantity_consumed, 0) + IFNULL(quantity_donated, 0) + IFNULL(quantity_discarded, 0)))
WHERE quantity_remaining IS NULL OR quantity_remaining = 0;

-- Indexes for efficient historical aggregation
CREATE INDEX idx_pred_provider_date ON surplus_prediction_records (provider_id, record_date);
CREATE INDEX idx_pred_provider_item_meal ON surplus_prediction_records (provider_id, food_item_name, meal_period);

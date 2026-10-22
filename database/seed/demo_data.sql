-- ========================================================
-- SMART FOOD WASTE REDUCTION AND REDISTRIBUTION SYSTEM
-- MySQL 8.4 Demo Seed Data (database/seed/demo_data.sql)
-- NOTICE: ALL VALUES ARE EXPLICITLY LABELED AS [DEMO DATA]
-- Real field measurements must be entered via field audit logging.
-- ========================================================

-- Module 1 Configurable Baselines (Clearly marked as demo baseline metrics)
INSERT INTO baseline_metrics (id, metric_key, metric_name, description, baseline_value, unit, data_source, is_demo)
VALUES
(UUID(), 'DATA_POINT_A', 'Amount of edible surplus becoming waste', 'Field observation metric measuring unconsumed edible food discarded per kitchen per day prior to platform intervention.', 48.5, 'kg / day / venue', 'ILLUSTRATIVE DEMO DATA — REPLACE WITH FIELD DATA', TRUE),
(UUID(), 'DATA_POINT_B', 'Time taken to identify and redistribute surplus food', 'Manual telephone coordination and transit dispatch latency before platform intervention.', 210.0, 'minutes', 'ILLUSTRATIVE DEMO DATA — REPLACE WITH FIELD DATA', TRUE),
(UUID(), 'QUANTITY_PREPARED', 'Average quantity prepared per banquet', 'Total meal servings cooked per average event.', 450.0, 'meals', 'ILLUSTRATIVE DEMO DATA — REPLACE WITH FIELD DATA', TRUE),
(UUID(), 'QUANTITY_DISCARDED', 'Percentage of prepared food discarded', 'Ratio of prepared food discarded directly to municipal bins.', 18.2, '%', 'ILLUSTRATIVE DEMO DATA — REPLACE WITH FIELD DATA', TRUE)
ON DUPLICATE KEY UPDATE
    baseline_value = VALUES(baseline_value),
    description = VALUES(description),
    data_source = VALUES(data_source),
    is_demo = VALUES(is_demo);

-- Module 4 System Ideas
INSERT INTO system_ideas (id, idea_number, title, problem_solved, engineering_domains, impact_score, feasibility_score, status, notes)
VALUES
(UUID(), 1, 'Smart Surplus Food Redistribution Platform', 'Edible surplus is not identified and connected to suitable receivers in time.', 'CSE + Data Science', 9.0, 9.0, 'SELECTED', 'Core MVP architecture with durable transactions and OTP verifications.'),
(UUID(), 2, 'AI-Based Food Demand Prediction', 'Over-preparation caused by inaccurate demand estimation.', 'CSE + AI/Data Science', 8.5, 6.0, 'FUTURE EXTENSION', 'Requires historical POS dataset across Hyderabad banquet halls.'),
(UUID(), 3, 'Smart Food Waste Monitoring (IoT)', 'Organizations do not know how much food is wasted or where.', 'CSE + IoT/ECE', 8.0, 5.5, 'FUTURE EXTENSION', 'Hardware scale load-cells on commercial bin enclosures.'),
(UUID(), 4, 'Surplus Food Alert System', 'Receivers may not know about available surplus in time.', 'CSE + Communication/ECE', 8.5, 9.2, 'SELECTED', 'Real-time WebSocket STOMP push notifications.'),
(UUID(), 5, 'Smart Food Matching and Priority System', 'Surplus may not reach the most suitable receiver before its usable time ends.', 'CSE + Data Science', 9.5, 8.8, 'SELECTED', 'MCDA Haversine matching algorithm with split allocation and expiry urgency.'),
(UUID(), 6, 'Food Waste Awareness and Behaviour System', 'Repeated food waste caused by consumer behaviour and low awareness.', 'CSE + Data Science', 6.5, 8.5, 'SUPPORTING FEATURE', 'Public dashboards and empirical field audit tracking.')
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    problem_solved = VALUES(problem_solved),
    impact_score = VALUES(impact_score),
    feasibility_score = VALUES(feasibility_score),
    status = VALUES(status),
    notes = VALUES(notes);

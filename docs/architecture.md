# TECHNICAL ARCHITECTURE DOCUMENTATION

## 1. System Overview
**SurplusFlow** is an enterprise-grade full-stack web system developed for the Problem Solving in Engineering (PSE) project. It bridges the gap between commercial surplus food generation and food-insecure communities in Hyderabad through automated Multi-Criteria Decision Analysis (MCDA), urgency decay management, and synchronized volunteer routing.

---

## 2. Layered Architecture

```
┌────────────────────────────────────────────────────────┐
│             REACT 19 + TYPESCRIPT FRONTEND             │
│   (Tailwind v4, Leaflet OSM, Recharts, Lucide Icons)   │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (Port 8080) & WebSocket / STOMP
┌───────────────────────────▼────────────────────────────┐
│              SPRING BOOT 3.3.4 (JAVA 21)               │
│                                                        │
│  [CONTROLLER LAYER]                                    │
│   AuthController, FoodListingController,               │
│   MatchingController, PickupController,                │
│   AnalyticsController, PseController                   │
│                                                        │
│  [SECURITY & AUTH LAYER]                               │
│   Spring Security, BCrypt, JJWT 0.12.6,                │
│   JwtAuthenticationFilter, RBAC Evaluator              │
│                                                        │
│  [SERVICE LAYER & ENGINES]                             │
│   MatchingEngine (MCDA + Haversine Distance),          │
│   FoodExpirationScheduler (@Scheduled 60s),            │
│   NotificationService (STOMP WebSockets),              │
│   PrototypeTestService (20-Scenario Benchmark Runner)  │
│                                                        │
│  [REPOSITORY LAYER & ORM]                              │
│   Spring Data JPA / Hibernate                          │
└───────────────────────────┬────────────────────────────┘
                            │ JDBC Connection Pool (HikariCP)
┌───────────────────────────▼────────────────────────────┐
│                  POSTGRESQL DATABASE                   │
│   Tables: users, food_providers, receivers, volunteers, │
│   food_listings, food_safety_checks, matches, pickups, │
│   baseline_metrics, prototype_tests, audit_logs        │
└────────────────────────────────────────────────────────┘
```

---

## 3. Core Algorithms & Mathematical Formulations

### 3.1 Haversine Great-Circle Distance
To compute spatial distance between food donor coordinates $(lat_1, lon_1)$ and receiver coordinates $(lat_2, lon_2)$ across the curvature of the Earth:

$$\Delta\phi = \text{radians}(lat_2 - lat_1)$$
$$\Delta\lambda = \text{radians}(lon_2 - lon_1)$$
$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\text{radians}(lat_1))\cos(\text{radians}(lat_2))\sin^2\left(\frac{\Delta\lambda}{2}\right)$$
$$c = 2 \cdot \text{atan2}(\sqrt{a}, \sqrt{1 - a})$$
$$d = R \cdot c \quad (\text{where } R = 6371 \text{ km})$$

### 3.2 Multi-Criteria Decision Analysis (MCDA) Scoring
Every potential recipient receiver is ranked using a configurable weighted utility function:

$$\text{MATCH SCORE} = w_{dist} \cdot S_{loc} + w_{qty} \cdot S_{qty} + w_{urg} \cdot S_{urg} + w_{type} \cdot S_{type} + w_{cap} \cdot S_{cap} + w_{rel} \cdot S_{rel}$$

Default Admin Weights:
- $w_{dist} = 0.30$ (Location Proximity: $S_{loc} = 100 \cdot (1 - \frac{d}{d_{max}})$)
- $w_{qty} = 0.20$ (Quantity Fit: Perfect match if capacity $\ge$ quantity)
- $w_{urg} = 0.20$ (Urgency Priority: Escalates if time remaining &lt; 60 mins)
- $w_{type} = 0.15$ (Dietary Suitability: 100% for veg, 0% for non-veg to veg-only shelters)
- $w_{cap} = 0.10$ (Capacity Headroom: Avoids assigning small lots to giant distribution hubs)
- $w_{rel} = 0.05$ (Reliability: Historical timely handovers and acceptance rate)

---

## 4. Database Schema Design
- **Primary Keys:** Standard UUIDs (`java.util.UUID`) generated via `GenerationType.UUID`.
- **Foreign Keys & Cascades:**
  - `users` (1) ── (1) `food_providers`
  - `users` (1) ── (1) `receivers`
  - `food_providers` (1) ── (N) `food_listings`
  - `food_listings` (1) ── (1) `food_safety_checks`
  - `food_listings` (1) ── (N) `matches`
  - `matches` (1) ── (1) `pickup_assignments`
  - `pickup_assignments` (1) ── (N) `pickup_events`
- **Audit Logging:** Every critical state transition (surplus creation, match acceptance, pickup status change) writes an immutable record to `audit_logs`.

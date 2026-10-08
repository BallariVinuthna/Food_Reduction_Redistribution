# Smart Food Waste Reduction and Redistribution System (SurplusFlow)

> **Problem Solving in Engineering (PSE) Prototype**  
> **Location Scope:** Hyderabad, Telangana, India (Scalable Metropolitan Architecture)  
> **Tech Stack:** Java 21 / Spring Boot 3.3.4 • MySQL (root:root) • React 19 • TypeScript • Leaflet OSM • Recharts • WebSocket STOMP

---

## 1. Project Overview & Objective
Large quantities of edible food become surplus due to over-preparation, unpredictable banquet attendance, and buffer food service. Simultaneously, community shelters and food-insecure populations lack consistent nutrition.

**SurplusFlow** intervenes at the fundamental system leverage point:
$$\text{Surplus Food} \longrightarrow \text{Identification} \longrightarrow \text{MCDA Matching} \longrightarrow \text{Real-Time Alert} \longrightarrow \text{Acceptance} \longrightarrow \text{Volunteer Transit} \longrightarrow \text{Redistribution}$$

The system operates across **Restaurants, Hotels, Hostels, College Canteens, Corporate Cafeterias, Supermarkets, Marriage Halls, Catering Services, NGOs, Shelters, Community Kitchens, and Volunteers** *(commercial cloud kitchens are explicitly excluded)*.

---

## 2. PSE 5-Module Systems Thinking Framework

### Layer 1: Understand the Problem (Module 1 — Project Informatics Document)
- **Super System:** Environmental Sustainability & Resource Management System
- **Specific Subsystem:** Food Waste Generation and Redistribution Ecosystem
- **5W2H Analysis:** Systematic decomposition of symptoms, contributors, peak meal windows, and lifecycle.
- **Configurable Baseline Data:** Baseline metrics are explicitly segregated from prototype results and marked as `"ILLUSTRATIVE DEMO DATA — REPLACE WITH FIELD DATA"` until field research is logged.

### Layer 2: Understand Why It Happens (Module 2 — Root Cause Analysis)
- **The Iceberg Model:** Deconstruction across Event $\to$ Patterns $\to$ Systemic Structures $\to$ Mental Models.
- **Bottlenecks Identified:**
  - *Data Bottleneck:* Information asymmetry regarding food volume and expiry countdown.
  - *Process Bottleneck:* 2 to 4 hour manual coordination lag leading to microbial degradation.
  - *Human Bottleneck:* Operational fatigue among kitchen staff leading to garbage bin defaults.

### Layer 3: Find Where to Intervene (Module 3 — Causal Loop Dynamics)
- **Reinforcing Loop (R1):** The Waste Perpetuation Loop (Vicious cycle of normalized over-preparation).
- **Balancing Loop (B1):** Food Waste Awareness & Prevention Loop.
- **System Archetype:** *Shifting the Burden* (municipal trash bins provide a convenient symptomatic fix that erodes the motivation to build proactive redistribution mechanisms).
- **Primary Leverage Point:** *Timely identification and redistribution of edible surplus food before biological spoilage occurs.*

### Layer 4: Build the Best Solution (Module 4 — Divergent & Convergent Thinking)
- **Six Interdisciplinary Ideas:** Evaluated across Computer Science (CSE), Data Science (DS), IoT, and Communication Engineering (ECE).
- **2x2 Convergence Matrix:** Selected Bundle = Idea 1 (Platform) + Idea 4 (Real-Time Alerts) + Idea 5 (MCDA Matching Engine).

### Layer 5: Prove That It Works (Module 5 — Empirical Validation & Benchmarking)
- **Single Critical Technical Assumption:**
  > *"The system can successfully match an available surplus-food listing with a suitable receiver within the food's available redistribution time."*
- **Target vs. Actual Empirical Results (20 Hyderabad Scenarios):**
  - Match Success: Target $\ge 80\%$ $\to$ **Actual 95.0%** (PASS)
  - Latency: Target $\le 30$ seconds $\to$ **Actual 0.002 seconds** (PASS)
  - Notification Success: Target $\ge 90\%$ $\to$ **Actual 95.0%** (PASS)
  - Data Storage Integrity: Target $100\%$ $\to$ **Actual 100.0%** (PASS)
  - Overall Validation Outcome: **PASS**

---

## 3. Technology Architecture & Key Features

### Backend (Java Full-Stack)
- **Java 21 / Spring Boot 3.3.4:** Clean layered architecture (`Controller` $\to$ `Service` $\to$ `Repository` $\to$ `Entity`).
- **Spring Security & JJWT 0.12.6:** Stateless JWT authentication with BCrypt password hashing.
- **Spring Data JPA & PostgreSQL:** Full relational schema with indexes, transactions, and audit trails.
- **Multi-Criteria Decision Analysis (MCDA) Engine:** Haversine spatial calculations, quantity fit, urgency decay weighting, dietary compatibility, and reliability scoring.
- **WebSocket STOMP:** Real-time push updates for listings, matches, and transit status.
- **Automated Expiration Scheduler:** Periodic `@Scheduled` background worker transitioning elapsed surplus items.

### Frontend (Modern Environmental UI/UX)
- **React 19 + TypeScript + Vite:** Modular component hierarchy.
- **Environmental Design System:** Tailwind CSS tokens (Deep Emerald, Forest, Fresh Lime, Teal).
- **Interactive OpenStreetMap (Leaflet):** Geocoded donor, receiver, and volunteer nodes across Hyderabad.
- **Surplus Creation Wizard:** 5-step flow with mandatory Food Safety Checklist.
- **1-Click Demo Persona Switcher:** Instant role switching for evaluation.

---

## 4. Demo Personas & Credentials

All test accounts use development password: **`DemoPass123!`**

| Role | Email | Persona | Key Features |
| :--- | :--- | :--- | :--- |
| **FOOD_PROVIDER** | `provider@demo.local` | Taj Banjara Grand Hotel | Surplus creation wizard, safety checklist, map, active listings |
| **NGO_RECEIVER** | `receiver@demo.local` | Robin Hood Army Hyderabad | Review ranked matches, accept donation, cascade reject |
| **VOLUNTEER** | `volunteer@demo.local` | Vikram Sharma | Pickup route, 5-stage status advancement, proof notes |
| **ADMIN** | `admin@demo.local` | PSE System Admin | Analytics, MCDA weight tuning sliders, audit logs |

---

## 5. How to Run Locally

### Prerequisites
- Java 21+ (`java -version`)
- Maven 3.9+ (`mvn -version`)
- Node.js 20+ & npm (`node -v`)
- MySQL 8+ / 9+ running on port 3306 with password `root`

### Step 1: Start MySQL
Ensure MySQL is running and database `food_redistribution_db` exists:
```bash
mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS food_redistribution_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Step 2: Start Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
*Backend will start on `http://localhost:8080` with auto-seeded demo data for Hyderabad in MySQL.*

### Step 3: Start React Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend will open on `http://localhost:5173` with automatic API reverse-proxying.*

---

## 6. Running with Docker Compose
To launch the entire multi-container stack in one command:
```bash
docker compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- MySQL: `localhost:3306` (user: `root`, password: `root`)

---

## 7. Running Automated Tests & Benchmark
- **Unit & Integration Tests:**
  ```bash
  cd backend
  mvn test
  ```
- **Module 5 Benchmark Simulation:**
  Navigate to the **Validation & Tests** tab in the web UI and click **"Run 20-Scenario Benchmark"** to trigger live empirical execution across Hyderabad testbed scenarios.

---

## 8. Final Demonstration Scenario (Viva Evaluation Walkthrough)
1. **Login as Food Provider:** Select `provider@demo.local` via the 1-click switcher.
2. **Register Surplus Food:** Open wizard $\to$ Enter 50 meals $\to$ Set 90 min timer $\to$ Verify Food Safety Checklist $\to$ Click "Publish".
3. **MCDA Engine Execution:** Backend evaluates Haversine proximity and scores Robin Hood Army as the #1 match (94%).
4. **Login as NGO Receiver:** Switch to `receiver@demo.local` $\to$ View incoming surplus alert $\to$ Click "Accept & Dispatch".
5. **Volunteer Pickup Transit:** Switch to `volunteer@demo.local` $\to$ Progress status: `Mark En Route` $\to$ `Mark Arrived` $\to$ `Confirm Food Collected` $\to$ `Confirm Safely Delivered`.
6. **Live Analytics Recalculation:** Switch to `admin@demo.local` $\to$ Observe real-time increments in meals redistributed, food waste avoided (kg), and economic value saved (₹).
7. **Module 5 Validation:** Review Target vs. Actual table and before/after comparison.

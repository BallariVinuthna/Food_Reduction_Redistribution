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
- **MySQL 8.4 Standardization:** Standardized on MySQL 8.4 (InnoDB, UTF-8 MB4) with Flyway migrations (`V1__schema.sql`).
- **Durable Donation Transactions:** Concurrency control (`@Version` optimistic locking) prevents double reservations; double OTP handovers (Pickup OTP + Delivery OTP).
- **Multi-Criteria Decision Analysis (MCDA) Engine:** Haversine spatial calculations, dynamic urgency decay weighting, capacity headroom, and split-lot allocation.
- **Database-Backed Analytics:** Strictly zero hardcoded latency/delivery constants; returns "No data yet" when empty; date-range/locality/category filters; CSV downloads.
- **Empirical Field Waste Audits:** Physical scale logs kept strictly distinct from simulation runs and demo data.
- **WebSocket STOMP:** Real-time push updates for listings, matches, and transit status.
- **Automated Expiration Scheduler:** Periodic `@Scheduled` background worker transitioning elapsed surplus items.
- **AI Food Image Checker Service:** Multipart image inspection with format/size validation (JPEG/PNG/WEBP, ≤10MB), Cloudinary cloud storage with local disk fallback, OpenAI Vision GPT-4o-mini integration with domain heuristic fallback, and advisory safety disclaimer.
- **AI Assistant Chatbot Engine:** Real-time conversational assistant for food safety rules, OTP verification protocols, donation workflows, and operations.

### Frontend (Modern Environmental UI/UX)
- **React 19 + TypeScript + Vite:** Modular component hierarchy.
- **Environmental Design System:** Tailwind CSS tokens (`#032C20` Deep Forest, `#087B46` Primary Green, `#8BE34B` Bright Lime, `#F6F8F7` Clean Slate).
- **Interactive OpenStreetMap (Leaflet):** Geocoded donor, receiver, and volunteer nodes across Hyderabad.
- **AI Food Image Checker Component:** Integrated fast-track in Create Donation wizard supporting drag-and-drop, camera capture, progress animation, confidence scoring, visual checks, and donor confirmation before form pre-filling.
- **Floating AI Chatbot Widget:** Global floating assistant with pre-populated prompt chips, conversation memory, and immediate answers to food safety and operational doubts.
- **Surplus Creation Wizard:** 5-step flow with mandatory Food Safety Checklist.
- **Handover Verification Modals:** Volunteer OTP input for collection & delivery handovers.
- **Preserved Benchmark History:** Run selector to browse historical `SIM-...` benchmark executions without losing data.
- **1-Click Demo Persona Switcher:** Instant role switching for evaluation.

---

### Environment Variables & AI Configuration

| Variable | Description | Default |
| :--- | :--- | :--- |
| `OPENAI_API_KEY` | OpenAI API key for Vision analysis & Chatbot | Configured via `.env` / `application.yml` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Product Environment | `pfyvtc1h` |
| `CLOUDINARY_API_KEY` | Cloudinary Key | `864858557272116` |
| `CLOUDINARY_UPLOAD_PRESET`| Cloudinary Preset Name | `food` |
| `JWT_SECRET` | 256-bit HMAC secret for authentication | Auto-configured in `.env` |

> **Food Safety Advisory Disclaimer:**  
> AI visual analysis provides preliminary advisory categorization and does not certify microbiological safety. Harmful bacteria, toxins, and internal holding temperatures cannot be verified from a photograph. Donors must independently confirm hot holding (>60°C) or cold storage (<5°C) compliance before publishing.

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

---

## 9. Smart Surplus Prediction & Preparation Advisor (Feature 2)

### Overview & Source Prevention Objective
Food waste prevention must occur **before** food becomes surplus. The **Smart Surplus Prediction & Preparation Advisor** helps restaurants, hotels, hostels, and college canteens estimate expected consumption and calibrate preparation quantities:
- **Prevention at Source:** Prevents buffer surplus from being cooked unnecessarily.
- **Redistribution Integration:** If edible surplus still occurs despite prevention, one-click handoff allows the provider to review remaining leftovers and publish a donation listing with verified food safety compliance.

### Core Modules
1. **Food Preparation Tracker (Data Entry):**
   - Records: Food item, category, date, meal period, quantity prepared, served/sold, donated, discarded, customers served, and notes.
   - Enforces conservation of quantity: $\text{Served} + \text{Donated} + \text{Discarded} \le \text{Prepared}$.
   - Automatically computes unallocated remaining leftovers: $\text{Remaining} = \text{Prepared} - (\text{Served} + \text{Donated} + \text{Discarded})$.
   - Prevents negative inputs and duplicate accidental submissions on the same date/meal.
2. **Transparent Statistical Demand Prediction:**
   - Evaluates historical records by food item, meal period, and day of week.
   - Blends matching day-of-week demand ($65\%$) with general moving average ($35\%$) when $\ge 2$ matching days exist.
   - Computes standard deviation and confidence intervals ($\pm 1.28 \sigma$).
   - Recommends preparation using a configurable safety buffer ($0\%$ to $25\%$, default $10\%$).
   - Honestly reports data insufficiency when $<3$ observations exist.
3. **Preparation Advisor Dashboard:**
   - Live KPI cards: Total Prepared, Served, Donated, Discarded, Unallocated Remaining, Avoidable Waste Prevented.
   - Visual trend charts (Area & Bar charts using Recharts).
   - Recurring Leftover Items table with specific batch trimming advice.
   - Model Evaluation Panel (Section 10): Mean Absolute Error (MAE), Mean Absolute Percentage Error (MAPE), and Forecast Accuracy %.
4. **Surplus Redistribution Handoff:**
   - Records with remaining edible food feature a **"Donate Remaining"** action.
   - Seamlessly pre-fills `CreateListingWizard` with food name, quantity, unit, storage condition, and safety notes.
   - Automatically marks the source preparation record as donated upon successful listing publication.

### Key API Endpoints
- `POST /api/prediction/preparation-records`: Log a meal preparation and consumption record with validation.
- `PUT /api/prediction/preparation-records/{id}`: Update an existing preparation record.
- `GET /api/prediction/preparation-records`: Filter historical preparation logs.
- `GET /api/prediction/advisor/forecast`: Smart demand prediction and recommended prep quantity.
- `GET /api/prediction/advisor/dashboard`: Comprehensive dashboard summary, recurring leftovers, and MAE evaluation metrics.
- `POST /api/prediction/preparation-records/{id}/donate-handoff`: Retrieve prefilled donation data for remaining leftovers.
- `POST /api/prediction/preparation-records/{id}/mark-donated`: Link donation listing and update donated quantities.

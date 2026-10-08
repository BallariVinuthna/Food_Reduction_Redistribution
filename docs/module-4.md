# PSE MODULE 4: DIVERGENT & CONVERGENT THINKING

## 1. Divergent Thinking: Six Brainstormed Engineering Solutions

To address the leverage point, six distinct interdisciplinary solutions were formulated across Computer Science, Data Science, IoT, and Communication Engineering.

| Idea # | Title | Engineering Domains | Problem Solved | Impact (1–10) | Feasibility (1–10) | Status |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **1** | **Smart Surplus Redistribution Platform** | CSE + Data Science | Edible surplus is not identified and connected to suitable receivers in time. | 9.0 | 9.0 | **SELECTED FOR MVP** |
| **2** | **AI-Based Food Demand Prediction** | CSE + AI / Data Science | Over-preparation caused by inaccurate customer demand estimation. | 8.5 | 6.0 | **FUTURE EXTENSION** |
| **3** | **Smart Food Waste Monitoring (IoT)** | CSE + IoT / ECE | Commercial kitchens do not know how much food is wasted or from which prep stations. | 8.0 | 5.5 | **FUTURE EXTENSION** |
| **4** | **Surplus Food Alert System** | CSE + Communication / ECE | Receivers do not know about available surplus in time to arrange collection. | 8.5 | 9.2 | **SELECTED FOR MVP** |
| **5** | **Smart Food Matching & Priority System** | CSE + Data Science | Surplus does not reach the most suitable receiver before its usable time ends. | 9.5 | 8.8 | **SELECTED FOR MVP** |
| **6** | **Food Waste Awareness & Behaviour System** | CSE + Data Science | Repeated food waste caused by consumer behaviour and low awareness. | 6.5 | 8.5 | **SUPPORTING FEATURE** |

---

## 2. Convergent Thinking: 2x2 Impact-Feasibility Matrix

```
       IMPACT ▲
              │
          10  │   [Idea 2: AI Demand]         [Idea 5: Smart Matching]
              │                                [Idea 1: Redistribution Platform]
              │   [Idea 3: IoT Sensors]        [Idea 4: Real-Time Alerts]
           7  │
              │                                [Idea 6: Awareness Analytics]
              │
           0  └────────────────────────────────────────────────────────►
              0                       5                       10   FEASIBILITY
                               (MVP CUTOFF LINE)
```

### 2.1 Convergence Evaluation
1. **Selected Core Bundle (High Impact + High Feasibility):**
   - **Idea 1 (Platform) + Idea 4 (Alerts) + Idea 5 (MCDA Matching):** These three form a unified, executable, and robust core MVP prototype. They directly dismantle the data bottleneck (information asymmetry) and process bottleneck (latency lag).
2. **Future Extensions (High Impact + Medium Feasibility):**
   - **Idea 2 (AI Demand Prediction):** High potential, but requires 6+ months of historical point-of-sale dining data per kitchen to train accurate regressors.
   - **Idea 3 (IoT Smart Bins):** High data precision, but requires physical load cell hardware installation and microcontroller calibration on commercial kitchen bins.
3. **Supporting Feature (Medium Impact + High Feasibility):**
   - **Idea 6 (Awareness System):** Implemented in the prototype through audited impact metrics, avoided landfill charts, and economic value calculations.

---

## 3. Final Selected Solution Architecture

**Project Title:** Smart Food Waste Reduction and Redistribution System (`SurplusFlow`)

### 3.1 Interdisciplinary Engineering Integration
- **Computer Science & Engineering (CSE):** Clean layered REST API architecture, Spring Boot backend, Spring Security, BCrypt password hashing, JPA persistence, React TypeScript SPA.
- **Data Science (DS):** Multi-Criteria Decision Analysis (MCDA), Haversine geographic spatial calculations, dynamic urgency decay weight adjustment, ranking algorithms.
- **Electronics & Communication (ECE / IoT):** Geolocation coordinates, OpenStreetMap cartography, WebSocket/STOMP bidirectional push notifications.
- **Environmental Systems Engineering:** Food waste mass diversion metrics (kg), avoided carbon equivalents, economic value saved (INR).

### 3.2 Solution Architecture Flow
```
Food Provider
      ↓
[1. Surplus Registration Wizard with Safety Verification]
      ↓
[2. Database Persistence & Geocoding (PostgreSQL)]
      ↓
[3. Real-Time Urgency Engine (Calculates Shelf-Life Window)]
      ↓
[4. MCDA Smart Matching Engine]
      ├── Location Proximity (30% weight via Haversine)
      ├── Quantity Fit (20% weight)
      ├── Urgency Decay (20% weight)
      ├── Dietary Compatibility (15% weight)
      ├── Receiver Capacity Headroom (10% weight)
      └── Recipient Reliability Record (5% weight)
      ↓
[5. Top Ranked Receiver Discovery & WebSocket Push Alert]
      ↓
[6. Receiver Acceptance / Fallback Cascading Logic]
      ↓
[7. Volunteer Transit Assignment & Leaflet GPS Routing]
      ↓
[8. Collection Verification & Proof of Delivery Handover]
      ↓
[9. Automated Impact Analytics & Module 5 Benchmark Logging]
```

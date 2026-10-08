# PSE MODULE 1: PROJECT INFORMATICS DOCUMENT (PID)

## 1. System Definition
- **Super System:** Environmental Sustainability & Resource Management System
- **Specific Subsystem:** Food Waste Generation and Redistribution Ecosystem
- **Problem Area:** Food surplus generation, food wastage, and inefficient redistribution
- **Specific Focus:** Understanding and reducing avoidable food waste by improving the identification, coordination, and redistribution of edible surplus food before biological spoilage occurs.
- **Geographic Scope:** Hyderabad, Telangana, India (Primary prototype scope; architecture scalable to other metropolitan regions).

> **Important Architectural Note:** Module 1 describes the AS-IS problem. The original problem description is not mixed with proposed technical solutions.

---

## 2. 5W2H Problem Analysis Framework

### WHAT (Observed Symptoms)
- Large quantities of wholesome, edible food discarded into municipal waste streams.
- Surplus food remaining unused after events, buffets, and corporate dining shifts.
- Delays in identifying usable surplus before microbial degradation begins.
- Difficulty discovering verified, nearby recipient organizations with adequate capacity.
- Communication and coordination friction between donors, volunteers, and shelters.
- Transportation limitations and absence of cold-chain transit.
- Environmental loss: embedded water, agricultural energy, and methane emissions from landfills.

### WHO IS AFFECTED
- **Food Providers:** Commercial loss, disposal overhead, ethical guilt.
- **Food Insecure Communities / Consumers:** Missed nourishment opportunities.
- **NGOs, Shelters, and Community Kitchens:** Unpredictable supply and last-minute transit shortages.
- **Volunteers & Collection Partners:** Logistic confusion without coordinates or food specifics.
- **Waste Management Workers & Municipalities:** Heavy solid waste loads.
- **Environment:** Carbon dioxide and methane emissions from organic decomposition in landfills.

### WHO CONTRIBUTES TO THE PROBLEM
- **Food Providers:** Over-preparation, over-purchasing, inaccurate demand forecasting.
- **Consumers:** Buffet over-serving, unpredictable event attendance.
- **Logistics Disconnect:** Fragmented phone calls and WhatsApp groups without real-time geocoding.
- **Delayed Redistribution:** Inertia in alerting receivers within the 60–120 minute edible window.

### WHEN
Surplus peaks systematically during:
- Meal transition periods (after lunch: 2:30 PM – 4:00 PM; after dinner: 10:30 PM – 12:00 AM)
- Weddings, banquets, and social conventions
- Weekend dining spikes and festival buffets
- End-of-day institutional cafeteria service

### WHERE
- Restaurants, hotels, hostels, and college canteens
- Corporate cafeterias and tech parks (e.g., Hitec City, Madhapur, Gachibowli)
- Marriage halls and convention centers (e.g., Banjara Hills, Secunderabad, Jubilee Hills)
- Supermarkets and catering hubs
- Household event venues

### HOW (The Linear AS-IS Lifecycle Path)
```
Food Procurement → Preparation → Serving → Consumption
       ↓
Surplus Generated (Unserved buffer or over-preparation)
       ↓
Surplus Overlooked / Delayed Identification (1 to 3 hours lag)
       ↓
Informal Uncoordinated Communication Attempts (Phone calls)
       ↓
No Timely Transport / Receiver Found
       ↓
Food Spoilage (Exceeds temperature safe window)
       ↓
Municipal Solid Waste Disposal → Landfill Methane Emissions
```

### HOW MUCH (Configurable Baseline Field Observations)
The system does not invent baseline statistics. All demo values are explicitly labeled:
`"ILLUSTRATIVE DEMO DATA — REPLACE WITH FIELD DATA"`

| Metric Key | Metric Description | Illustrative Demo Value | Unit | Data Source |
| :--- | :--- | :--- | :--- | :--- |
| `DATA_POINT_A` | Amount of edible surplus becoming waste | 48.5 | kg / day / venue | Illustrative Demo Data |
| `DATA_POINT_B` | Time taken to identify and redistribute surplus | 210.0 | minutes | Illustrative Demo Data |
| `QUANTITY_PREPARED` | Average meal portions cooked per banquet | 450.0 | meals | Illustrative Demo Data |
| `QUANTITY_DISCARDED` | Ratio of prepared food discarded to landfill | 18.2 | % | Illustrative Demo Data |

---

## 3. Preliminary Problem Statement
> "Food waste is a systemic problem caused by multiple interacting factors including inaccurate demand estimation, over-preparation, excess food, consumer behaviour, storage limitations and delays in redistribution. Edible surplus may remain unused because food providers, volunteers, NGOs and potential receivers are not effectively coordinated within the limited usable time of the food. This results in avoidable food waste, resource loss and environmental impact."

---

## 4. System Boundary

| Inside System Boundary | Outside System Boundary |
| :--- | :--- |
| Surplus identification & registration | Agricultural crop production & farming |
| Food specifications (quantity, allergens, condition) | Industrial food manufacturing |
| Geolocation, distance, & routing | National interstate supply chains |
| Available usable redistribution time & urgency | Landfill dump engineering operations |
| Multi-criteria receiver scoring & ranking | Government legislative food policy |
| Real-time WebSocket & push notifications | Long-distance freight logistics |
| Receiver reservation & acceptance workflow | Municipal sewer and composting equipment |
| Volunteer transit & handover verification | Commercial cloud kitchens (explicitly excluded) |
| Impact measurement (meals, kg diverted, INR saved) | Private catering recipe creation |

---

## 5. How Might We (HMW) Statements
- **HMW 1:** How might we reduce the amount of edible surplus food that becomes waste?
- **HMW 2:** How might we improve timely identification and redistribution of edible surplus food?
- **HMW 3:** How might we improve coordination between food providers, volunteers, NGOs, and receivers so that surplus food reaches suitable receivers before it becomes waste?

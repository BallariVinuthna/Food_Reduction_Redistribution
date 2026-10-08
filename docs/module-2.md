# PSE MODULE 2: SYSTEMS MAPPING & ROOT CAUSE ANALYSIS

## 1. The Iceberg Model Analysis

The Iceberg Model allows systems thinkers to look beyond the surface event and uncover the deeper systemic structures and mental models that continuously generate the symptom.

```
       ▲  [EVENT]
      / \  Edible surplus food is left unused or discarded as waste.
     /   \
    /=====\======================================================== (Waterline)
   /       \ [PATTERNS]
  /         \ Surplus repeatedly occurs at buffets; pickup delays;
 /           \ nearby receivers unaware of food within safe window.
/             \ [STRUCTURES]
               \ Fragmented phone coordination; missing geocoding;
                \ no capacity matching; decoupled disposal bins.
                 \ [MENTAL MODELS]
                  \ "Disposal is cheaper than spending hours calling."
                   \ "I want to help, but I need accurate coordinates."
```

### 1.1 Level 1: The Event (Observable Reality)
- **Event:** Fresh, hygienic cooked meals and bakery surplus are discarded into trash bins after hotel buffets, college canteens, and banquet weddings in Hyderabad.

### 1.2 Level 2: Patterns & Trends
- **Patterns:**
  - Surplus peaks reliably between 2:30–4:00 PM (lunch transition) and 10:30–12:00 AM (dinner shift).
  - Redistribution attempts frequently fail due to late discovery: by the time an NGO is contacted, the food is within 30 minutes of biological spoilage.
  - Receivers report being overwhelmed on weekends (multiple donors calling simultaneously) but experiencing deficits on weekdays.
  - Volunteer transporters arrive late or lack proper insulated carriers.

### 1.3 Level 3: Systemic Structures
- **Structures:**
  - **Communication Infrastructure:** Ad-hoc manual telephone calls, personal WhatsApp groups with no structured schema (missing quantities, shelf-life, or geocodes).
  - **Storage & Logistics:** Donors lack blast-chillers or warming equipment to hold unserved buffer meals past 3 hours.
  - **Discovery Mechanisms:** Lack of an automated matchmaking engine that matches meal quantity against receiver shelter capacity.
  - **Incentive Alignment:** Municipal trash bins are located directly outside kitchens, providing an immediate, low-friction disposal pathway with zero coordination effort.

### 1.4 Level 4: Mental Models
- **Food Provider:** *"I want my surplus food to reach hungry people rather than being wasted, but during busy banquet hours my staff cannot spend hours making dozens of phone calls."*
- **Volunteer Partner:** *"I am willing to transport food across Hyderabad, but I need verified coordinates, vehicle-compatible quantities, and a fixed pickup window so my trip isn't wasted."*
- **NGO / Shelter Administrator:** *"We need wholesome food, but we cannot accept 200 non-vegetarian meals if our community is 100% vegetarian, or if food arrives spoiled at 1:00 AM without advance notice."*
- **Shared Mental Model:** Food availability data must be instantaneous, structured, verified for food safety, and transparent.

---

## 2. System Bottlenecks

### 2.1 Data Bottleneck
- **Description:** Complete information asymmetry. When 80 meals become available at a banquet in Madhapur, nearby shelters in Jubilee Hills or Gachibowli have no awareness of the event, meal count, or expiry countdown.
- **Impact:** Valuable redistribution time is lost during manual inquiry.

### 2.2 Process Bottleneck
- **Description:** Cumbersome handoffs. The linear sequence of donor noticing surplus → finding contacts → calling → receiver checking capacity → finding volunteer → volunteer arriving creates a 2 to 4 hour latency lag.
- **Impact:** Food crosses safe microbial holding thresholds (&lt;60°C hot hold or &gt;5°C cold hold) before pickup completes.

### 2.3 Human Bottleneck
- **Description:** Logistical fatigue. Commercial kitchen staff prioritize cleaning and closing shifts over prolonged telephone negotiations.
- **Impact:** Food providers default to waste bins as the path of least resistance.

---

## 3. Revised Systems Map (Target Intervention)

```
[Food Providers] 
      │
      ▼
[Surplus Identification] (Wizard with Food Safety Checklist)
      │
      ▼
[SurplusFlow Platform] (Real-Time Geocoded Hub)
      │
      ├── Urgency Engine (Calculates minutes remaining & priority)
      │
      └── Smart Matching Engine (MCDA Scoring: Haversine, Capacity, Diet, Reliability)
            │
            ▼
      [Ranked Suitable Receivers] (Instant WebSocket push alerts)
            │
            ├── [Receiver Accepts]
            │         │
            │         ▼
            │   [Automated Volunteer Transit] (Leaflet GPS Route & Handover Proof)
            │         │
            │         ▼
            │   [Nourishment Delivered & Logged]
            │
            └── [Fallback Cascading Logic] (If rejected, automatically notifies next ranked NGO)
```

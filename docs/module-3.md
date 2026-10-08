# PSE MODULE 3: CAUSAL LOOP DIAGRAM & SYSTEM DYNAMICS

## 1. System Variables
To model the food waste ecosystem dynamics mathematically and structurally, nine key variables are defined:
1. `Poor Demand Estimation`
2. `Over-Preparation`
3. `Surplus Food`
4. `Food Waste`
5. `Awareness`
6. `Prevention Effort`
7. `Redistribution`
8. `Environmental Impact`
9. `Disposal`

---

## 2. Feedback Loops

### 2.1 Reinforcing Loop R1: The Waste Perpetuation Loop (Vicious Cycle)
- **Path:**
  ```
  Poor Demand Estimation (+)
            ↓
  Over-Preparation (+)
            ↓
  Surplus Food (+)
            ↓
  Food Waste (+)
            ↓
  Repeated Waste Behaviour (+)
            ↓
  Poor Attention to Planning (+)
            ↓
  Poor Demand Estimation (+)
  ```
- **Dynamics:** Because municipal waste disposal creates zero immediate operational friction or penalty, commercial providers treat food waste as an inevitable cost of business. Over-preparation is normalized, reinforcing inaccurate demand planning.

### 2.2 Balancing Loop B1: Food Waste Awareness & Prevention Loop (Goal-Seeking)
- **Path:**
  ```
  Food Waste (+)
        ↓
  System Awareness / Audited Transparency (+)
        ↓
  Prevention & Redistribution Effort (+)
        ↓
  Food Waste (-)
  ```
- **Dynamics:** By tracking every kilogram of surplus listed, accepted, and discarded, the platform surfaces waste data to kitchen managers. Awareness generates operational pressure to adjust preparation quantities and prioritize redistribution, counteracting the waste cycle.

---

## 3. System Archetype: Shifting the Burden

The selected archetype for this ecosystem is **"Shifting the Burden"** (fixes that backfire).

```
                      [Symptom: Leftover Food & Waste]
                                /          \
             Short-Term Fix   /              \  Fundamental Solution
                            /                  \
                           ▼                    ▼
                    [Disposal to Bin]    [Surplus Identification &
                           │              Timely Redistribution Engine]
                           │ (Delay)            ▲
                           ▼                    │ (Strengthens)
               [Habitual Dependence on] ────────┘ (Eats away at will to prevent)
               [Municipal Landfill Disposal]
```

### 3.1 Analysis
- **Problem Symptom:** Edible surplus food left over after dining service.
- **Short-Term Response (The Symptomatic Fix):** Discarding food into the garbage bin outside the kitchen. It requires 30 seconds of labor, clears the kitchen quickly, and provides an immediate solution.
- **Fundamental Response:** Timely surplus registration, algorithmic receiver matching, and coordinated redistribution before food spoils.
- **Unintended Consequence / Side Effect:** Continual dependence on disposal reduces any incentive to solve the underlying root causes (poor demand estimation, lack of storage, missing distribution channels). Over time, food waste becomes entrenched.

---

## 4. The System Leverage Point

### 4.1 Identification
Following Donella Meadows' leverage point framework, the highest-leverage intervention point in the system is:
> **"TIMELY IDENTIFICATION AND REDISTRIBUTION OF EDIBLE SURPLUS FOOD BEFORE BIOLOGICAL SPOILAGE OCCURS."**

### 4.2 Engineering Rationale
- Trying to eliminate 100% of surplus at the source (demand estimation) is impossible in the hospitality and event sectors due to unpredictable human attendance.
- Landfill composting or biogas recovery happens *after* food has degraded, rescuing only minimal calorie and economic value.
- **Intervening at the leverage point**—after surplus is generated but within its 60–120 minute usable window—maximizes human nourishment, prevents landfill methane emissions, and immediately breaks the Shifting the Burden loop.

### 4.3 Key How Might We (HMW) Question
> *"How might we enable timely identification and redistribution of edible surplus food to reduce food waste?"*

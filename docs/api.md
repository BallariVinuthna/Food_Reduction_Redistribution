# REST API SPECIFICATION

All responses follow the standardized `ApiResponse<T>` envelope:
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { ... },
  "timestamp": "2026-10-08T14:30:00"
}
```

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
- **Description:** Registers a new user with associated role (`FOOD_PROVIDER`, `NGO_RECEIVER`, `VOLUNTEER`, `ADMIN`).
- **Body:**
  ```json
  {
    "email": "donor@hyderabad.local",
    "password": "SecurePassword123!",
    "fullName": "Banjara Banquet Center",
    "phone": "+91 9876543210",
    "role": "FOOD_PROVIDER",
    "organizationName": "Banjara Banquet",
    "address": "Road No. 12, Banjara Hills",
    "latitude": 17.4156,
    "longitude": 78.4487
  }
  ```

### `POST /api/auth/login`
- **Description:** Authenticates credentials and issues a signed JWT Bearer token.
- **Body:** `{ "email": "provider@demo.local", "password": "DemoPass123!" }`
- **Response:** `{ "token": "ey...", "refreshToken": "ey...", "user": { ... } }`

---

## 2. Food Listings Endpoints (`/api/food-listings`)

### `POST /api/food-listings` (Authenticated)
- **Description:** Registers surplus food with mandatory food safety checklist verification.
- **Body:**
  ```json
  {
    "foodName": "Steamed Rice and Dal Tadka",
    "foodCategory": "COOKED_MEALS",
    "quantity": 50.0,
    "unit": "MEALS",
    "preparationTime": "2026-10-08T12:00:00",
    "availableFrom": "2026-10-08T13:00:00",
    "availableUntil": "2026-10-08T15:30:00",
    "address": "Banjara Hills, Hyderabad",
    "latitude": 17.4156,
    "longitude": 78.4487,
    "isVegetarian": true,
    "temperatureSafe": true,
    "cleanPackaging": true,
    "preparedWithinSafeWindow": true,
    "allergenDeclared": true,
    "providerCertified": true
  }
  ```

### `GET /api/food-listings/active`
- **Description:** Retrieves all currently available surplus listings whose available redistribution window has not expired.

---

## 3. Smart Matching Endpoints (`/api/matching`)

### `POST /api/matching/{foodListingId}`
- **Description:** Triggers the Multi-Criteria Decision Analysis (MCDA) engine, calculates Haversine distances to all available receivers, scores each candidate, and persists ranked proposals.

### `POST /api/matching/{matchId}/accept`
- **Description:** Recipient NGO accepts the surplus food offer. Transitions listing to `ACCEPTED`, automatically schedules a `PickupAssignment`, notifies the volunteer transit pool, and alerts the donor.

### `POST /api/matching/{matchId}/reject`
- **Description:** Declines the match. Triggers the fallback cascade to automatically notify the next ranked candidate.

---

## 4. Pickup Transit Endpoints (`/api/pickups`)

### `PUT /api/pickups/{id}/status`
- **Description:** Transitions volunteer transit status through the 5-stage lifecycle:
  `ASSIGNED` → `EN_ROUTE` → `ARRIVED` → `COLLECTED` → `DELIVERED`.
- **Delivered Transition:** Automatically marks the underlying food listing as `REDISTRIBUTED`, updates donor/receiver meal counts, and recalculates system impact metrics.

---

## 5. Prototype Validation & Benchmarking (`/api/prototype-tests`)

### `POST /api/prototype-tests/run`
- **Description:** Runs an automated 20-scenario benchmark across Hyderabad localities, evaluates match success, execution latency, and storage integrity, outputting the `PASS`/`FAIL` validation report.

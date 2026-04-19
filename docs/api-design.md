# REST API Design & Integration Layer

FitTrack uses a true Express.js backend connected to a PostgreSQL database. Below are the functional endpoints implemented in `backend/server.js`, utilized by our frontend `ApiRepository` classes.

## Base URL
Backend is hosted via standard Node port configuration.

## 🔐 Authentication API

### 1. Register User
Registers and hashes credentials using `bcrypt` and issues a JSON Web Token.
* **Endpoint:** `POST /api/auth/register`
* **Payload:** 
  ```json
  { "email": "test@fittrack.com", "password": "securepassword123" }
  ```
* **Response:** 
  ```json
  { "token": "eyJhb...", "user": { "id": "uuid-123", "email": "test@fittrack.com" } }
  ```

### 2. Login User
* **Endpoint:** `POST /api/auth/login`
* **Response:** Yields Bearer token on successful `bcrypt.compare`.

---

## 🏋️ Workout API (Data Synchronization)

*Note: All endpoints below require `Authorization: Bearer <token>` middleware verification.*

### 1. Get Live State
Fetches the current user's entire workout history deeply joined with exercises via SQL.
* **Endpoint:** `GET /api/workouts`
* **SQL Driven:** Exclusively selects via `user_id` parsed out of the JWT `req.userId`.
* **Response (200 OK):**
```json
[
  {
    "id": "wkt-uuid-1",
    "date": "2023-10-15",
    "exercises": [
      {
        "id": "ex-uuid-1",
        "name": "Squat",
        "sets": 3,
        "reps": 8,
        "weight": 225
      }
    ]
  }
]
```

### 2. Sync Workouts (The Brute-Force Route)
Pushes the client state to the master cloud record.
* **Endpoint:** `POST /api/workouts`
* **Payload:** An array of fully formed `Workout` domain objects.
* **Backend Transaction Mechanism:**
  1. `await query('DELETE FROM workouts WHERE user_id = $1', [req.userId]);`
  2. Nested `for` loop executing `INSERT` for Workouts and localized Exercises.
* **Response:** `200 OK { "message": "Workouts synced" }`

---

## 🍎 Nutrition API
Identical structure mapping to the `nutrition_logs` schema.
* **Endpoint:** `GET /api/nutrition`
* **Endpoint:** `POST /api/nutrition`

## 🏆 Personal Bests API
Maps individual exercise performance vectors.
* **Endpoint:** `GET /api/personal-bests`
* **Endpoint:** `POST /api/personal-bests`

# FitTrack: Comprehensive Health & Fitness Management System

 **Live Deployment**: [https://dainty-peony-592a40.netlify.app/](https://dainty-peony-592a40.netlify.app/)
 
 **Project Report**: [View Detailed Report](https://docs.google.com/document/d/1go2V0_gndLrSkOU4mv18BzscjhChF1ytpvLR4VNEBek/edit?usp=sharing)

## 1. Project Overview
FitTrack is a full-stack health and fitness tracking platform. Going beyond rudimentary applications, this project was architected from the ground up to reflect industry standards in **System Design, Object-Oriented Programming (OOP) paradigms, and Database Engineering**. By enforcing a strict decoupled architecture (Domain-Driven Design), incorporating structural AI workflows, and integrating a full PostgreSQL backend, FitTrack stands as a comprehensive, scale-ready solution.

## 2. Key Features
* **Workout & Nutrition Management:** Deep tracking of routines, sets, reps, caloric goals, and daily macro consumption via relational schemas.
* **Intelligent Chat Agent (AI):** AI integrated with a **Fallback Strategy Pattern**, gracefully swapping between LLM services and stubbed modes without UI interruption.
* **Robust Authentication:** Secure JWT access and Bcrypt hashing implemented at the middleware level.
* **Abstract Data Persistence:** Decoupled persistence ensuring zero React dependency on backend semantics (implemented via the Repository Pattern).
* **Defensive Domain Layer:** Strict isolation of business logic. Pure array operations and immutable transformations exist entirely isolated from network and display latency.

## 3. Tech Stack
* **Frontend:** React, TypeScript, Vite (Layered with Presentation / Application / Infrastructure domains)
* **Backend:** Node.js, Express (RESTful APIs with JWT Auth Middleware)
* **Database:** PostgreSQL (Connection pooling via `pg`, secure credential ingestion)
* **Testing:** Vitest, Testing Library (Complete unit and Integration test suite mapped to core logic)

## Quickstart (Local Dev)

### Prerequisites
- **Node.js**: recommended **Node 18+**
- **PostgreSQL**: running locally or accessible remotely

### Install
```bash
npm install
```

### Environment Variables
FitTrack expects environment variables for the frontend and backend.

- **Backend**: create `backend/.env` (or set env vars in your shell)
  - `DATABASE_URL` (recommended) **or** `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
  - `JWT_SECRET`
- **Frontend (Vite)**: create `.env` at repo root
  - `VITE_API_BASE_URL` (example: `http://localhost:3001`)
  - `VITE_CHAT_STRATEGY` (example: `gemini` or `mock`)

### ▶️ Run
```bash
npm run dev:all
```

### Test
```bash
npm test
```

For environment variables and detailed setup, see `docs/development.md`.

## Common Scripts
- **`npm run dev:all`**: start frontend + backend together
- **`npm run dev`**: start frontend (Vite)
- **`npm run test`**: run unit/integration tests (Vitest)

## 📂 4. Folder Structure & Real Code Mapping
Our architecture rejects the standard front-end monolith. Code boundaries are strictly enforced.

| Conceptual Layer | File / Path Mapping in Codebase |
| :--- | :--- |
| **Domain Logic / Services** | `src/application/workout/WorkoutService.ts` |
| **Repository Contracts** | `src/application/interfaces/WorkoutRepository.ts` |
| **Repository Implementation** | `src/infrastructure/repositories/ApiWorkoutRepository.ts` |
| **AI Strategy Pattern** | `src/application/chat/FallbackChatStrategy.ts`, `GeminiStrategy.ts` |
| **Strategy Factory** | `src/application/chat/createChatStrategy.ts` |
| **Dependency Injection** | `src/application/workout/WorkoutContext.tsx` |
| **PostgreSQL Pool & Auth** | `backend/server.js`, `backend/db.js` |

---

## 5.System Architecture
FitTrack utilizes a **Three-Tier Architecture** heavily influenced by **Domain-Driven Design**.

1. **Presentation Layer:** Pure React components (e.g., `ChatWindow.tsx`). Contains only render logic and React hooks. No data-fetching or domain logic exists here.
2. **Application Layer:** Contains **Services** (`WorkoutService.ts`). The service defines the "rules" of fitness. It accepts inputs, processes IDs and metrics, and returns pure states.
3. **Infrastructure Layer:** Implements persistence. This is where `ApiWorkoutRepository.ts` exists, fulfilling the unopinionated contracts set by the App layer, making raw network calls to our Express backend.
4. **Backend/Database Layer:** An Express server (`backend/server.js`) acting as the API gateway connected to a live PostgreSQL pool.

### Data Flow (MANDATORY)
* **Normal Happy Path:** UI Click → Context Dispatch → `WorkoutService` validates business logic → `ApiWorkoutRepository` triggers HTTP `POST` → `server.js` verifies JWT auth → PostgreSQL executes `INSERT` → HTTP `200` triggers UI State reconciliation.
* **FAILURE Flow (AI Agent Timeout):** User types query → `createChatStrategy` resolves `FallbackChatStrategy` → It calls `GeminiStrategy.sendMessage()` → REST call to LLM hangs for 5 seconds → `GeminiStrategy` THROWS explicit error → `FallbackChatStrategy` catches error silently → Invokes `MockStrategy.sendMessage()` → Returns safe fallback string to UI.

---

## 6. OOP & SOLID Principles Mapped to Reality
This project is not theoretical. We map structural OOP to real behavior:

* **Encapsulation:** The UI cannot directly push to the `workouts[]` array. It must call `workoutService.addExercise(...)`, preventing the client from silently corrupting application state.
* **Abstraction:** The entire app depends on `interface WorkoutRepository`. At no point does the application logic know if data lives in memory, localStorage, or PostgreSQL.
* **Inheritance:** Our AI strategies all implement the `ChatStrategy.ts` interface, inheriting the `sendMessage(msg): Promise<string>` signature.
* **Polymorphism:** The `ChatWindow` component blindly calls `.sendMessage()`. Through polymorphism, the runtime type evaluates whether that call goes to the live Gemini API or a mocked string return. 

---

## 7. Deep Dive: 4 Design Patterns Implemented
1. **Repository Pattern:** Fully implemented in `src/infrastructure/repositories/`. Decouples backend API structure from our frontend state map.
2. **Strategy Pattern:** Implemented in `src/application/chat`. Permits swapping external AI dependencies (Gemini vs. Mock) based on network stability and configuration.
3. **Dependency Injection (DI):** Seen in `WorkoutContext.tsx`. The Context receives its repository implementation via React Props (`interface WorkoutProviderProps { repository?: WorkoutRepository }`). In production, it gets `ApiWorkoutRepository`. In tests, we inject a Mock, ensuring 0 external network calls during CI/CD.
4. **Factory Pattern:** Located in `createChatStrategy.ts`. It acts as an instantiation factory, polling environment variables (`VITE_CHAT_STRATEGY`) and actively composing the correct strategy object based on server context.

---

## 8. Database & ER Integration
* **Reality:** The DB is fully implemented using PostgreSQL via `backend/db.js`.
* **ER Pipeline:** Our entities naturally enforce 1:M aggregate boundaries. The Application `Workout` object matches our relational schema: `Users (1) -> (M) Workouts (1) -> (M) Exercises`.
* *See `diagrams/er-diagram.md` for exact table modeling.*

---

## 9. Testing Strategy
Our testing removes network and DOM fragility. Run via `Vitest`. (See `tests/` directory).
* **What is tested:** Pure logic classes (`workoutService.test.ts`), Fallback AI paths (`chatStrategies.test.ts`), and Context integrations injected with Mock DI (`addWorkoutFlow.test.tsx`).
* **Why it matters:** It proves that changes to UI components will not break the mathematical integrity of nutrition logs, and changes to the backend will not crash the UI (because the repository interface serves as a hard boundary).

---

## 10. Scalability & Limitations (Tradeoffs)
No system is perfect without iteration. We prioritize transparency in architectural limits:

* **Scalability Win:** Because the Application depends entirely on interfaces, swapping our Node endpoint for a serverless Lambda architecture requires exactly 0 lines of code changed in our React Components or Domain Services.
* **Known Limitation (Brute-Force Sync):** Currently, our data synchronization is heavy-handed. Upon saving, our Node route (`app.post('/api/workouts')`) executes a `DELETE FROM workouts WHERE user_id = $1` followed by a batch re-insert loop.
* **Future Solution:** As the user base grows, this poses a locking mechanism and IOPS threat to PostgreSQL. We would natively migrate to differential updates (patch diffs tracking delta changes locally before syncing).

---

## Troubleshooting
- **DB connection fails**: verify `DATABASE_URL` (or `PG*` vars) and that Postgres is reachable from the backend process.
- **401/Unauthorized**: ensure `JWT_SECRET` is set consistently for the backend and that you’re logged in / sending the token.
- **AI chat not responding**: set `VITE_CHAT_STRATEGY=mock` to validate the UI flow without external dependencies.

## 11. Team & Contributors
Developed explicitly for robust Systems Design Evaluation:
* **Arya Pandey** – Backend Architecture & APIs
* **Saksham Miglani** – Frontend Architecture & Systems
* **Sarthak Mishra** – Database Engineering
* **Shane Joseph** – AI Integration & Strategy Design
* **Malhar Mahanwar** – Testing & QA Lead

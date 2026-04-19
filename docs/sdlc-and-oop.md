# SDLC & Object-Oriented Programming Mapping

This document provides irrefutable proof of how theory was implemented into the concrete reality of the FitTrack system.

---

## 1. SDLC Phases Mapped to Code Reality
We utilized an **Agile-Iterative SDLC**.

* **Requirements Gathering:** Formulated our user stories. Discovered that the app must heavily rely on stable state, even when off-grid.
* **System Design:** Constructed the schema (`db/schema.sql`) and chose the interface boundary layer (`src/application/interfaces`) before writing any logic.
* **Implementation:** 
  1. We built domain modules first (`WorkoutService.ts`). 
  2. We built persistence modules second (`ApiWorkoutRepository.ts`). 
  3. We built the React UI last, wiring it to the services.
* **Testing:** Written against the DOM-free Services in `/tests/services/workoutService.test.ts`.
* **Deployment/Hardening:** Shifted the backend from a mock implementation to a live PostgreSQL pool (`backend/server.js`), migrating safely due to our Repository structure.

---

## 2. Object-Oriented Programming (Mapped to Paths)

### A. Encapsulation
* **Theory:** Bundling data and state-mutation methods together, restricting unsafe access.
* **Code Implementation:** Seen heavily in `src/application/workout/WorkoutService.ts`. The React application context (`WorkoutContext.tsx`) holds raw data states, but it relies on `workoutService.calculateMetrics()` and `workoutService.addExercise()` to ensure no invalid IDs or negative weights are added. 

### B. Abstraction
* **Theory:** Masking complex logic behind clean API surfaces.
* **Code Implementation:** A developer writing a React Dashboard needs a list of workouts. They just call `repository.getAll()`. They do not need to look inside `src/infrastructure/repositories/ApiWorkoutRepository.ts` to realize it requires building a `fetch` payload, resolving JSON Promises, and iterating over HTTP Response Codes.

### C. Inheritance (via Interfaces)
* **Theory:** Defining parental attributes passed to child structures.
* **Code Implementation:** In TypeScript, we substitute classical inheritance with interface fulfillment. Our AI strategies (`GeminiStrategy.ts`, `MockStrategy.ts`) all inherit constraints from the `ChatStrategy.ts` interface perfectly.

### D. Polymorphism
* **Theory:** A single interface resolving differently based on the assigned object at runtime.
* **Code Implementation:** In `src/application/chat/createChatStrategy.ts`, if `process.env.VITE_CHAT_STRATEGY === 'mock'`, the app is delivered a `MockStrategy` object. The UI blindly executes `.sendMessage('hello')`. Polymorphism dictates whether that method executes a heavy external HTTP POST, or just instantly returns a hardcoded debugging string.

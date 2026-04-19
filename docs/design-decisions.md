# Architectural & Design Decisions

This document details the concrete rationale behind FitTrack's architectural choices, avoiding generic answers and relying on the reality of our codebase.

## 1. Why Layered Architecture over standard React MVC?
In standard React setups, a single functional component often contains HTTP fetch calls, business logic (data manipulation), and DOM rendering syntax. 

**Our Decision:** We violently decoupled this.
* **Reality:** Our `WorkoutContext.tsx` handles state reconciliation. Our `WorkoutService.ts` handles complex mathematical manipulation. Our `ApiWorkoutRepository.ts` handles HTTP. Our UI components only map props to the screen. 
* **Reasoning:** Independent scalability and Testability. We can unit test `WorkoutService.ts` in under 10ms via Vitest because it has absolutely zero reliance on React hooks or `window.fetch`.

## 2. Why API-Based Repository vs. LocalStorage?
Initially, the system utilized a `LocalStorageRepository`. It was successfully gutted and replaced with `ApiWorkoutRepository`.
* **The Transition:** Because our Application Layer demanded data from `interface WorkoutRepository`, transitioning to a real backend literally meant replacing `new LocalStorageWorkoutRepository()` with `new ApiWorkoutRepository()`. No front-end state management code broke.
* **Why PostgreSQL?** Fitness analytics requires deep aggregation (e.g., "Max lift volume averaged over 30 days"). Offloading this to a PostgreSQL connection pool (implemented via `pg` in `backend/db.js`) is vastly superior to iterating over JSON arrays in a client’s browser memory.

## 3. The Fallback Chat Strategy (AI Safety)
When designing the Gemini Chatbot integration, we faced a 99% uptime reality constraint from external REST APIs.
* **Decision:** We built a `FallbackChatStrategy`.
* **How it works:** The `createChatStrategy.ts` factory wraps the `GeminiStrategy` in our `FallbackChatStrategy`. When the user makes a query, it routes to Gemini. If the request times out or returns a 503, an explicit Error is caught by the Fallback class, which seamlessly routes the prompt to the `MockStrategy`.
* **Tradeoff:** It introduces minor architectural verbosity compared to a standard `try-catch` inside a React component, but ensures standard UI contracts hold even when vendor dependencies catastrophically fail.

## 4. Known Tradeoff: The Brute-Force Sync Issue
* **The Problem:** In our backend API `server.js`, our state sync endpoint (`app.post('/api/workouts')`) currently implements a full drop-and-replace strategy:
  ```javascript
  await query('DELETE FROM workouts WHERE user_id = $1', [req.userId]);
  // followed by an INSERT loop
  ```
* **Why we did it:** Rapid prototype stability. It guarantees the cloud database perfectly matches local client-side state resolution without complex distributed conflict mapping.
* **Why it must change:** At extreme scale, executing `DELETE cascade` locks tables and spikes PostgreSQL I/O operations unnecessarily for a 1-character update. 
* **The Target Fix:** Differential updates. The client will track an "Event Ledger" of mutations, sending only `UPSERT` diff chunks back to a dedicated GraphQL or REST payload.

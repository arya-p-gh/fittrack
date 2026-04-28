# System Capabilities

This diagram represents the user interactions implemented by the current Express backend in `backend/server.js` (JWT-protected routes + public auth routes).

```mermaid
usecaseDiagram
  actor "Guest" as Guest
  actor "Authenticated User" as User

  rectangle "Auth API (Express)" {
    usecase "Register\nPOST /api/auth/register" as UC_Register
    usecase "Login\nPOST /api/auth/login" as UC_Login
    usecase "JWT Verification\n(authMiddleware)" as UC_JWT
  }

  Guest --> UC_Register
  Guest --> UC_Login
  User --> UC_JWT : <<requires Bearer token>>

  rectangle "Workout Tracking (protected)" {
    usecase "Fetch Workouts\nGET /api/workouts" as UC_GetWorkouts
    usecase "Sync Workouts (delete+insert)\nPOST /api/workouts" as UC_SyncWorkouts
  }

  rectangle "Nutrition (protected)" {
    usecase "Fetch Nutrition Logs\nGET /api/nutrition" as UC_GetNutrition
    usecase "Sync Nutrition Logs (delete+insert)\nPOST /api/nutrition" as UC_SyncNutrition
  }

  rectangle "Personal Bests (protected)" {
    usecase "Fetch Personal Bests\nGET /api/personal-bests" as UC_GetPB
    usecase "Sync Personal Bests (delete+insert)\nPOST /api/personal-bests" as UC_SyncPB
  }

  rectangle "Workout Templates (protected)" {
    usecase "Fetch Templates\nGET /api/workout_templates" as UC_GetTemplates
    usecase "Sync Templates (delete+insert)\nPOST /api/workout_templates" as UC_SyncTemplates
  }

  rectangle "Exercise Library (protected)" {
    usecase "Browse Exercise Definitions\nGET /api/exercises" as UC_GetExerciseDefs
  }

  UC_JWT ..> UC_GetWorkouts : <<permits>>
  UC_JWT ..> UC_SyncWorkouts : <<permits>>
  UC_JWT ..> UC_GetNutrition : <<permits>>
  UC_JWT ..> UC_SyncNutrition : <<permits>>
  UC_JWT ..> UC_GetPB : <<permits>>
  UC_JWT ..> UC_SyncPB : <<permits>>
  UC_JWT ..> UC_GetTemplates : <<permits>>
  UC_JWT ..> UC_SyncTemplates : <<permits>>
  UC_JWT ..> UC_GetExerciseDefs : <<permits>>

  User --> UC_GetWorkouts
  User --> UC_SyncWorkouts
  User --> UC_GetNutrition
  User --> UC_SyncNutrition
  User --> UC_GetPB
  User --> UC_SyncPB
  User --> UC_GetTemplates
  User --> UC_SyncTemplates
  User --> UC_GetExerciseDefs

  rectangle "Chat (frontend strategy; /api/chat missing server-side)" {
    usecase "Ask Chat Assistant\n(ChatStrategy.sendMessage)" as UC_Chat
    usecase "Fallback to Mock reply\n(on primary failure)" as UC_ChatFallback
  }
  User --> UC_Chat
  UC_Chat ..> UC_ChatFallback : <<extends on error>>
```

# System Capabilities

This diagram represents the strict user interactions bounded by the JWT Auth middleware present in `backend/server.js`.

```mermaid
usecaseDiagram
    actor "Unauthenticated User" as Guest
    actor "Authenticated User" as User

    rectangle "Auth Domain (server.js)" {
        usecase "Register (/api/auth/register)" as UC1
        usecase "Login (/api/auth/login)" as UC2
        usecase "Token Verification (Middleware)" as UC3
    }
    
    Guest --> UC1
    Guest --> UC2
    
    User --> UC3 : <<Requires JWT>>

    rectangle "Workout API (/api/workouts)" {
        usecase "Sync Workout State (Brute-force)" as UC4
        usecase "Fetch Entire Workout History" as UC5
    }

    rectangle "Chat Strategy Domain" {
        usecase "Query AI" as UC6
        usecase "Receive Safe Stub on API Failure" as UC7
    }

    UC3 ..> UC4 : <<permits>>
    UC3 ..> UC5 : <<permits>>
    
    User --> UC6
    UC6 ..> UC7 : <<extends if AI breaks>>
```

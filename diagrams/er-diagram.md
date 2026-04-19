# Relational Entity Diagram

This ER diagram directly represents the structure instantiated inside our actual PostgreSQL database (via `backend/server.js` and `db/schema.sql`).

```mermaid
erDiagram
    users ||--o{ workouts : "logs"
    users ||--o{ nutrition_logs : "records"
    users ||--o{ personal_bests : "achieves"
    
    workouts ||--|{ exercises : "contains"
    workout_templates ||--|{ template_exercises : "templates"
    users ||--o{ workout_templates : "owns"

    users {
        UUID id PK
        string email
        string password_hash
    }

    workouts {
        UUID id PK
        UUID user_id FK
        date date
    }

    exercises {
        UUID id PK
        UUID workout_id FK
        string name
        int sets
        int reps
        float weight
        date date
    }

    nutrition_logs {
        UUID id PK
        UUID user_id FK
        date date
        int calories
        int protein
        int carbs
        int fats
    }

    personal_bests {
        UUID id PK
        UUID user_id FK
        string exercise_name
        float weight
        date date
    }
```

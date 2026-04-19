# Relational Entity Diagram

This ER diagram directly represents the structure instantiated inside our actual PostgreSQL database (via `backend/init-db.js`).

```mermaid
erDiagram
    users ||--o{ workouts : "logs"
    users ||--o{ nutrition_logs : "records"
    users ||--o{ personal_bests : "achieves"
    
    workouts ||--o{ exercises : "contains"
    workout_templates ||--o{ template_exercises : "templates"
    users ||--o{ workout_templates : "owns"

    users {
        string id PK
        string email
        string password_hash
        timestamp created_at
    }

    workouts {
        string id PK
        string user_id FK
        timestamp date
    }

    exercises {
        string id PK
        string workout_id FK
        string name
        int sets
        int reps
        numeric weight
        timestamp date
    }

    nutrition_logs {
        string id PK
        string user_id FK
        timestamp date
        int calories
        int protein
        int carbs
        int fats
    }

    personal_bests {
        string id PK
        string user_id FK
        string exercise_name
        numeric weight
        timestamp date
    }

    exercise_definitions {
        string id PK
        string name
        string muscle_group
        string equipment
        string gif_url
    }

    template_exercises {
        string id PK
        string template_id FK
        string name
        int sets
        int reps
        numeric weight
    }

    workout_templates {
        string id PK
        string user_id FK
        string name
    }
```

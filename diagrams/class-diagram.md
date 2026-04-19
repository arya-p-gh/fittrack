# Class Level Architecture

This Class Diagram is a direct representation of our real Domain-Driven codebase hierarchy within `/src`.

```mermaid
classDiagram
    %% Core Entities (DTOs passed between layers)
    class Workout {
        +String id
        +Date date
        +Exercise[] exercises
    }

    %% Interfaces (in src/application/interfaces/)
    class WorkoutRepository {
        <<interface>>
        +saveAll(workouts: Workout[]) void
        +getAll() Workout[]
    }

    class ChatStrategy {
        <<interface>>
        +sendMessage(msg: String) Promise~String~
    }

    %% Concrete Implementations (in src/infrastructure/)
    class ApiWorkoutRepository {
        <<Real Data Layer>>
        +saveAll(workouts: Workout[]) void
        +getAll() Workout[]
    }

    class GeminiStrategy {
        <<AI Endpoint>>
        +sendMessage(msg: String) Promise~String~
    }

    class MockStrategy {
        <<Stub>>
        +sendMessage(msg: String) Promise~String~
    }

    class FallbackChatStrategy {
        -ChatStrategy primary
        -ChatStrategy fallback
        +sendMessage(msg: String) Promise~String~
    }

    %% Services (in src/application/workout/)
    class WorkoutService {
        <<Pure Logic>>
        +calculateTotalMetrics(workouts: Workout[]) Metrics
        +validateWorkout(w: Workout) boolean
    }

    %% Presentation / State (in src/application/workout/)
    class WorkoutContext {
        <<DI Container / React Context>>
        -Workout[] state
        -WorkoutService service
        -WorkoutRepository repository
        +addWorkout(w: Workout) void
    }

    %% Relationships Mapping Back to Code
    ApiWorkoutRepository ..|> WorkoutRepository : implements interface
    GeminiStrategy ..|> ChatStrategy : implements interface
    MockStrategy ..|> ChatStrategy : implements interface
    FallbackChatStrategy ..|> ChatStrategy : wraps primary & fallback

    WorkoutContext --> WorkoutService : executes logic
    WorkoutContext --> WorkoutRepository : loosely coupled dependencies
```

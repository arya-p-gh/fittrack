import dotenv from "dotenv";
import { query } from "./db.js";

dotenv.config();

const exerciseDefinitions = [
    { id: 'chest-1', name: 'Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
    { id: 'chest-2', name: 'Incline Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
    { id: 'chest-3', name: 'Dumbbell Press', muscleGroup: 'Chest', equipment: 'Dumbbell' },
    { id: 'chest-4', name: 'Push-Ups', muscleGroup: 'Chest', equipment: 'Bodyweight' },
    { id: 'chest-5', name: 'Chest Flyes', muscleGroup: 'Chest', equipment: 'Dumbbell' },
    { id: 'chest-6', name: 'Cable Flyes', muscleGroup: 'Chest', equipment: 'Cable' },
    { id: 'chest-7', name: 'Machine Chest Press', muscleGroup: 'Chest', equipment: 'Machine' },
    { id: 'back-1', name: 'Pull-Ups', muscleGroup: 'Back', equipment: 'Bodyweight' },
    { id: 'back-2', name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'Cable' },
    { id: 'back-3', name: 'Barbell Row', muscleGroup: 'Back', equipment: 'Barbell' },
    { id: 'back-4', name: 'Dumbbell Row', muscleGroup: 'Back', equipment: 'Dumbbell' },
    { id: 'back-5', name: 'Deadlift', muscleGroup: 'Back', equipment: 'Barbell' },
    { id: 'legs-1', name: 'Squats', muscleGroup: 'Legs', equipment: 'Barbell' },
    { id: 'legs-2', name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine' },
    { id: 'legs-3', name: 'Romanian Deadlift', muscleGroup: 'Legs', equipment: 'Barbell' },
    { id: 'legs-4', name: 'Leg Extensions', muscleGroup: 'Legs', equipment: 'Machine' },
    { id: 'legs-5', name: 'Leg Curls', muscleGroup: 'Legs', equipment: 'Machine' },
    { id: 'legs-6', name: 'Calf Raises', muscleGroup: 'Legs', equipment: 'Machine' },
    { id: 'legs-7', name: 'Lunges', muscleGroup: 'Legs', equipment: 'Dumbbell' },
    { id: 'shoulders-1', name: 'Overhead Press', muscleGroup: 'Shoulders', equipment: 'Barbell' },
    { id: 'shoulders-2', name: 'Lateral Raises', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
    { id: 'shoulders-3', name: 'Front Raises', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
    { id: 'shoulders-4', name: 'Face Pull', muscleGroup: 'Shoulders', equipment: 'Cable' },
    { id: 'shoulders-5', name: 'Arnold Press', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
    { id: 'arms-1', name: 'Bicep Curls', muscleGroup: 'Arms', equipment: 'Dumbbell' },
    { id: 'arms-2', name: 'Tricep Extensions', muscleGroup: 'Arms', equipment: 'Dumbbell' },
    { id: 'arms-3', name: 'Hammer Curls', muscleGroup: 'Arms', equipment: 'Dumbbell' },
    { id: 'arms-4', name: 'Skull Crushers', muscleGroup: 'Arms', equipment: 'Barbell' },
    { id: 'arms-5', name: 'Tricep Pushdown', muscleGroup: 'Arms', equipment: 'Cable' },
    { id: 'core-1', name: 'Plank', muscleGroup: 'Core', equipment: 'Bodyweight' },
    { id: 'core-2', name: 'Crunches', muscleGroup: 'Core', equipment: 'Bodyweight' },
    { id: 'core-3', name: 'Russian Twists', muscleGroup: 'Core', equipment: 'Bodyweight' },
    { id: 'core-4', name: 'Hanging Leg Raises', muscleGroup: 'Core', equipment: 'Bodyweight' }
];

const initDb = async () => {
    console.log("Initializing database tables...");
    try {
        // Users table (must come first - other tables reference it)
        await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

        await query(`
      CREATE TABLE IF NOT EXISTS workouts (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        date TIMESTAMP NOT NULL
      );
    `);

        await query(`
      CREATE TABLE IF NOT EXISTS exercises (
        id VARCHAR(255) PRIMARY KEY,
        workout_id VARCHAR(255) REFERENCES workouts(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        sets INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight NUMERIC(10,2) NOT NULL,
        date TIMESTAMP NOT NULL
      );
    `);

        await query(`
      CREATE TABLE IF NOT EXISTS nutrition_logs (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        date TIMESTAMP NOT NULL,
        calories INTEGER NOT NULL,
        protein INTEGER NOT NULL,
        carbs INTEGER NOT NULL,
        fats INTEGER NOT NULL
      );
    `);

        await query(`
      CREATE TABLE IF NOT EXISTS personal_bests (
        id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        exercise_name VARCHAR(255) NOT NULL,
        weight NUMERIC(10,2) NOT NULL,
        date TIMESTAMP NOT NULL,
        UNIQUE(user_id, exercise_name)
      );
    `);

        await query(`
      CREATE TABLE IF NOT EXISTS workout_templates (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL
      );
    `);

        await query(`
      CREATE TABLE IF NOT EXISTS template_exercises (
        id VARCHAR(255) PRIMARY KEY,
        template_id VARCHAR(255) REFERENCES workout_templates(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        sets INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight NUMERIC(10,2) NOT NULL
      );
    `);

        await query(`
      CREATE TABLE IF NOT EXISTS exercise_definitions (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        muscle_group VARCHAR(255) NOT NULL,
        equipment VARCHAR(255) NOT NULL,
        gif_url VARCHAR(255)
      );
    `);

        console.log("Database tables created successfully!");

        // Seed exercise definitions if empty
        const { rows } = await query('SELECT COUNT(*) FROM exercise_definitions');
        if (parseInt(rows[0].count) === 0) {
            console.log("Seeding exercise definitions...");
            for (const ex of exerciseDefinitions) {
                await query(
                    'INSERT INTO exercise_definitions (id, name, muscle_group, equipment) VALUES ($1, $2, $3, $4)',
                    [ex.id, ex.name, ex.muscleGroup, ex.equipment]
                );
            }
            console.log("Exercise definitions seeded successfully!");
        }

    } catch (error) {
        console.error("Error initializing DB:", error);
    } finally {
        process.exit();
    }
};

initDb();

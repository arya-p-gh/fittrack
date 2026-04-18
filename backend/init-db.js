import dotenv from "dotenv";
import { query } from "./db.js";

dotenv.config();

const initDb = async () => {
  console.log("Initializing database tables...");
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS workouts (
        id VARCHAR(255) PRIMARY KEY,
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
        date TIMESTAMP NOT NULL,
        calories INTEGER NOT NULL,
        protein INTEGER NOT NULL,
        carbs INTEGER NOT NULL,
        fats INTEGER NOT NULL
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS personal_bests (
        exercise_name VARCHAR(255) PRIMARY KEY,
        weight NUMERIC(10,2) NOT NULL,
        date TIMESTAMP NOT NULL
      );
    `);

    console.log("Database tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    process.exit();
  }
};

initDb();

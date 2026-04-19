import dotenv from "dotenv";
import { query } from "./db.js";

dotenv.config();

const initDb = async () => {
  console.log("Initializing database tables...");
  try {
    // Drop existing tables to establish relations with users properly
    await query(`DROP TABLE IF EXISTS exercises, personal_bests, nutrition_logs, workouts, users CASCADE;`);

    // Create users table
    await query(`
      CREATE TABLE users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await query(`
      CREATE TABLE workouts (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        date TIMESTAMP NOT NULL
      );
    `);

    await query(`
      CREATE TABLE exercises (
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
      CREATE TABLE nutrition_logs (
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
      CREATE TABLE personal_bests (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        exercise_name VARCHAR(255) NOT NULL,
        weight NUMERIC(10,2) NOT NULL,
        date TIMESTAMP NOT NULL,
        UNIQUE(user_id, exercise_name)
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

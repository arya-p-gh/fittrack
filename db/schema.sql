-- System Design Project: Database Schema Definitions
-- This schema translates the OOP models and aggregate roots into a normalized relational database design.

-- Enable UUID extension for secure, unguessable primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

---------------------------------------
-- 1. User Entity
---------------------------------------
CREATE TABLE Users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

---------------------------------------
-- 2. Workout Models (Aggregate Root)
---------------------------------------
-- Represents a single workout session logged by a user.
CREATE TABLE Workouts (
    workout_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    workout_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Represents an individual exercise performed within a workout.
CREATE TABLE Exercises (
    exercise_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_id UUID NOT NULL,
    exercise_name VARCHAR(100) NOT NULL,
    sets INT NOT NULL CHECK (sets > 0),
    reps INT NOT NULL CHECK (reps > 0),
    weight_lbs DECIMAL(6, 2) NOT NULL CHECK (weight_lbs >= 0),
    FOREIGN KEY (workout_id) REFERENCES Workouts(workout_id) ON DELETE CASCADE
);

---------------------------------------
-- 3. Nutrition Models (Aggregate Root)
---------------------------------------
-- Represents a daily nutrition ledger for a user.
CREATE TABLE NutritionLogs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    log_date DATE NOT NULL,
    daily_calorie_goal INT NOT NULL CHECK (daily_calorie_goal > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, log_date) -- A user has one log per day
);

-- Represents an individual meal inside a log.
CREATE TABLE Meals (
    meal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_id UUID NOT NULL,
    meal_name VARCHAR(100) NOT NULL,
    calories INT NOT NULL CHECK (calories >= 0),
    protein_grams DECIMAL(5, 2),
    carbs_grams DECIMAL(5, 2),
    fats_grams DECIMAL(5, 2),
    FOREIGN KEY (log_id) REFERENCES NutritionLogs(log_id) ON DELETE CASCADE
);

---------------------------------------
-- 4. Progress Tracking
---------------------------------------
-- Distinct tracking for Personal Bests, separated from raw workout logs for fast querying.
CREATE TABLE PersonalBests (
    pb_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    exercise_name VARCHAR(100) NOT NULL,
    max_weight_lbs DECIMAL(6, 2) NOT NULL,
    achieved_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, exercise_name) -- Only store the absolute best per exercise per user
);

---------------------------------------
-- Indexes for Performance Optimization
---------------------------------------
-- Commonly queried paths (User -> Workouts, User -> Nutrition)
CREATE INDEX idx_workouts_user_date ON Workouts(user_id, workout_date);
CREATE INDEX idx_nutrition_user_date ON NutritionLogs(user_id, log_date);
CREATE INDEX idx_pb_user_exercise ON PersonalBests(user_id, exercise_name);

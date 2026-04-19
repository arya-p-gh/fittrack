export interface User {
  id: string;
  email: string;
}

export interface Exercise {

  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
}

export interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
}

export interface NutritionLog {
  id: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface PersonalBest {
  exerciseName: string;
  weight: number;
  date: string;
}

export interface ExerciseTemplate {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: ExerciseTemplate[];
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  gifUrl?: string;
}
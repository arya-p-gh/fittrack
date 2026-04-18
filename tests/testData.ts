import { Exercise, NutritionLog, PersonalBest, Workout } from '../src/domain/entities';

export const buildExercise = (overrides: Partial<Exercise> = {}): Exercise => ({
  id: 'exercise-1',
  name: 'Bench Press',
  sets: 3,
  reps: 10,
  weight: 80,
  date: '2026-04-18T00:00:00.000Z',
  ...overrides,
});

export const buildWorkout = (overrides: Partial<Workout> = {}): Workout => ({
  id: 'workout-1',
  date: '2026-04-18T00:00:00.000Z',
  exercises: [buildExercise()],
  ...overrides,
});

export const buildNutritionLog = (
  overrides: Partial<NutritionLog> = {}
): NutritionLog => ({
  id: 'nutrition-1',
  date: '2026-04-18T00:00:00.000Z',
  calories: 2200,
  protein: 150,
  carbs: 240,
  fats: 70,
  ...overrides,
});

export const buildPersonalBest = (
  overrides: Partial<PersonalBest> = {}
): PersonalBest => ({
  exerciseName: 'Bench Press',
  weight: 100,
  date: '2026-04-18T00:00:00.000Z',
  ...overrides,
});

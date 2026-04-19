import { ExerciseDefinition } from '../entities';

export const exerciseDefinitions: ExerciseDefinition[] = [
  // Chest
  { id: 'chest-1', name: 'Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { id: 'chest-2', name: 'Incline Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { id: 'chest-3', name: 'Dumbbell Press', muscleGroup: 'Chest', equipment: 'Dumbbell' },
  { id: 'chest-4', name: 'Push-Ups', muscleGroup: 'Chest', equipment: 'Bodyweight' },
  { id: 'chest-5', name: 'Chest Flyes', muscleGroup: 'Chest', equipment: 'Dumbbell' },
  { id: 'chest-6', name: 'Cable Flyes', muscleGroup: 'Chest', equipment: 'Cable' },
  { id: 'chest-7', name: 'Machine Chest Press', muscleGroup: 'Chest', equipment: 'Machine' },

  // Back
  { id: 'back-1', name: 'Pull-Ups', muscleGroup: 'Back', equipment: 'Bodyweight' },
  { id: 'back-2', name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'Cable' },
  { id: 'back-3', name: 'Barbell Row', muscleGroup: 'Back', equipment: 'Barbell' },
  { id: 'back-4', name: 'Dumbbell Row', muscleGroup: 'Back', equipment: 'Dumbbell' },
  { id: 'back-5', name: 'Deadlift', muscleGroup: 'Back', equipment: 'Barbell' },

  // Legs
  { id: 'legs-1', name: 'Squats', muscleGroup: 'Legs', equipment: 'Barbell' },
  { id: 'legs-2', name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine' },
  { id: 'legs-3', name: 'Romanian Deadlift', muscleGroup: 'Legs', equipment: 'Barbell' },
  { id: 'legs-4', name: 'Leg Extensions', muscleGroup: 'Legs', equipment: 'Machine' },
  { id: 'legs-5', name: 'Leg Curls', muscleGroup: 'Legs', equipment: 'Machine' },
  { id: 'legs-6', name: 'Calf Raises', muscleGroup: 'Legs', equipment: 'Machine' },
  { id: 'legs-7', name: 'Lunges', muscleGroup: 'Legs', equipment: 'Dumbbell' },

  // Shoulders
  { id: 'shoulders-1', name: 'Overhead Press', muscleGroup: 'Shoulders', equipment: 'Barbell' },
  { id: 'shoulders-2', name: 'Lateral Raises', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { id: 'shoulders-3', name: 'Front Raises', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { id: 'shoulders-4', name: 'Face Pull', muscleGroup: 'Shoulders', equipment: 'Cable' },
  { id: 'shoulders-5', name: 'Arnold Press', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },

  // Arms
  { id: 'arms-1', name: 'Bicep Curls', muscleGroup: 'Arms', equipment: 'Dumbbell' },
  { id: 'arms-2', name: 'Tricep Extensions', muscleGroup: 'Arms', equipment: 'Dumbbell' },
  { id: 'arms-3', name: 'Hammer Curls', muscleGroup: 'Arms', equipment: 'Dumbbell' },
  { id: 'arms-4', name: 'Skull Crushers', muscleGroup: 'Arms', equipment: 'Barbell' },
  { id: 'arms-5', name: 'Tricep Pushdown', muscleGroup: 'Arms', equipment: 'Cable' },

  // Core
  { id: 'core-1', name: 'Plank', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { id: 'core-2', name: 'Crunches', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { id: 'core-3', name: 'Russian Twists', muscleGroup: 'Core', equipment: 'Bodyweight' },
  { id: 'core-4', name: 'Hanging Leg Raises', muscleGroup: 'Core', equipment: 'Bodyweight' },
];

export const getExercisesByMuscleGroup = (muscleGroup: string) => 
  exerciseDefinitions.filter(e => e.muscleGroup === muscleGroup);

export const getExercisesByEquipment = (equipment: string) => 
  exerciseDefinitions.filter(e => e.equipment === equipment);

export const searchExercises = (query: string) => 
  exerciseDefinitions.filter(e => e.name.toLowerCase().includes(query.toLowerCase()));
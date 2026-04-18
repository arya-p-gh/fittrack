export interface ExerciseCategory {
  name: string;
  exercises: string[];
}

export const exerciseCategories: ExerciseCategory[] = [
  {
    name: 'Chest',
    exercises: [
      'Bench Press',
      'Incline Bench Press',
      'Decline Bench Press',
      'Dumbbell Press',
      'Push-Ups',
      'Chest Flyes',
      'Cable Flyes',
      'Machine Chest Press',
    ],
  },
  {
    name: 'Back',
    exercises: [
      'Pull-Ups',
      'Lat Pulldown',
      'Barbell Row',
      'Dumbbell Row',
      'Face Pull',
      'Cable Row',
      'Deadlift',
      'Good Morning',
    ],
  },
  {
    name: 'Legs',
    exercises: [
      'Squats',
      'Leg Press',
      'Romanian Deadlift',
      'Leg Extensions',
      'Leg Curls',
      'Calf Raises',
      'Lunges',
      'Hip Thrust',
    ],
  },
  {
    name: 'Shoulders',
    exercises: [
      'Overhead Press',
      'Lateral Raises',
      'Front Raises',
      'Face Pull',
      'Reverse Flyes',
      'Upright Row',
      'Shrugs',
      'Arnold Press',
    ],
  },
  {
    name: 'Arms',
    exercises: [
      'Bicep Curls',
      'Tricep Extensions',
      'Hammer Curls',
      'Skull Crushers',
      'Preacher Curls',
      'Cable Curls',
      'Tricep Pushdown',
      'Concentration Curls',
    ],
  },
  {
    name: 'Core',
    exercises: [
      'Plank',
      'Crunches',
      'Russian Twists',
      'Leg Raises',
      'Ab Wheel Rollout',
      'Cable Woodchops',
      'Hanging Leg Raises',
      'Side Plank',
    ],
  },
]; 
import { Exercise, Workout } from '../../domain/entities';

export interface WorkoutMetrics {
  totalWorkouts: number;
  totalExercises: number;
}

export class WorkoutService {
  addWorkout(workouts: Workout[], workout: Workout): Workout[] {
    this.ensureWorkoutCollection(workouts);
    this.ensureValidWorkout(workout);

    return [...workouts, workout];
  }

  addExercise(workouts: Workout[], workoutId: string, exercise: Exercise): Workout[] {
    this.ensureWorkoutCollection(workouts);
    this.ensureValidExercise(exercise);

    if (!workoutId.trim()) {
      throw new Error('[WorkoutService] workoutId is required.');
    }

    const exists = workouts.some((workout) => workout.id === workoutId);
    if (!exists) {
      throw new Error(`[WorkoutService] Workout with id ${workoutId} was not found.`);
    }

    return workouts.map((workout) =>
      workout.id === workoutId
        ? {
            ...workout,
            exercises: [...workout.exercises, exercise],
          }
        : workout
    );
  }

  updateWorkout(workouts: Workout[], updatedWorkout: Workout): Workout[] {
    this.ensureWorkoutCollection(workouts);
    this.ensureValidWorkout(updatedWorkout);

    const exists = workouts.some((workout) => workout.id === updatedWorkout.id);
    if (!exists) {
      throw new Error(`[WorkoutService] Workout with id ${updatedWorkout.id} was not found.`);
    }

    return workouts.map((workout) =>
      workout.id === updatedWorkout.id ? updatedWorkout : workout
    );
  }

  deleteWorkout(workouts: Workout[], workoutId: string): Workout[] {
    this.ensureWorkoutCollection(workouts);
    if (!workoutId.trim()) {
      throw new Error('[WorkoutService] workoutId is required.');
    }

    const exists = workouts.some((workout) => workout.id === workoutId);
    if (!exists) {
      throw new Error(`[WorkoutService] Workout with id ${workoutId} was not found.`);
    }

    return workouts.filter((workout) => workout.id !== workoutId);
  }

  calculateMetrics(workouts: Workout[]): WorkoutMetrics {
    this.ensureWorkoutCollection(workouts);
    return {
      totalWorkouts: workouts.length,
      totalExercises: workouts.reduce((total, workout) => total + workout.exercises.length, 0),
    };
  }

  sortByDate(workouts: Workout[]): Workout[] {
    this.ensureWorkoutCollection(workouts);
    return [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getRecentWorkouts(workouts: Workout[], limit = 5): Workout[] {
    if (limit <= 0) {
      throw new Error('[WorkoutService] limit must be greater than 0.');
    }
    return this.sortByDate(workouts).slice(0, limit);
  }

  private ensureWorkoutCollection(workouts: Workout[]): void {
    if (!Array.isArray(workouts)) {
      throw new Error('[WorkoutService] workouts must be an array.');
    }
  }

  private ensureValidWorkout(workout: Workout): void {
    if (!this.isValidWorkout(workout)) {
      throw new Error('[WorkoutService] Invalid workout data.');
    }
  }

  private ensureValidExercise(exercise: Exercise): void {
    if (!this.isValidExercise(exercise)) {
      throw new Error('[WorkoutService] Invalid exercise data.');
    }
  }

  private isValidWorkout(workout: Workout): boolean {
    return (
      Boolean(workout.id) &&
      Boolean(workout.date) &&
      Array.isArray(workout.exercises) &&
      workout.exercises.every((exercise) => this.isValidExercise(exercise))
    );
  }

  private isValidExercise(exercise: Exercise): boolean {
    return (
      Boolean(exercise.id) &&
      Boolean(exercise.name?.trim()) &&
      Boolean(exercise.date) &&
      exercise.sets > 0 &&
      exercise.reps > 0 &&
      exercise.weight >= 0
    );
  }
}

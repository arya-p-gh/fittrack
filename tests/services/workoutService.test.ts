import { describe, expect, it } from 'vitest';
import { WorkoutService } from '../../src/application/workout/WorkoutService';
import { buildExercise, buildWorkout } from '../testData';

describe('WorkoutService', () => {
  const service = new WorkoutService();

  it('adds a valid workout (happy path)', () => {
    const result = service.addWorkout([], buildWorkout());

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('workout-1');
  });

  it('throws when workout is invalid', () => {
    expect(() =>
      service.addWorkout([], buildWorkout({ id: '' }))
    ).toThrow('[WorkoutService] Invalid workout data.');
  });

  it('calculates metrics for empty array', () => {
    const metrics = service.calculateMetrics([]);

    expect(metrics).toEqual({
      totalWorkouts: 0,
      totalExercises: 0,
    });
  });

  it('keeps duplicate ids if explicitly provided (current behavior)', () => {
    const workout = buildWorkout();
    const result = service.addWorkout([workout], workout);

    expect(result).toHaveLength(2);
  });

  it('handles large input and returns newest workouts first', () => {
    const workouts = Array.from({ length: 300 }, (_, i) =>
      buildWorkout({
        id: `w-${i}`,
        date: new Date(2026, 0, 1 + i).toISOString(),
      })
    );

    const recent = service.getRecentWorkouts(workouts, 5);

    expect(recent).toHaveLength(5);
    expect(recent[0].id).toBe('w-299');
  });

  it('adds exercise to existing workout only', () => {
    const workouts = [buildWorkout({ id: 'target-workout', exercises: [] })];
    const exercise = buildExercise({ id: 'exercise-99' });

    const updated = service.addExercise(workouts, 'target-workout', exercise);

    expect(updated[0].exercises).toHaveLength(1);
    expect(updated[0].exercises[0].id).toBe('exercise-99');
  });
});

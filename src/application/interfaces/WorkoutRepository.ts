import { Workout } from '../../domain/entities';

export interface WorkoutRepository {
  getAll(): Workout[];
  saveAll(workouts: Workout[]): void;
}

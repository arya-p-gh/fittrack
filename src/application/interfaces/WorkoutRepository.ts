import { Workout } from '../../domain/entities';

export interface WorkoutRepository {
  getAll(): Promise<Workout[]>;
  saveAll(workouts: Workout[]): Promise<void>;
}

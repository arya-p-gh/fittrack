import { WorkoutRepository } from '../../application/interfaces/WorkoutRepository';
import { Workout } from '../../domain/entities';
import { apiFetch } from '../api/apiClient';

export class ApiWorkoutRepository implements WorkoutRepository {
  async getAll(): Promise<Workout[]> {
    const res = await apiFetch('/workouts');
    if (!res.ok) throw new Error('Failed to fetch workouts');
    return res.json();
  }

  async saveAll(workouts: Workout[]): Promise<void> {
    const res = await apiFetch('/workouts', {
      method: 'POST',
      body: JSON.stringify(workouts),
    });
    if (!res.ok) throw new Error('Failed to save workouts');
  }
}

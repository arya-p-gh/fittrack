import { WorkoutRepository } from '../../application/interfaces/WorkoutRepository';
import { Workout } from '../../domain/entities';

const API_BASE = 'http://localhost:5000/api';

export class ApiWorkoutRepository implements WorkoutRepository {
  async getAll(): Promise<Workout[]> {
    const res = await fetch(`${API_BASE}/workouts`);
    if (!res.ok) throw new Error('Failed to fetch workouts');
    return res.json();
  }

  async saveAll(workouts: Workout[]): Promise<void> {
    const res = await fetch(`${API_BASE}/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workouts),
    });
    if (!res.ok) throw new Error('Failed to save workouts');
  }
}

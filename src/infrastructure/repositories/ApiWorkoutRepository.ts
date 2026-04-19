import { WorkoutRepository } from '../../application/interfaces/WorkoutRepository';
import { Workout } from '../../domain/entities';

const API_BASE = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('fittrack_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export class ApiWorkoutRepository implements WorkoutRepository {
  async getAll(): Promise<Workout[]> {
    const res = await fetch(`${API_BASE}/workouts`, { headers: getHeaders() });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) return [];
      throw new Error('Failed to fetch workouts');
    }
    return res.json();
  }

  async saveAll(workouts: Workout[]): Promise<void> {
    const res = await fetch(`${API_BASE}/workouts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(workouts),
    });
    if (!res.ok) throw new Error('Failed to save workouts');
  }
}

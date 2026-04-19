import { ExerciseRepository } from '../../application/interfaces/ExerciseRepository';
import { ExerciseDefinition } from '../../domain/entities';
import { apiFetch } from '../api/apiClient';

export class ApiExerciseRepository implements ExerciseRepository {
  async getAll(): Promise<ExerciseDefinition[]> {
    const res = await apiFetch('/exercises');
    if (!res.ok) throw new Error('Failed to fetch exercises');
    return res.json();
  }
}

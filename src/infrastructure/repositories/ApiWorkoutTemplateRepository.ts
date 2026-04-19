import { WorkoutTemplateRepository } from '../../application/interfaces/WorkoutTemplateRepository';
import { WorkoutTemplate } from '../../domain/entities';
import { apiFetch } from '../api/apiClient';

export class ApiWorkoutTemplateRepository implements WorkoutTemplateRepository {
  async getAll(): Promise<WorkoutTemplate[]> {
    const res = await apiFetch('/workout_templates');
    if (!res.ok) throw new Error('Failed to fetch workout templates');
    return res.json();
  }

  async saveAll(templates: WorkoutTemplate[]): Promise<void> {
    const res = await apiFetch('/workout_templates', {
      method: 'POST',
      body: JSON.stringify(templates),
    });
    if (!res.ok) throw new Error('Failed to save workout templates');
  }
}

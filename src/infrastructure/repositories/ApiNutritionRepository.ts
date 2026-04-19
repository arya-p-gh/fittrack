import { NutritionRepository } from '../../application/interfaces/NutritionRepository';
import { NutritionLog } from '../../domain/entities';
import { apiFetch } from '../api/apiClient';

export class ApiNutritionRepository implements NutritionRepository {
  async getAll(): Promise<NutritionLog[]> {
    const res = await apiFetch('/nutrition');
    if (!res.ok) throw new Error('Failed to fetch nutrition logs');
    return res.json();
  }

  async saveAll(nutritionLogs: NutritionLog[]): Promise<void> {
    const res = await apiFetch('/nutrition', {
      method: 'POST',
      body: JSON.stringify(nutritionLogs),
    });
    if (!res.ok) throw new Error('Failed to save nutrition logs');
  }
}

import { NutritionRepository } from '../../application/interfaces/NutritionRepository';
import { NutritionLog } from '../../domain/entities';

const API_BASE = 'http://localhost:5000/api';

export class ApiNutritionRepository implements NutritionRepository {
  async getAll(): Promise<NutritionLog[]> {
    const res = await fetch(`${API_BASE}/nutrition`);
    if (!res.ok) throw new Error('Failed to fetch nutrition logs');
    return res.json();
  }

  async saveAll(nutritionLogs: NutritionLog[]): Promise<void> {
    const res = await fetch(`${API_BASE}/nutrition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nutritionLogs),
    });
    if (!res.ok) throw new Error('Failed to save nutrition logs');
  }
}

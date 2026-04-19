import { NutritionRepository } from '../../application/interfaces/NutritionRepository';
import { NutritionLog } from '../../domain/entities';

const API_BASE = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('fittrack_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export class ApiNutritionRepository implements NutritionRepository {
  async getAll(): Promise<NutritionLog[]> {
    const res = await fetch(`${API_BASE}/nutrition`, { headers: getHeaders() });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) return [];
      throw new Error('Failed to fetch nutrition logs');
    }
    return res.json();
  }

  async saveAll(nutritionLogs: NutritionLog[]): Promise<void> {
    const res = await fetch(`${API_BASE}/nutrition`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(nutritionLogs),
    });
    if (!res.ok) throw new Error('Failed to save nutrition logs');
  }
}

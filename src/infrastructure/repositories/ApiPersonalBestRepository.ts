import { PersonalBestRepository } from '../../application/interfaces/PersonalBestRepository';
import { PersonalBest } from '../../domain/entities';

const API_BASE = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('fittrack_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export class ApiPersonalBestRepository implements PersonalBestRepository {
  async getAll(): Promise<PersonalBest[]> {
    const res = await fetch(`${API_BASE}/personal-bests`, { headers: getHeaders() });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) return [];
      throw new Error('Failed to fetch personal bests');
    }
    return res.json();
  }

  async saveAll(personalBests: PersonalBest[]): Promise<void> {
    const res = await fetch(`${API_BASE}/personal-bests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(personalBests),
    });
    if (!res.ok) throw new Error('Failed to save personal bests');
  }
}

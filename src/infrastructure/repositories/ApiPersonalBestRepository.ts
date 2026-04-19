import { PersonalBestRepository } from '../../application/interfaces/PersonalBestRepository';
import { PersonalBest } from '../../domain/entities';

const API_BASE = 'http://localhost:5000/api';

export class ApiPersonalBestRepository implements PersonalBestRepository {
  async getAll(): Promise<PersonalBest[]> {
    const res = await fetch(`${API_BASE}/personal-bests`);
    if (!res.ok) throw new Error('Failed to fetch personal bests');
    return res.json();
  }

  async saveAll(personalBests: PersonalBest[]): Promise<void> {
    const res = await fetch(`${API_BASE}/personal-bests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personalBests),
    });
    if (!res.ok) throw new Error('Failed to save personal bests');
  }
}

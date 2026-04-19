import { PersonalBestRepository } from '../../application/interfaces/PersonalBestRepository';
import { PersonalBest } from '../../domain/entities';
import { apiFetch } from '../api/apiClient';

export class ApiPersonalBestRepository implements PersonalBestRepository {
  async getAll(): Promise<PersonalBest[]> {
    const res = await apiFetch('/personal-bests');
    if (!res.ok) throw new Error('Failed to fetch personal bests');
    return res.json();
  }

  async saveAll(personalBests: PersonalBest[]): Promise<void> {
    const res = await apiFetch('/personal-bests', {
      method: 'POST',
      body: JSON.stringify(personalBests),
    });
    if (!res.ok) throw new Error('Failed to save personal bests');
  }
}

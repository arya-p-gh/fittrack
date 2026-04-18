import { PersonalBest } from '../../domain/entities';

export interface PersonalBestRepository {
  getAll(): PersonalBest[];
  saveAll(personalBests: PersonalBest[]): void;
}

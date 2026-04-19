import { PersonalBest } from '../../domain/entities';

export interface PersonalBestRepository {
  getAll(): Promise<PersonalBest[]>;
  saveAll(personalBests: PersonalBest[]): Promise<void>;
}

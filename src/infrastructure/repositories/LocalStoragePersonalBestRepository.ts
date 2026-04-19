import { PersonalBestRepository } from '../../application/interfaces/PersonalBestRepository';
import { PersonalBest } from '../../domain/entities';
import { AppLogger } from '../../application/common/AppLogger';
import { readArrayFromStorage, writeArrayToStorage } from '../storage/localStorageUtils';

export class LocalStoragePersonalBestRepository implements PersonalBestRepository {
  private readonly scope = 'LocalStoragePersonalBestRepository';

  constructor(private readonly storageKey = 'personalBests') {}

  async getAll(): Promise<PersonalBest[]> {
    return Promise.resolve(readArrayFromStorage<PersonalBest>(this.storageKey, this.scope));
  }

  async saveAll(personalBests: PersonalBest[]): Promise<void> {
    if (!Array.isArray(personalBests)) {
      const errorMessage = '[LocalStoragePersonalBestRepository] saveAll expects an array.';
      AppLogger.error({
        scope: this.scope,
        action: 'saveAll',
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }

    writeArrayToStorage(this.storageKey, personalBests, this.scope);
    return Promise.resolve();
  }
}

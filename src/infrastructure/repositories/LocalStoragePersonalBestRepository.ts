import { PersonalBestRepository } from '../../application/interfaces/PersonalBestRepository';
import { PersonalBest } from '../../domain/entities';
import { AppLogger } from '../../application/common/AppLogger';
import { readArrayFromStorage, writeArrayToStorage } from '../storage/localStorageUtils';

export class LocalStoragePersonalBestRepository implements PersonalBestRepository {
  private readonly scope = 'LocalStoragePersonalBestRepository';

  constructor(private readonly storageKey = 'personalBests') {}

  getAll(): PersonalBest[] {
    return readArrayFromStorage<PersonalBest>(this.storageKey, this.scope);
  }

  saveAll(personalBests: PersonalBest[]): void {
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
  }
}

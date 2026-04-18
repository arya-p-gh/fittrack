import { NutritionRepository } from '../../application/interfaces/NutritionRepository';
import { NutritionLog } from '../../domain/entities';
import { AppLogger } from '../../application/common/AppLogger';
import { readArrayFromStorage, writeArrayToStorage } from '../storage/localStorageUtils';

export class LocalStorageNutritionRepository implements NutritionRepository {
  private readonly scope = 'LocalStorageNutritionRepository';

  constructor(private readonly storageKey = 'nutritionLogs') {}

  getAll(): NutritionLog[] {
    return readArrayFromStorage<NutritionLog>(this.storageKey, this.scope);
  }

  saveAll(nutritionLogs: NutritionLog[]): void {
    if (!Array.isArray(nutritionLogs)) {
      const errorMessage = '[LocalStorageNutritionRepository] saveAll expects an array.';
      AppLogger.error({
        scope: this.scope,
        action: 'saveAll',
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }

    writeArrayToStorage(this.storageKey, nutritionLogs, this.scope);
  }
}

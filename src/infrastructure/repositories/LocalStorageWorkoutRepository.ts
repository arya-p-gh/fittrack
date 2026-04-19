import { WorkoutRepository } from '../../application/interfaces/WorkoutRepository';
import { Workout } from '../../domain/entities';
import { AppLogger } from '../../application/common/AppLogger';
import { readArrayFromStorage, writeArrayToStorage } from '../storage/localStorageUtils';

export class LocalStorageWorkoutRepository implements WorkoutRepository {
  private readonly scope = 'LocalStorageWorkoutRepository';

  constructor(private readonly storageKey = 'workouts') {}

  async getAll(): Promise<Workout[]> {
    return Promise.resolve(readArrayFromStorage<Workout>(this.storageKey, this.scope));
  }

  async saveAll(workouts: Workout[]): Promise<void> {
    if (!Array.isArray(workouts)) {
      const errorMessage = '[LocalStorageWorkoutRepository] saveAll expects an array.';
      AppLogger.error({
        scope: this.scope,
        action: 'saveAll',
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }

    writeArrayToStorage(this.storageKey, workouts, this.scope);
    return Promise.resolve();
  }
}

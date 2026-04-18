import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalStorageWorkoutRepository } from '../../src/infrastructure/repositories/LocalStorageWorkoutRepository';
import { LocalStorageNutritionRepository } from '../../src/infrastructure/repositories/LocalStorageNutritionRepository';
import { LocalStoragePersonalBestRepository } from '../../src/infrastructure/repositories/LocalStoragePersonalBestRepository';
import { buildNutritionLog, buildPersonalBest, buildWorkout } from '../testData';

interface MockStorage {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
}

const createMockStorage = (initialData: Record<string, string> = {}): MockStorage => {
  const store = { ...initialData };

  return {
    getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    }),
  };
};

describe('LocalStorage repositories', () => {
  beforeEach(() => {
    const mockStorage = createMockStorage();
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      configurable: true,
      writable: true,
    });
  });

  it('workout repository saves and loads using mocked storage', () => {
    const repository = new LocalStorageWorkoutRepository('workouts');
    const workouts = [buildWorkout()];

    repository.saveAll(workouts);
    const loaded = repository.getAll();

    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe('workout-1');
  });

  it('nutrition repository returns [] for invalid JSON payload', () => {
    const mockStorage = createMockStorage({ nutritionLogs: '{invalid-json' });
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      configurable: true,
      writable: true,
    });

    const repository = new LocalStorageNutritionRepository('nutritionLogs');
    expect(repository.getAll()).toEqual([]);
  });

  it('personal best repository throws when storage write fails', () => {
    const mockStorage = createMockStorage();
    mockStorage.setItem.mockImplementation(() => {
      throw new Error('storage quota exceeded');
    });

    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      configurable: true,
      writable: true,
    });

    const repository = new LocalStoragePersonalBestRepository('personalBests');

    expect(() => repository.saveAll([buildPersonalBest()])).toThrow(
      '[LocalStoragePersonalBestRepository] Failed to persist personalBests.'
    );
  });

  it('nutrition repository round-trips mocked storage data', () => {
    const repository = new LocalStorageNutritionRepository('nutritionLogs');
    repository.saveAll([buildNutritionLog()]);

    const loaded = repository.getAll();
    expect(loaded[0].id).toBe('nutrition-1');
  });
});

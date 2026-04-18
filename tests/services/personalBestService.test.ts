import { describe, expect, it } from 'vitest';
import { PersonalBestService } from '../../src/application/personalBest/PersonalBestService';
import { buildPersonalBest } from '../testData';

describe('PersonalBestService', () => {
  const service = new PersonalBestService();

  it('adds a valid personal best (happy path)', () => {
    const result = service.addPersonalBest([], buildPersonalBest());

    expect(result).toHaveLength(1);
    expect(result[0].exerciseName).toBe('Bench Press');
  });

  it('throws on invalid personal best', () => {
    expect(() =>
      service.addPersonalBest([], buildPersonalBest({ exerciseName: '' }))
    ).toThrow('[PersonalBestService] Invalid personal best data.');
  });

  it('upserts by exercise name (duplicate domain key)', () => {
    const initial = [buildPersonalBest({ exerciseName: 'Squat', weight: 140 })];
    const updated = service.updatePersonalBest(
      initial,
      buildPersonalBest({ exerciseName: 'squat', weight: 150 })
    );

    expect(updated).toHaveLength(1);
    expect(updated[0].weight).toBe(150);
  });

  it('sorts descending by weight', () => {
    const sorted = service.sortByWeightDesc([
      buildPersonalBest({ exerciseName: 'Deadlift', weight: 180 }),
      buildPersonalBest({ exerciseName: 'Bench', weight: 110 }),
      buildPersonalBest({ exerciseName: 'Squat', weight: 160 }),
    ]);

    expect(sorted.map((pb) => pb.weight)).toEqual([180, 160, 110]);
  });
});

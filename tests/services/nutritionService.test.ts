import { describe, expect, it } from 'vitest';
import { NutritionService } from '../../src/application/nutrition/NutritionService';
import { buildNutritionLog } from '../testData';

describe('NutritionService', () => {
  const service = new NutritionService();

  it('adds a valid nutrition log (happy path)', () => {
    const result = service.addNutritionLog([], buildNutritionLog());

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('nutrition-1');
  });

  it('throws on invalid nutrition log', () => {
    expect(() =>
      service.addNutritionLog([], buildNutritionLog({ calories: -1 }))
    ).toThrow('[NutritionService] Invalid nutrition log data.');
  });

  it('calculates metrics correctly', () => {
    const logs = [
      buildNutritionLog({ calories: 2000 }),
      buildNutritionLog({ id: 'nutrition-2', calories: 2500 }),
    ];

    const metrics = service.calculateMetrics(logs);

    expect(metrics.totalCalories).toBe(4500);
    expect(metrics.averageCalories).toBe(2250);
    expect(metrics.daysTracked).toBe(2);
  });

  it('handles empty logs edge case', () => {
    expect(service.calculateMetrics([])).toEqual({
      totalCalories: 0,
      averageCalories: 0,
      daysTracked: 0,
    });
  });
});

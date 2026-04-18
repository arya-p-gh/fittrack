import { NutritionLog } from '../../domain/entities';

export interface NutritionRepository {
  getAll(): NutritionLog[];
  saveAll(nutritionLogs: NutritionLog[]): void;
}

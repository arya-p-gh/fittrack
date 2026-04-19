import { NutritionLog } from '../../domain/entities';

export interface NutritionRepository {
  getAll(): Promise<NutritionLog[]>;
  saveAll(nutritionLogs: NutritionLog[]): Promise<void>;
}

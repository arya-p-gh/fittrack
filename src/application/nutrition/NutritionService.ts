import { NutritionLog } from '../../domain/entities';

export interface NutritionMetrics {
  totalCalories: number;
  averageCalories: number;
  daysTracked: number;
}

export class NutritionService {
  addNutritionLog(logs: NutritionLog[], log: NutritionLog): NutritionLog[] {
    this.ensureLogCollection(logs);
    this.ensureValidNutritionLog(log);

    return [...logs, log];
  }

  updateNutritionLog(logs: NutritionLog[], updatedLog: NutritionLog): NutritionLog[] {
    this.ensureLogCollection(logs);
    this.ensureValidNutritionLog(updatedLog);

    const exists = logs.some((log) => log.id === updatedLog.id);
    if (!exists) {
      throw new Error(`[NutritionService] Nutrition log with id ${updatedLog.id} was not found.`);
    }

    return logs.map((log) => (log.id === updatedLog.id ? updatedLog : log));
  }

  deleteNutritionLog(logs: NutritionLog[], logId: string): NutritionLog[] {
    this.ensureLogCollection(logs);
    if (!logId.trim()) {
      throw new Error('[NutritionService] logId is required.');
    }

    const exists = logs.some((log) => log.id === logId);
    if (!exists) {
      throw new Error(`[NutritionService] Nutrition log with id ${logId} was not found.`);
    }

    return logs.filter((log) => log.id !== logId);
  }

  calculateMetrics(logs: NutritionLog[]): NutritionMetrics {
    this.ensureLogCollection(logs);
    const totalCalories = logs.reduce((total, log) => total + log.calories, 0);
    const daysTracked = logs.length;

    return {
      totalCalories,
      averageCalories: daysTracked === 0 ? 0 : Math.round(totalCalories / daysTracked),
      daysTracked,
    };
  }

  sortByDate(logs: NutritionLog[]): NutritionLog[] {
    this.ensureLogCollection(logs);
    return [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private ensureLogCollection(logs: NutritionLog[]): void {
    if (!Array.isArray(logs)) {
      throw new Error('[NutritionService] nutrition logs must be an array.');
    }
  }

  private ensureValidNutritionLog(log: NutritionLog): void {
    if (!this.isValidNutritionLog(log)) {
      throw new Error('[NutritionService] Invalid nutrition log data.');
    }
  }

  private isValidNutritionLog(log: NutritionLog): boolean {
    return (
      Boolean(log.id) &&
      Boolean(log.date) &&
      log.calories >= 0 &&
      log.protein >= 0 &&
      log.carbs >= 0 &&
      log.fats >= 0
    );
  }
}

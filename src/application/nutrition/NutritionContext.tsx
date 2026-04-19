import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { NutritionLog } from '../../domain/entities';
import { NutritionMetrics, NutritionService } from './NutritionService';
import { NutritionRepository } from '../interfaces/NutritionRepository';
import { ApiNutritionRepository } from '../../infrastructure/repositories/ApiNutritionRepository';
import { AppLogger } from '../common/AppLogger';

interface NutritionContextType {
  nutritionLogs: NutritionLog[];
  addNutritionLog: (log: NutritionLog) => Promise<void>;
  updateNutritionLog: (log: NutritionLog) => Promise<void>;
  deleteNutritionLog: (logId: string) => Promise<void>;
  computeMetrics: () => NutritionMetrics;
  getSortedNutritionLogs: () => NutritionLog[];
}

interface NutritionProviderProps {
  children: ReactNode;
  repository?: NutritionRepository;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);
const nutritionService = new NutritionService();
const defaultNutritionRepository: NutritionRepository = new ApiNutritionRepository();
const logScope = 'NutritionContext';

export const NutritionProvider = ({
  children,
  repository = defaultNutritionRepository,
}: NutritionProviderProps) => {
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setNutritionLogs(await repository.getAll());
      } catch (error) {
        AppLogger.error({
          scope: logScope,
          action: 'load',
          message: 'Failed to load nutrition logs from repository. Falling back to empty state.',
          details: error,
        });
        setNutritionLogs([]);
      }
    };
    load();
  }, [repository]);

  const persist = async (nextLogs: NutritionLog[]) => {
    await repository.saveAll(nextLogs);
    setNutritionLogs(nextLogs);
  };

  const addNutritionLog = async (log: NutritionLog) => {
    try {
      await persist(nutritionService.addNutritionLog(nutritionLogs, log));
      AppLogger.info({
        scope: logScope,
        action: 'addNutritionLog',
        message: `Nutrition log ${log.id} added successfully.`,
      });
    } catch (error) {
      AppLogger.error({
        scope: logScope,
        action: 'addNutritionLog',
        message: 'Failed to add nutrition log.',
        details: error,
      });
    }
  };

  const updateNutritionLog = async (updatedLog: NutritionLog) => {
    try {
      await persist(nutritionService.updateNutritionLog(nutritionLogs, updatedLog));
      AppLogger.info({
        scope: logScope,
        action: 'updateNutritionLog',
        message: `Nutrition log ${updatedLog.id} updated successfully.`,
      });
    } catch (error) {
      AppLogger.error({
        scope: logScope,
        action: 'updateNutritionLog',
        message: 'Failed to update nutrition log.',
        details: error,
      });
    }
  };

  const deleteNutritionLog = async (logId: string) => {
    try {
      await persist(nutritionService.deleteNutritionLog(nutritionLogs, logId));
      AppLogger.info({
        scope: logScope,
        action: 'deleteNutritionLog',
        message: `Nutrition log ${logId} deleted successfully.`,
      });
    } catch (error) {
      AppLogger.error({
        scope: logScope,
        action: 'deleteNutritionLog',
        message: 'Failed to delete nutrition log.',
        details: error,
      });
    }
  };

  const computeMetrics = () => nutritionService.calculateMetrics(nutritionLogs);
  const getSortedNutritionLogs = () => nutritionService.sortByDate(nutritionLogs);

  return (
    <NutritionContext.Provider
      value={{
        nutritionLogs,
        addNutritionLog,
        updateNutritionLog,
        deleteNutritionLog,
        computeMetrics,
        getSortedNutritionLogs,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};

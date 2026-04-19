import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ExerciseDefinition } from '../../domain/entities';
import { ExerciseRepository } from '../interfaces/ExerciseRepository';
import { ApiExerciseRepository } from '../../infrastructure/repositories/ApiExerciseRepository';
import { exerciseDefinitions as staticExercises } from '../../domain/reference/exercises';
import { AppLogger } from '../common/AppLogger';

interface ExerciseContextType {
  exercises: ExerciseDefinition[];
  loading: boolean;
}

interface ExerciseProviderProps {
  children: ReactNode;
  repository?: ExerciseRepository;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);
const defaultRepository: ExerciseRepository = new ApiExerciseRepository();
const logScope = 'ExerciseContext';

export const ExerciseProvider = ({
  children,
  repository = defaultRepository,
}: ExerciseProviderProps) => {
  const [exercises, setExercises] = useState<ExerciseDefinition[]>(staticExercises);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await repository.getAll();
        if (data && data.length > 0) {
          setExercises(data);
        } else {
          // API returned empty — keep static data
          setExercises(staticExercises);
        }
      } catch (error) {
        AppLogger.error({
          scope: logScope,
          action: 'load',
          message: 'Failed to load exercises from API. Using static fallback.',
          details: error,
        });
        // Backend unreachable — show static exercises regardless
        setExercises(staticExercises);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [repository]);

  return (
    <ExerciseContext.Provider value={{ exercises, loading }}>
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }
  return context;
};

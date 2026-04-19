import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Exercise, Workout } from '../../domain/entities';
import { WorkoutMetrics, WorkoutService } from './WorkoutService';
import { WorkoutRepository } from '../interfaces/WorkoutRepository';
import { ApiWorkoutRepository } from '../../infrastructure/repositories/ApiWorkoutRepository';
import { AppLogger } from '../common/AppLogger';

interface WorkoutContextType {
  workouts: Workout[];
  addWorkout: (workout: Workout) => Promise<void>;
  addExercise: (workoutId: string, exercise: Exercise) => Promise<void>;
  updateWorkout: (workout: Workout) => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  computeMetrics: () => WorkoutMetrics;
  getRecentWorkouts: (limit?: number) => Workout[];
  getSortedWorkouts: () => Workout[];
}

interface WorkoutProviderProps {
  children: ReactNode;
  repository?: WorkoutRepository;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);
const workoutService = new WorkoutService();
const defaultWorkoutRepository: WorkoutRepository = new ApiWorkoutRepository();
const logScope = 'WorkoutContext';

export const WorkoutProvider = ({
  children,
  repository = defaultWorkoutRepository,
}: WorkoutProviderProps) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setWorkouts(await repository.getAll());
      } catch (error) {
        AppLogger.error({
          scope: logScope,
          action: 'load',
          message: 'Failed to load workouts from repository. Falling back to empty state.',
          details: error,
        });
        setWorkouts([]);
      }
    };
    load();
  }, [repository]);

  const persist = async (nextWorkouts: Workout[]) => {
    await repository.saveAll(nextWorkouts);
    setWorkouts(nextWorkouts);
  };

  const addWorkout = async (workout: Workout) => {
    try {
      await persist(workoutService.addWorkout(workouts, workout));
      AppLogger.info({
        scope: logScope,
        action: 'addWorkout',
        message: `Workout ${workout.id} added successfully.`,
      });
    } catch (error) {
      AppLogger.error({
        scope: logScope,
        action: 'addWorkout',
        message: 'Failed to add workout.',
        details: error,
      });
    }
  };

  const addExercise = async (workoutId: string, exercise: Exercise) => {
    try {
      await persist(workoutService.addExercise(workouts, workoutId, exercise));
      AppLogger.info({
        scope: logScope,
        action: 'addExercise',
        message: `Exercise ${exercise.id} added to workout ${workoutId}.`,
      });
    } catch (error) {
      AppLogger.error({
        scope: logScope,
        action: 'addExercise',
        message: 'Failed to add exercise to workout.',
        details: error,
      });
    }
  };

  const updateWorkout = async (updatedWorkout: Workout) => {
    try {
      await persist(workoutService.updateWorkout(workouts, updatedWorkout));
      AppLogger.info({
        scope: logScope,
        action: 'updateWorkout',
        message: `Workout ${updatedWorkout.id} updated successfully.`,
      });
    } catch (error) {
      AppLogger.error({
        scope: logScope,
        action: 'updateWorkout',
        message: 'Failed to update workout.',
        details: error,
      });
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    try {
      await persist(workoutService.deleteWorkout(workouts, workoutId));
      AppLogger.info({
        scope: logScope,
        action: 'deleteWorkout',
        message: `Workout ${workoutId} deleted successfully.`,
      });
    } catch (error) {
      AppLogger.error({
        scope: logScope,
        action: 'deleteWorkout',
        message: 'Failed to delete workout.',
        details: error,
      });
    }
  };

  const computeMetrics = () => workoutService.calculateMetrics(workouts);
  const getRecentWorkouts = (limit = 5) => workoutService.getRecentWorkouts(workouts, limit);
  const getSortedWorkouts = () => workoutService.sortByDate(workouts);

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        addWorkout,
        addExercise,
        updateWorkout,
        deleteWorkout,
        computeMetrics,
        getRecentWorkouts,
        getSortedWorkouts,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

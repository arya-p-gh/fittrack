import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workout, Exercise, PersonalBest, NutritionLog } from '../types';

interface WorkoutContextType {
  workouts: Workout[];
  personalBests: PersonalBest[];
  nutritionLogs: NutritionLog[];
  addWorkout: (workout: Workout) => void;
  addExercise: (workoutId: string, exercise: Exercise) => void;
  updatePersonalBest: (personalBest: PersonalBest) => void;
  addNutritionLog: (log: NutritionLog) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>([]);
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([]);

  useEffect(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    const savedPersonalBests = localStorage.getItem('personalBests');
    const savedNutritionLogs = localStorage.getItem('nutritionLogs');

    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
    if (savedPersonalBests) setPersonalBests(JSON.parse(savedPersonalBests));
    if (savedNutritionLogs) setNutritionLogs(JSON.parse(savedNutritionLogs));
  }, []);

  const addWorkout = (workout: Workout) => {
    const newWorkouts = [...workouts, workout];
    setWorkouts(newWorkouts);
    localStorage.setItem('workouts', JSON.stringify(newWorkouts));
  };

  const addExercise = (workoutId: string, exercise: Exercise) => {
    const newWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: [...workout.exercises, exercise]
        };
      }
      return workout;
    });
    setWorkouts(newWorkouts);
    localStorage.setItem('workouts', JSON.stringify(newWorkouts));
  };

  const updatePersonalBest = (personalBest: PersonalBest) => {
    const newPersonalBests = [...personalBests];
    const existingIndex = newPersonalBests.findIndex(
      pb => pb.exerciseName === personalBest.exerciseName
    );

    if (existingIndex >= 0) {
      newPersonalBests[existingIndex] = personalBest;
    } else {
      newPersonalBests.push(personalBest);
    }

    setPersonalBests(newPersonalBests);
    localStorage.setItem('personalBests', JSON.stringify(newPersonalBests));
  };

  const addNutritionLog = (log: NutritionLog) => {
    const newNutritionLogs = [...nutritionLogs, log];
    setNutritionLogs(newNutritionLogs);
    localStorage.setItem('nutritionLogs', JSON.stringify(newNutritionLogs));
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        personalBests,
        nutritionLogs,
        addWorkout,
        addExercise,
        updatePersonalBest,
        addNutritionLog,
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
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PersonalBest } from '../../domain/entities';
import { PersonalBestMetrics, PersonalBestService } from './PersonalBestService';
import { PersonalBestRepository } from '../interfaces/PersonalBestRepository';
import { LocalStoragePersonalBestRepository } from '../../infrastructure/repositories/LocalStoragePersonalBestRepository';
import { AppLogger } from '../common/AppLogger';

interface PersonalBestContextType {
  personalBests: PersonalBest[];
  addPersonalBest: (personalBest: PersonalBest) => void;
  updatePersonalBest: (personalBest: PersonalBest) => void;
  deletePersonalBest: (exerciseName: string) => void;
  computeMetrics: () => PersonalBestMetrics;
  getRankedPersonalBests: () => PersonalBest[];
}

interface PersonalBestProviderProps {
  children: ReactNode;
  repository?: PersonalBestRepository;
}

const PersonalBestContext = createContext<PersonalBestContextType | undefined>(undefined);
const personalBestService = new PersonalBestService();
const defaultPersonalBestRepository: PersonalBestRepository =
  new LocalStoragePersonalBestRepository();
const logScope = 'PersonalBestContext';

export const PersonalBestProvider = ({
  children,
  repository = defaultPersonalBestRepository,
}: PersonalBestProviderProps) => {
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>([]);

  useEffect(() => {
    try {
      setPersonalBests(repository.getAll());
    } catch (error) {
      AppLogger.error({
        scope: logScope,
        action: 'load',
        message: 'Failed to load personal bests from repository. Falling back to empty state.',
        details: error,
      });
      setPersonalBests([]);
    }
  }, [repository]);

  const persist = (nextPersonalBests: PersonalBest[]) => {
    repository.saveAll(nextPersonalBests);
    setPersonalBests(nextPersonalBests);
  };

  const addPersonalBest = (personalBest: PersonalBest) => {
    try {
      persist(personalBestService.addPersonalBest(personalBests, personalBest));
      AppLogger.info({
        scope: logScope,
        action: 'addPersonalBest',
        message: `Personal best for ${personalBest.exerciseName} saved successfully.`,
      });
    } catch (error) {
      AppLogger.error({
        scope: logScope,
        action: 'addPersonalBest',
        message: 'Failed to add personal best.',
        details: error,
      });
    }
  };

  const updatePersonalBest = (personalBest: PersonalBest) => {
    try {
      persist(personalBestService.updatePersonalBest(personalBests, personalBest));
      AppLogger.info({
        scope: logScope,
        action: 'updatePersonalBest',
        message: `Personal best for ${personalBest.exerciseName} updated successfully.`,
      });
    } catch (error) {
      AppLogger.error({
        scope: logScope,
        action: 'updatePersonalBest',
        message: 'Failed to update personal best.',
        details: error,
      });
    }
  };

  const deletePersonalBest = (exerciseName: string) => {
    try {
      persist(personalBestService.deletePersonalBest(personalBests, exerciseName));
      AppLogger.info({
        scope: logScope,
        action: 'deletePersonalBest',
        message: `Personal best for ${exerciseName} deleted successfully.`,
      });
    } catch (error) {
      AppLogger.error({
        scope: logScope,
        action: 'deletePersonalBest',
        message: 'Failed to delete personal best.',
        details: error,
      });
    }
  };

  const computeMetrics = () => personalBestService.calculateMetrics(personalBests);
  const getRankedPersonalBests = () => personalBestService.sortByWeightDesc(personalBests);

  return (
    <PersonalBestContext.Provider
      value={{
        personalBests,
        addPersonalBest,
        updatePersonalBest,
        deletePersonalBest,
        computeMetrics,
        getRankedPersonalBests,
      }}
    >
      {children}
    </PersonalBestContext.Provider>
  );
};

export const usePersonalBest = () => {
  const context = useContext(PersonalBestContext);
  if (context === undefined) {
    throw new Error('usePersonalBest must be used within a PersonalBestProvider');
  }
  return context;
};

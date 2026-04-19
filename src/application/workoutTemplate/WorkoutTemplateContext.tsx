import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { WorkoutTemplate, ExerciseTemplate } from '../../domain/entities';
import { WorkoutTemplateService } from './WorkoutTemplateService';
import { WorkoutTemplateRepository } from '../interfaces/WorkoutTemplateRepository';
import { ApiWorkoutTemplateRepository } from '../../infrastructure/repositories/ApiWorkoutTemplateRepository';
import { AppLogger } from '../common/AppLogger';

interface WorkoutTemplateContextType {
  templates: WorkoutTemplate[];
  addTemplate: (name: string, exercises: ExerciseTemplate[]) => Promise<void>;
  updateTemplate: (template: WorkoutTemplate) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
}

interface WorkoutTemplateProviderProps {
  children: ReactNode;
  repository?: WorkoutTemplateRepository;
}

const WorkoutTemplateContext = createContext<WorkoutTemplateContextType | undefined>(undefined);
const templateService = new WorkoutTemplateService();
const defaultRepository: WorkoutTemplateRepository = new ApiWorkoutTemplateRepository();
const logScope = 'WorkoutTemplateContext';

export const WorkoutTemplateProvider = ({
  children,
  repository = defaultRepository,
}: WorkoutTemplateProviderProps) => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await repository.getAll();
        setTemplates(data);
      } catch (error) {
        AppLogger.error({
          scope: logScope,
          action: 'load',
          message: 'Failed to load templates from database. Is the backend server running?',
          details: error,
        });
        setTemplates([]);
      }
    };
    load();
  }, [repository]);

  const persist = async (nextTemplates: WorkoutTemplate[]) => {
    await repository.saveAll(nextTemplates);
    setTemplates(nextTemplates);
  };

  const addTemplate = async (name: string, exercises: ExerciseTemplate[]) => {
    try {
      await persist(templateService.addTemplate(templates, name, exercises));
      AppLogger.info({ scope: logScope, action: 'addTemplate', message: 'Template saved to database.' });
    } catch (error) {
      AppLogger.error({ scope: logScope, action: 'addTemplate', message: 'Failed to save template to database.', details: error });
      throw error;
    }
  };

  const updateTemplate = async (template: WorkoutTemplate) => {
    try {
      await persist(templateService.updateTemplate(templates, template));
      AppLogger.info({ scope: logScope, action: 'updateTemplate', message: 'Template updated in database.' });
    } catch (error) {
      AppLogger.error({ scope: logScope, action: 'updateTemplate', message: 'Failed to update template in database.', details: error });
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await persist(templateService.deleteTemplate(templates, id));
      AppLogger.info({ scope: logScope, action: 'deleteTemplate', message: 'Template deleted from database.' });
    } catch (error) {
      AppLogger.error({ scope: logScope, action: 'deleteTemplate', message: 'Failed to delete template from database.', details: error });
      throw error;
    }
  };

  return (
    <WorkoutTemplateContext.Provider value={{ templates, addTemplate, updateTemplate, deleteTemplate }}>
      {children}
    </WorkoutTemplateContext.Provider>
  );
};

export const useWorkoutTemplate = () => {
  const context = useContext(WorkoutTemplateContext);
  if (context === undefined) {
    throw new Error('useWorkoutTemplate must be used within WorkoutTemplateProvider');
  }
  return context;
};

import { WorkoutTemplate, ExerciseTemplate } from '../../domain/entities';
import { v4 as uuidv4 } from 'uuid';

export class WorkoutTemplateService {
  addTemplate(templates: WorkoutTemplate[], name: string, exercises: ExerciseTemplate[]): WorkoutTemplate[] {
    this.ensureTemplateCollection(templates);
    if (!name.trim()) {
      throw new Error('[WorkoutTemplateService] Template name is required.');
    }
    if (!Array.isArray(exercises) || exercises.length === 0) {
      throw new Error('[WorkoutTemplateService] Template must have at least one exercise.');
    }

    const newTemplate: WorkoutTemplate = {
      id: uuidv4(),
      name: name.trim(),
      exercises: [...exercises],
    };

    return [...templates, newTemplate];
  }

  updateTemplate(templates: WorkoutTemplate[], updatedTemplate: WorkoutTemplate): WorkoutTemplate[] {
    this.ensureTemplateCollection(templates);
    const exists = templates.some(t => t.id === updatedTemplate.id);
    if (!exists) {
      throw new Error(`[WorkoutTemplateService] Template with id ${updatedTemplate.id} not found.`);
    }

    return templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t);
  }

  deleteTemplate(templates: WorkoutTemplate[], id: string): WorkoutTemplate[] {
    this.ensureTemplateCollection(templates);
    return templates.filter(t => t.id !== id);
  }

  private ensureTemplateCollection(templates: WorkoutTemplate[]): void {
    if (!Array.isArray(templates)) {
      throw new Error('[WorkoutTemplateService] templates must be an array.');
    }
  }
}

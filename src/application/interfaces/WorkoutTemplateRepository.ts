import { WorkoutTemplate } from '../../domain/entities';

export interface WorkoutTemplateRepository {
  getAll(): Promise<WorkoutTemplate[]>;
  saveAll(templates: WorkoutTemplate[]): Promise<void>;
}

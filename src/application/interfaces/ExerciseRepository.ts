import { ExerciseDefinition } from '../../domain/entities';

export interface ExerciseRepository {
  getAll(): Promise<ExerciseDefinition[]>;
}

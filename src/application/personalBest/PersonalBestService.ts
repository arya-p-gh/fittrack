import { PersonalBest } from '../../domain/entities';

export interface PersonalBestMetrics {
  totalPersonalBests: number;
}

export class PersonalBestService {
  addPersonalBest(personalBests: PersonalBest[], personalBest: PersonalBest): PersonalBest[] {
    this.ensurePersonalBestCollection(personalBests);
    this.ensureValidPersonalBest(personalBest);

    return this.upsertPersonalBest(personalBests, personalBest);
  }

  updatePersonalBest(personalBests: PersonalBest[], personalBest: PersonalBest): PersonalBest[] {
    this.ensurePersonalBestCollection(personalBests);
    this.ensureValidPersonalBest(personalBest);

    return this.upsertPersonalBest(personalBests, personalBest);
  }

  deletePersonalBest(personalBests: PersonalBest[], exerciseName: string): PersonalBest[] {
    this.ensurePersonalBestCollection(personalBests);

    const normalizedName = exerciseName.trim().toLowerCase();
    if (!normalizedName) {
      throw new Error('[PersonalBestService] exerciseName is required.');
    }

    const exists = personalBests.some(
      (pb) => pb.exerciseName.trim().toLowerCase() === normalizedName
    );
    if (!exists) {
      throw new Error(`[PersonalBestService] Personal best for ${exerciseName} was not found.`);
    }

    return personalBests.filter(
      (pb) => pb.exerciseName.trim().toLowerCase() !== normalizedName
    );
  }

  calculateMetrics(personalBests: PersonalBest[]): PersonalBestMetrics {
    this.ensurePersonalBestCollection(personalBests);
    return {
      totalPersonalBests: personalBests.length,
    };
  }

  sortByWeightDesc(personalBests: PersonalBest[]): PersonalBest[] {
    this.ensurePersonalBestCollection(personalBests);
    return [...personalBests].sort((a, b) => b.weight - a.weight);
  }

  private ensurePersonalBestCollection(personalBests: PersonalBest[]): void {
    if (!Array.isArray(personalBests)) {
      throw new Error('[PersonalBestService] personalBests must be an array.');
    }
  }

  private ensureValidPersonalBest(personalBest: PersonalBest): void {
    if (!this.isValidPersonalBest(personalBest)) {
      throw new Error('[PersonalBestService] Invalid personal best data.');
    }
  }

  private upsertPersonalBest(personalBests: PersonalBest[], personalBest: PersonalBest): PersonalBest[] {
    const nextPersonalBests = [...personalBests];
    const existingIndex = nextPersonalBests.findIndex(
      (pb) => pb.exerciseName.toLowerCase() === personalBest.exerciseName.toLowerCase()
    );

    if (existingIndex >= 0) {
      nextPersonalBests[existingIndex] = personalBest;
    } else {
      nextPersonalBests.push(personalBest);
    }

    return nextPersonalBests;
  }

  private isValidPersonalBest(personalBest: PersonalBest): boolean {
    return (
      Boolean(personalBest.exerciseName?.trim()) &&
      personalBest.weight >= 0 &&
      Boolean(personalBest.date)
    );
  }
}

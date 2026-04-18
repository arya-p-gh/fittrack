import { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WorkoutProvider, useWorkout } from '../../src/application/workout/WorkoutContext';
import { WorkoutRepository } from '../../src/application/interfaces/WorkoutRepository';
import { buildWorkout } from '../testData';

describe('Add Workout integration flow', () => {
  it('calls context action -> service logic -> repository save -> state update', async () => {
    const repository: WorkoutRepository = {
      getAll: vi.fn().mockReturnValue([]),
      saveAll: vi.fn(),
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <WorkoutProvider repository={repository}>{children}</WorkoutProvider>
    );

    const { result } = renderHook(() => useWorkout(), { wrapper });

    await act(async () => {
      result.current.addWorkout(buildWorkout({ id: 'integration-workout-1' }));
    });

    expect(repository.saveAll).toHaveBeenCalledTimes(1);
    expect(repository.saveAll).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'integration-workout-1' }),
      ])
    );
    expect(result.current.workouts).toHaveLength(1);
    expect(result.current.workouts[0].id).toBe('integration-workout-1');
  });
});

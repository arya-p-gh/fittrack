import { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { exerciseCategories } from '../data/exercises';
import { Exercise } from '../types';
import './WorkoutLog.css';

interface ExerciseFormData {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

const WorkoutLog = () => {
  const { workouts, addWorkout } = useWorkout();
  const [exercises, setExercises] = useState<ExerciseFormData[]>([
    { name: '', sets: 3, reps: 10, weight: 0 },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 10, weight: 0 }]);
  };

  const handleRemoveExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleExerciseChange = (
    index: number,
    field: keyof ExerciseFormData,
    value: string | number
  ) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);

    if (field === 'name') {
      const inputValue = value.toString().toLowerCase();
      if (inputValue.length > 0) {
        const filteredSuggestions = exerciseCategories
          .flatMap(category => category.exercises)
          .filter(exercise => 
            exercise.toLowerCase().includes(inputValue)
          );
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionClick = (index: number, suggestion: string) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], name: suggestion };
    setExercises(newExercises);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const workout = {
      id: uuidv4(),
      date: new Date().toISOString(),
      exercises: exercises.map((exercise) => ({
        ...exercise,
        id: uuidv4(),
        date: new Date().toISOString(),
      })) as Exercise[],
    };
    addWorkout(workout);
    setExercises([{ name: '', sets: 3, reps: 10, weight: 0 }]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.exercise-suggestions')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="workout-log-page">
      <h1 className="page-title">Workout Log</h1>

      <div className="workout-form-container">
        <form onSubmit={handleSubmit} className="workout-form">
          {exercises.map((exercise, index) => (
            <div key={index} className="exercise-form-row">
              <div className="form-group">
                <label htmlFor={`exercise-name-${index}`}>Exercise</label>
                <div className="input-with-suggestions">
                  <input
                    id={`exercise-name-${index}`}
                    type="text"
                    value={exercise.name}
                    onChange={(e) =>
                      handleExerciseChange(index, 'name', e.target.value)
                    }
                    placeholder="Exercise name"
                    className="form-input"
                    autoComplete="off"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="exercise-suggestions">
                      {suggestions.map((suggestion, i) => (
                        <div
                          key={i}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(index, suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor={`exercise-sets-${index}`}>Sets</label>
                <input
                  id={`exercise-sets-${index}`}
                  type="number"
                  value={exercise.sets}
                  onChange={(e) =>
                    handleExerciseChange(index, 'sets', parseInt(e.target.value) || 0)
                  }
                  min={1}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor={`exercise-reps-${index}`}>Reps</label>
                <input
                  id={`exercise-reps-${index}`}
                  type="number"
                  value={exercise.reps}
                  onChange={(e) =>
                    handleExerciseChange(index, 'reps', parseInt(e.target.value) || 0)
                  }
                  min={1}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor={`exercise-weight-${index}`}>Weight (kg)</label>
                <input
                  id={`exercise-weight-${index}`}
                  type="number"
                  value={exercise.weight}
                  onChange={(e) =>
                    handleExerciseChange(index, 'weight', parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  step={0.5}
                  className="form-input"
                />
              </div>
              {exercises.length > 1 && (
                <button
                  type="button"
                  className="button button-icon"
                  onClick={() => handleRemoveExercise(index)}
                  aria-label="Remove exercise"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}

          <div className="form-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={handleAddExercise}
            >
              ➕ Add Exercise
            </button>
            <button type="submit" className="button button-primary">
              Log Workout
            </button>
          </div>
        </form>
      </div>

      <div className="workout-history">
        <h2 className="section-title">Workout History</h2>
        {workouts.length > 0 ? (
          <div className="table-container">
            <table className="workout-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Exercises</th>
                </tr>
              </thead>
              <tbody>
                {workouts
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((workout) => (
                    <tr key={workout.id}>
                      <td>{format(new Date(workout.date), 'MMM d, yyyy')}</td>
                      <td>
                        <ul className="exercise-list">
                          {workout.exercises.map((exercise) => (
                            <li key={exercise.id}>
                              {exercise.name}: {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}kg
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">No workouts logged yet.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutLog; 
import { useState, useEffect } from 'react';
import { useWorkout } from '../../application/workout/WorkoutContext';
import { useWorkoutTemplate } from '../../application/workoutTemplate/WorkoutTemplateContext';
import { useExercise } from '../../application/exercise/ExerciseContext';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Exercise } from '../../domain/entities';
import './WorkoutLog.css';

interface ExerciseFormData {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

const WorkoutLog = () => {
  const { workouts, addWorkout, getSortedWorkouts } = useWorkout();
  const { templates, addTemplate } = useWorkoutTemplate();
  const { exercises: exerciseDefs, loading } = useExercise();
  
  const [exercises, setExercises] = useState<ExerciseFormData[]>([
    { name: '', sets: 3, reps: 10, weight: 0 },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState({ active: false, index: -1 });
  const [templateName, setTemplateName] = useState('');
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const sortedWorkouts = getSortedWorkouts();

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
      if (inputValue.length > 0 && !loading) {
        const filteredSuggestions = exerciseDefs
          .map(e => e.name)
          .filter(name => name.toLowerCase().includes(inputValue));
        setSuggestions(filteredSuggestions);
        setShowSuggestions({ active: true, index });
      } else {
        setSuggestions([]);
        setShowSuggestions({ active: false, index: -1 });
      }
    }
  };

  const handleSuggestionClick = (index: number, suggestion: string) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], name: suggestion };
    setExercises(newExercises);
    setShowSuggestions({ active: false, index: -1 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSavingTemplate) {
      if (!templateName.trim()) {
        alert('Please enter a routine name.');
        return;
      }
      try {
        await addTemplate(templateName, exercises);
        const savedName = templateName;
        setIsSavingTemplate(false);
        setTemplateName('');
        alert(`Routine "${savedName}" saved to database successfully!`);
      } catch {
        alert('❌ Failed to save routine. Make sure the backend server is running.');
      }
      return;
    }

    const workout = {
      id: uuidv4(),
      date: new Date().toISOString(),
      exercises: exercises.map((exercise) => ({
        ...exercise,
        id: uuidv4(),
        date: new Date().toISOString(),
      })) as Exercise[],
    };
    await addWorkout(workout);
    setExercises([{ name: '', sets: 3, reps: 10, weight: 0 }]);
  };

  const loadTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    if (!templateId) return;

    const template = templates.find(t => t.id === templateId);
    if (template) {
      setExercises(template.exercises.map(ex => ({ ...ex })));
    }
    e.target.value = '';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.exercise-suggestions')) {
        setShowSuggestions({ active: false, index: -1 });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="workout-log-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Workout Log</h1>
        {templates.length > 0 && (
          <select onChange={loadTemplate} className="form-input" style={{ width: '200px' }}>
            <option value="">Load Routine...</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        )}
      </div>

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
                  {showSuggestions.active && showSuggestions.index === index && suggestions.length > 0 && (
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

          {isSavingTemplate && (
            <div className="form-group" style={{ marginTop: '16px', maxWidth: '300px' }}>
              <label htmlFor="template-name">Routine Name</label>
              <input
                id="template-name"
                type="text"
                className="form-input"
                placeholder="e.g. Push Day"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
          )}

          <div className="form-actions" style={{ marginTop: '20px' }}>
            <button
              type="button"
              className="button button-secondary"
              onClick={handleAddExercise}
            >
              ➕ Add Exercise
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!isSavingTemplate ? (
                <button 
                  type="button" 
                  className="button button-secondary"
                  onClick={() => setIsSavingTemplate(true)}
                >
                  Save Routine
                </button>
              ) : (
                <button 
                  type="button" 
                  className="button button-secondary"
                  onClick={() => {
                    setIsSavingTemplate(false);
                    setTemplateName('');
                  }}
                >
                  Cancel Saving
                </button>
              )}
              <button 
                type="submit" 
                className="button button-primary"
                onClick={() => {
                  if(!isSavingTemplate) setIsSavingTemplate(false);
                }}
              >
                {isSavingTemplate ? 'Save Routine' : 'Log Workout'}
              </button>
            </div>
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
                {sortedWorkouts.map((workout) => (
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
import { useState } from 'react';
import { useExercise } from '../../application/exercise/ExerciseContext';
import './ExerciseLibrary.css';

const ExerciseLibrary = () => {
  const { exercises, loading } = useExercise();
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('All');
  const [equipment, setEquipment] = useState('All');

  if (loading) {
    return <div className="exercise-library-page"><p>Loading library...</p></div>;
  }

  // Derive unique categories for dropdowns
  const uniqueMuscleGroups = ['All', ...new Set(exercises.map(e => e.muscleGroup))];
  const uniqueEquipment = ['All', ...new Set(exercises.map(e => e.equipment))];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = muscleGroup === 'All' || exercise.muscleGroup === muscleGroup;
    const matchesEquipment = equipment === 'All' || exercise.equipment === equipment;
    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  return (
    <div className="exercise-library-page">
      <h1 className="page-title">Exercise Library</h1>

      <div className="library-filters">
        <div className="form-group">
          <label htmlFor="search-exercise">Search</label>
          <input
            id="search-exercise"
            type="text"
            className="form-input"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="filter-muscle">Muscle Group</label>
          <select
            id="filter-muscle"
            className="form-input"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
          >
            {uniqueMuscleGroups.map(mg => (
              <option key={mg} value={mg}>{mg}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="filter-equipment">Equipment</label>
          <select
            id="filter-equipment"
            className="form-input"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
          >
            {uniqueEquipment.map(eq => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="exercise-grid">
        {filteredExercises.length > 0 ? (
          filteredExercises.map(exercise => (
            <div key={exercise.id} className="exercise-card">
              <h3>{exercise.name}</h3>
              <div className="exercise-badges">
                <span className="badge badge-muscle">{exercise.muscleGroup}</span>
                <span className="badge badge-equipment">{exercise.equipment}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">No exercises found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;

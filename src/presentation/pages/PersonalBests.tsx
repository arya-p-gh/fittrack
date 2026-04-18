import { useState } from 'react';
import { usePersonalBest } from '../../application/personalBest/PersonalBestContext';
import { format } from 'date-fns';
import './PersonalBests.css';

const PersonalBests = () => {
  const { updatePersonalBest, getRankedPersonalBests } = usePersonalBest();
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const rankedPersonalBests = getRankedPersonalBests();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName || !weight) return;

    const newPersonalBest = {
      exerciseName,
      weight: parseFloat(weight),
      date: new Date().toISOString(),
    };

    updatePersonalBest(newPersonalBest);
    setExerciseName('');
    setWeight('');
  };

  return (
    <div className="personal-bests-page">
      <h1 className="page-title">Personal Bests</h1>

      <div className="personal-bests-container">
        <div className="personal-bests-form-container">
          <h2 className="section-title">Add New Personal Best</h2>
          <form onSubmit={handleSubmit} className="personal-bests-form">
            <div className="form-group">
              <label htmlFor="exercise-name">Exercise Name</label>
              <input
                id="exercise-name"
                type="text"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="e.g., Bench Press"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 100"
                min="0"
                step="0.5"
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="button button-primary">
              Add Personal Best
            </button>
          </form>
        </div>

        <div className="personal-bests-list-container">
          <h2 className="section-title">Your Personal Bests</h2>
          {rankedPersonalBests.length > 0 ? (
            <div className="table-container">
              <table className="personal-bests-table">
                <thead>
                  <tr>
                    <th>Exercise</th>
                    <th>Weight (kg)</th>
                    <th>Date Achieved</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedPersonalBests.map((pb) => (
                      <tr key={`${pb.exerciseName}-${pb.date}`}>
                        <td>{pb.exerciseName}</td>
                        <td>{pb.weight}</td>
                        <td>{format(new Date(pb.date), 'MMM d, yyyy')}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-state">No personal bests recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalBests; 
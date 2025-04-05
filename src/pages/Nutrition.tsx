import { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import './Nutrition.css';

const Nutrition = () => {
  const { nutritionLogs, addNutritionLog } = useWorkout();
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calories || !protein || !carbs || !fats) return;

    const newNutritionLog = {
      id: uuidv4(),
      date: new Date().toISOString(),
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fats: parseFloat(fats),
    };

    addNutritionLog(newNutritionLog);
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
  };

  const calculateTotalCalories = () => {
    return nutritionLogs.reduce((total, log) => total + log.calories, 0);
  };

  const calculateAverageCalories = () => {
    if (nutritionLogs.length === 0) return 0;
    return Math.round(calculateTotalCalories() / nutritionLogs.length);
  };

  return (
    <div className="nutrition-page">
      <h1 className="page-title">Nutrition Tracking</h1>

      <div className="nutrition-container">
        <div className="nutrition-form-container">
          <h2 className="section-title">Log Daily Nutrition</h2>
          <form onSubmit={handleSubmit} className="nutrition-form">
            <div className="form-group">
              <label htmlFor="calories">Calories</label>
              <input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="e.g., 2000"
                min="0"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="protein">Protein (g)</label>
              <input
                id="protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="e.g., 150"
                min="0"
                step="0.1"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="carbs">Carbs (g)</label>
              <input
                id="carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="e.g., 250"
                min="0"
                step="0.1"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fats">Fats (g)</label>
              <input
                id="fats"
                type="number"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                placeholder="e.g., 70"
                min="0"
                step="0.1"
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="button button-primary">
              Log Nutrition
            </button>
          </form>
        </div>

        <div className="nutrition-stats-container">
          <h2 className="section-title">Nutrition Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-label">Total Calories</div>
              <div className="stat-number">{calculateTotalCalories()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-label">Average Daily Calories</div>
              <div className="stat-number">{calculateAverageCalories()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-label">Days Tracked</div>
              <div className="stat-number">{nutritionLogs.length}</div>
            </div>
          </div>
        </div>

        <div className="nutrition-history-container">
          <h2 className="section-title">Nutrition History</h2>
          {nutritionLogs.length > 0 ? (
            <div className="table-container">
              <table className="nutrition-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Calories</th>
                    <th>Protein (g)</th>
                    <th>Carbs (g)</th>
                    <th>Fats (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {nutritionLogs
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((log) => (
                      <tr key={log.id}>
                        <td>{format(new Date(log.date), 'MMM d, yyyy')}</td>
                        <td>{log.calories}</td>
                        <td>{log.protein}</td>
                        <td>{log.carbs}</td>
                        <td>{log.fats}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-state">No nutrition logs recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nutrition; 
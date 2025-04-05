import { useWorkout } from '../context/WorkoutContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { workouts, nutritionLogs, personalBests } = useWorkout();

  const recentWorkouts = workouts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce(
    (acc, workout) => acc + workout.exercises.length,
    0
  );
  const totalPersonalBests = personalBests.length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <Link to="/workouts" className="button button-primary">
          Log Workout
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💪</div>
          <div className="stat-label">Total Workouts</div>
          <div className="stat-number">{totalWorkouts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-label">Total Exercises</div>
          <div className="stat-number">{totalExercises}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-label">Personal Bests</div>
          <div className="stat-number">{totalPersonalBests}</div>
        </div>
      </div>

      <div className="recent-workouts">
        <h2 className="section-title">Recent Workouts</h2>
        {recentWorkouts.length > 0 ? (
          <div className="workout-list">
            {recentWorkouts.map((workout) => (
              <div key={workout.id} className="workout-card">
                <div className="workout-date">
                  {format(new Date(workout.date), 'MMM d, yyyy')}
                </div>
                <div className="workout-exercises">
                  {workout.exercises.map((exercise) => (
                    <div key={exercise.id} className="exercise-item">
                      {exercise.name}: {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}kg
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No workouts logged yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 
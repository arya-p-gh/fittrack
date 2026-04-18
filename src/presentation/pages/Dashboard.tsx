import { useWorkout } from '../../application/workout/WorkoutContext';
import { usePersonalBest } from '../../application/personalBest/PersonalBestContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { getRecentWorkouts, computeMetrics: computeWorkoutMetrics } = useWorkout();
  const { computeMetrics: computePersonalBestMetrics } = usePersonalBest();

  const recentWorkouts = getRecentWorkouts(5);

  const workoutMetrics = computeWorkoutMetrics();
  const personalBestMetrics = computePersonalBestMetrics();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <Link to="/workout" className="button button-primary">
          Log Workout
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💪</div>
          <div className="stat-label">Total Workouts</div>
          <div className="stat-number">{workoutMetrics.totalWorkouts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-label">Total Exercises</div>
          <div className="stat-number">{workoutMetrics.totalExercises}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-label">Personal Bests</div>
          <div className="stat-number">{personalBestMetrics.totalPersonalBests}</div>
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
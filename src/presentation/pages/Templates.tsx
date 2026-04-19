import { useWorkoutTemplate } from '../../application/workoutTemplate/WorkoutTemplateContext';
import './Templates.css';
import { useNavigate } from 'react-router-dom';

const Templates = () => {
  const { templates, deleteTemplate } = useWorkoutTemplate();
  const navigate = useNavigate();

  return (
    <div className="templates-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Workout Templates</h1>
        <button 
          className="button button-primary" 
          onClick={() => navigate('/workout')}
        >
          Create New Routine
        </button>
      </div>

      <div className="templates-grid">
        {templates.length > 0 ? (
          templates.map((template) => (
            <div key={template.id} className="template-card">
              <h3>{template.name}</h3>
              <ul className="template-exercises">
                {template.exercises.map((ex, i) => (
                  <li key={i}>
                    {ex.name} — {ex.sets}x{ex.reps} @ {ex.weight}kg
                  </li>
                ))}
              </ul>
              <div className="template-actions">
                <button
                  className="button button-icon"
                  style={{ color: 'var(--danger-color)' }}
                  onClick={() => deleteTemplate(template.id)}
                  title="Delete Template"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">No templates saved yet. Create a routine in the Workout Log and save it!</p>
        )}
      </div>
    </div>
  );
};

export default Templates;

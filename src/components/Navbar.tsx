import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <RouterLink to="/" className="navbar-brand">
            FitTrack
          </RouterLink>
          <div className="navbar-links">
            <RouterLink 
              to="/" 
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            >
              Dashboard
            </RouterLink>
            <RouterLink 
              to="/workout" 
              className={`navbar-link ${isActive('/workout') ? 'active' : ''}`}
            >
              Workouts
            </RouterLink>
            <RouterLink 
              to="/nutrition" 
              className={`navbar-link ${isActive('/nutrition') ? 'active' : ''}`}
            >
              Nutrition
            </RouterLink>
            <RouterLink 
              to="/personal-bests" 
              className={`navbar-link ${isActive('/personal-bests') ? 'active' : ''}`}
            >
              Personal Bests
            </RouterLink>
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
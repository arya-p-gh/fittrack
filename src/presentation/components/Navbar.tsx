import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../providers/ThemeContext';
import { useAuth } from '../../application/auth/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <RouterLink to="/" className="navbar-brand">
            FitTrack
          </RouterLink>
          <div className="navbar-links">
            <RouterLink to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>Dashboard</RouterLink>
            <RouterLink to="/workout" className={`navbar-link ${isActive('/workout') ? 'active' : ''}`}>Workouts</RouterLink>
            <RouterLink to="/templates" className={`navbar-link ${isActive('/templates') ? 'active' : ''}`}>Routines</RouterLink>
            <RouterLink to="/exercises" className={`navbar-link ${isActive('/exercises') ? 'active' : ''}`}>Library</RouterLink>
            <RouterLink to="/nutrition" className={`navbar-link ${isActive('/nutrition') ? 'active' : ''}`}>Nutrition</RouterLink>
            <RouterLink to="/personal-bests" className={`navbar-link ${isActive('/personal-bests') ? 'active' : ''}`}>Personal Bests</RouterLink>

            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {user && (
              <div className="navbar-user">
                <span className="navbar-user-email">{user.email}</span>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
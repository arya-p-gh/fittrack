import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WorkoutProvider } from '../../application/workout/WorkoutContext';
import { NutritionProvider } from '../../application/nutrition/NutritionContext';
import { PersonalBestProvider } from '../../application/personalBest/PersonalBestContext';
import { ThemeProvider } from '../providers/ThemeContext';
import { AuthProvider, useAuth } from '../../application/auth/AuthContext';
import { AuthPage } from '../pages/AuthPage';
import Navbar from '../components/Navbar';
import Dashboard from '../pages/Dashboard';
import WorkoutLog from '../pages/WorkoutLog';
import Nutrition from '../pages/Nutrition';
import PersonalBests from '../pages/PersonalBests';
import { ChatWindow } from '../components/ChatWindow';
import './App.css';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <AuthPage />;
}

function MainApp() {
  return (
    <WorkoutProvider>
      <NutritionProvider>
        <PersonalBestProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <div className="container">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/workout" element={<WorkoutLog />} />
                  <Route path="/nutrition" element={<Nutrition />} />
                  <Route path="/personal-bests" element={<PersonalBests />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
            <ChatWindow />
          </div>
        </PersonalBestProvider>
      </NutritionProvider>
    </WorkoutProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <PrivateRoute>
            <MainApp />
          </PrivateRoute>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

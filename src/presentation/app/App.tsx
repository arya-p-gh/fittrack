import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../application/auth/AuthContext';
import { WorkoutProvider } from '../../application/workout/WorkoutContext';
import { WorkoutTemplateProvider } from '../../application/workoutTemplate/WorkoutTemplateContext';
import { ExerciseProvider } from '../../application/exercise/ExerciseContext';
import { NutritionProvider } from '../../application/nutrition/NutritionContext';
import { PersonalBestProvider } from '../../application/personalBest/PersonalBestContext';
import { ThemeProvider } from '../providers/ThemeContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import Dashboard from '../pages/Dashboard';
import WorkoutLog from '../pages/WorkoutLog';
import Nutrition from '../pages/Nutrition';
import PersonalBests from '../pages/PersonalBests';
import ExerciseLibrary from '../pages/ExerciseLibrary';
import Templates from '../pages/Templates';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { ChatWindow } from '../components/ChatWindow';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes — wrapped in all data providers */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <ExerciseProvider>
                    <WorkoutTemplateProvider>
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
                                    <Route path="/templates" element={<Templates />} />
                                    <Route path="/exercises" element={<ExerciseLibrary />} />
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
                    </WorkoutTemplateProvider>
                  </ExerciseProvider>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

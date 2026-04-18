import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkoutProvider } from '../../application/workout/WorkoutContext';
import { NutritionProvider } from '../../application/nutrition/NutritionContext';
import { PersonalBestProvider } from '../../application/personalBest/PersonalBestContext';
import { ThemeProvider } from '../providers/ThemeContext';
import Navbar from '../components/Navbar';
import Dashboard from '../pages/Dashboard';
import WorkoutLog from '../pages/WorkoutLog';
import Nutrition from '../pages/Nutrition';
import PersonalBests from '../pages/PersonalBests';
import { ChatWindow } from '../components/ChatWindow';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <WorkoutProvider>
        <NutritionProvider>
          <PersonalBestProvider>
            <Router>
              <div className="app-container">
                <Navbar />
                <main className="main-content">
                  <div className="container">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/workout" element={<WorkoutLog />} />
                      <Route path="/nutrition" element={<Nutrition />} />
                      <Route path="/personal-bests" element={<PersonalBests />} />
                    </Routes>
                  </div>
                </main>
                <ChatWindow />
              </div>
            </Router>
          </PersonalBestProvider>
        </NutritionProvider>
      </WorkoutProvider>
    </ThemeProvider>
  );
}

export default App;

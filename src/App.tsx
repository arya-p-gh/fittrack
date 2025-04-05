import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import WorkoutLog from './pages/WorkoutLog';
import Nutrition from './pages/Nutrition';
import PersonalBests from './pages/PersonalBests';
import { ChatWindow } from './components/ChatWindow';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <WorkoutProvider>
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
      </WorkoutProvider>
    </ThemeProvider>
  );
}

export default App;

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import './App.css';
import Game from './components/Game';
import SettingsPage from './components/SettingsPage';
import { GameProvider } from './context/GameContext';

function useScrolledClass() {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => root.classList.toggle('scrolled', window.scrollY > 0);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
}

function App() {
  useScrolledClass();
  return (
    <GameProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <div className="App font-body">
          <div className="status-bar-shield" aria-hidden="true" />
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
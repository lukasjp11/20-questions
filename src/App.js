import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Game from './components/Game';
import SettingsPage from './components/SettingsPage';
import { GameProvider } from './context/GameContext';
import { loadFromLocalStorage } from './utils/gameLogic';

function App() {
  const [theme, setTheme] = useState(() => 
    loadFromLocalStorage('theme', 'dark')
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <GameProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Game theme={theme} setTheme={setTheme} />} />
            <Route path="/settings" element={<SettingsPage theme={theme} setTheme={setTheme} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
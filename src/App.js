import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Game from './components/Game';
import SettingsPage from './components/SettingsPage';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <GameProvider>
      <Router basename="/20-questions">
        <div className="App font-body">
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
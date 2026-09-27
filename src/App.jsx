import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import './App.css';
import Game from './components/Game';
import SettingsPage from './components/SettingsPage';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <GameProvider>
      <Router basename={import.meta.env.BASE_URL}>
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
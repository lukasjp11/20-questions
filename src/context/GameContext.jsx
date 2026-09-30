import { useCallback, useMemo, useState } from 'react';
import { loadFromLocalStorage, saveToLocalStorage, normalizeItem } from '../utils/gameLogic';
import { addToHistory } from '../game/scoring';
import { GameContext } from './useGame';
import { DEFAULT_CATEGORIES } from '../utils/categories';

const MAX_USED_ITEMS = 200;
const SETTINGS_VERSION = 5;

const SETTING_DEFAULTS = {
  mode: 'ladder',
  difficulty: 48,
  clueDifficulty: 55,
  customTheme: '',
  numberOfClues: 10,
  enableTimer: false,
  timePerClue: 30,
  numberOfSpecialClues: 0,
  specialCluesConfig: [
    { text: 'Ryk 3 felter frem', weight: 3 },
    { text: 'Du har 2 gæt', weight: 2 },
    { text: 'Byt plads med forreste', weight: 1 },
  ],
  ageRangeMin: 18,
  ageRangeMax: 65,
  autoDifficulty: false,
  teamsEnabled: false,
  teamNames: ['Hold 1', 'Hold 2'],
  activeCategories: DEFAULT_CATEGORIES,
};

function loadSettings() {
  const settings = {};
  for (const [key, fallback] of Object.entries(SETTING_DEFAULTS)) {
    settings[key] = loadFromLocalStorage(key, fallback);
  }
  const version = loadFromLocalStorage('settingsVersion', 1);
  if (version < 2) {
    settings.mode = 'reader';
    saveToLocalStorage('mode', 'reader');
  }
  if (version < 3 && settings.difficulty === 55 && settings.clueDifficulty === 55 && settings.ageRangeMin === 18 && settings.ageRangeMax === 65) {
    settings.difficulty = 48;
    saveToLocalStorage('difficulty', 48);
  }
  if (version < 4) {
    settings.activeCategories = DEFAULT_CATEGORIES;
    saveToLocalStorage('activeCategories', DEFAULT_CATEGORIES);
  }
  if (version < 5 && settings.mode === 'reader') {
    settings.mode = 'ladder';
    saveToLocalStorage('mode', 'ladder');
  }
  if (version < SETTINGS_VERSION) saveToLocalStorage('settingsVersion', SETTINGS_VERSION);
  return settings;
}

export const GameProvider = ({ children }) => {
  const [settings, setSettings] = useState(loadSettings);
  const [usedItems, setUsedItems] = useState(() => loadFromLocalStorage('usedItems', []));
  const [history, setHistory] = useState(() => loadFromLocalStorage('history', []));
  const [teamScores, setTeamScores] = useState(() => loadFromLocalStorage('teamScores', []));

  const updateSetting = useCallback((key, value) => {
    if (!Object.hasOwn(SETTING_DEFAULTS, key)) return;
    saveToLocalStorage(key, value);
    setSettings(prev => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  const resetUsedItems = useCallback(() => {
    setUsedItems([]);
    localStorage.removeItem('usedItems');
  }, []);

  const addUsedItem = useCallback((category, item) => {
    setUsedItems(prev => {
      const normalized = normalizeItem(item);
      if (prev.some(u => u.category === category && normalizeItem(u.item) === normalized)) return prev;
      const updated = [...prev, { category, item }].slice(-MAX_USED_ITEMS);
      saveToLocalStorage('usedItems', updated);
      return updated;
    });
  }, []);

  const recordResult = useCallback((result, category, item) => {
    setHistory(prev => {
      const updated = addToHistory(prev, result, category, item);
      saveToLocalStorage('history', updated);
      return updated;
    });
  }, []);

  const addTeamPoints = useCallback((team, points) => {
    setTeamScores(prev => {
      const updated = [...prev];
      while (updated.length <= team) updated.push(0);
      updated[team] += points;
      saveToLocalStorage('teamScores', updated);
      return updated;
    });
  }, []);

  const resetTeamScores = useCallback(() => {
    setTeamScores([]);
    localStorage.removeItem('teamScores');
  }, []);

  const resetAllData = useCallback(() => {
    localStorage.clear();
    window.location.href = import.meta.env.BASE_URL;
  }, []);

  const value = useMemo(() => ({
    ...settings,
    settings,
    updateSetting,
    usedItems,
    addUsedItem,
    resetUsedItems,
    history,
    recordResult,
    teamScores,
    addTeamPoints,
    resetTeamScores,
    resetAllData,
  }), [settings, updateSetting, usedItems, addUsedItem, resetUsedItems, history, recordResult,
    teamScores, addTeamPoints, resetTeamScores, resetAllData]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

import React, { createContext, useContext, useState, useCallback } from 'react';
import { loadFromLocalStorage, saveToLocalStorage, normalizeItem } from '../utils/gameLogic';
import { defaultCategories } from '../utils/prompts';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

const defaultSpecialCluesConfig = [
  { text: "Ryk 3 felter frem", weight: 3 },
  { text: "Du har 2 gæt", weight: 2 },
  { text: "Byt plads med forreste", weight: 1 }
];

export const GameProvider = ({ children }) => {
  const [difficulty, setDifficulty] = useState(() => 
    loadFromLocalStorage('difficulty', 50)
  );
  const [clueDifficulty, setClueDifficulty] = useState(() => 
    loadFromLocalStorage('clueDifficulty', 50)
  );
  const [customTheme, setCustomTheme] = useState(() =>
    loadFromLocalStorage('customTheme', '')
  );
  const [hideAnswerOnGeneration, setHideAnswerOnGeneration] = useState(() =>
    loadFromLocalStorage('hideAnswerOnGeneration', false)
  );
  const [numberOfClues, setNumberOfClues] = useState(() =>
    loadFromLocalStorage('numberOfClues', 20)
  );
  const [enableTimer, setEnableTimer] = useState(() =>
    loadFromLocalStorage('enableTimer', false)
  );
  const [timePerClue, setTimePerClue] = useState(() =>
    loadFromLocalStorage('timePerClue', 30)
  );
  const [categories, setCategories] = useState(() =>
    loadFromLocalStorage('customCategories', defaultCategories)
  );
  const [numberOfSpecialClues, setNumberOfSpecialClues] = useState(() =>
    loadFromLocalStorage('numberOfSpecialClues', 3)
  );
  const [specialCluesConfig, setSpecialCluesConfig] = useState(() =>
    loadFromLocalStorage('specialCluesConfig', defaultSpecialCluesConfig)
  );
  const [ageRangeMin, setAgeRangeMin] = useState(() =>
    loadFromLocalStorage('ageRangeMin', 18)
  );
  const [ageRangeMax, setAgeRangeMax] = useState(() =>
    loadFromLocalStorage('ageRangeMax', 50)
  );
  const [usedItems, setUsedItems] = useState(() =>
    loadFromLocalStorage('usedItems', [])
  );
  const [currentGameState, setCurrentGameState] = useState(() =>
    loadFromLocalStorage('currentGameState', null)
  );
  const updateSetting = useCallback((key, value) => {
    saveToLocalStorage(key, value);
    switch(key) {
      case 'difficulty': setDifficulty(value); break;
      case 'clueDifficulty': setClueDifficulty(value); break;
      case 'customTheme': setCustomTheme(value); break;
      case 'hideAnswerOnGeneration': setHideAnswerOnGeneration(value); break;
      case 'numberOfClues': setNumberOfClues(value); break;
      case 'enableTimer': setEnableTimer(value); break;
      case 'timePerClue': setTimePerClue(value); break;
      case 'customCategories': setCategories(value); break;
      case 'numberOfSpecialClues': setNumberOfSpecialClues(value); break;
      case 'specialCluesConfig': setSpecialCluesConfig(value); break;
      case 'ageRangeMin': setAgeRangeMin(value); break;
      case 'ageRangeMax': setAgeRangeMax(value); break;
      default: break;
    }
  }, []);

  const resetUsedItems = useCallback(() => {
    setUsedItems([]);
    localStorage.removeItem('usedItems');
  }, []);

  const MAX_USED_ITEMS = 200;

  const addUsedItem = useCallback((category, item) => {
    setUsedItems(prev => {
      const normalized = normalizeItem(item);
      if (prev.some(u => u.category === category && normalizeItem(u.item) === normalized)) {
        return prev;
      }
      let updated = [...prev, { category, item }];
      if (updated.length > MAX_USED_ITEMS) {
        updated = updated.slice(updated.length - MAX_USED_ITEMS);
      }
      saveToLocalStorage('usedItems', updated);
      return updated;
    });
  }, []);

  const resetAllData = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);
  
  const saveGameState = useCallback((gameState) => {
    setCurrentGameState(gameState);
    saveToLocalStorage('currentGameState', gameState);
  }, []);
  
  const clearGameState = useCallback(() => {
    setCurrentGameState(null);
    localStorage.removeItem('currentGameState');
  }, []);

  const value = {
    difficulty,
    clueDifficulty,
    customTheme,
    hideAnswerOnGeneration,
    numberOfClues,
    enableTimer,
    timePerClue,
    categories,
    numberOfSpecialClues,
    specialCluesConfig,
    ageRangeMin,
    ageRangeMax,
    updateSetting,
    usedItems,
    addUsedItem,
    resetUsedItems,
    resetAllData,
    currentGameState,
    saveGameState,
    clearGameState,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
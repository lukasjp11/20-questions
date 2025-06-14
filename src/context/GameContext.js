import React, { createContext, useContext, useState, useCallback } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/gameLogic';
import { defaultCategories } from '../utils/prompts';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  // Game settings
  const [difficulty, setDifficulty] = useState(() => 
    loadFromLocalStorage('difficulty', 50)
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

  // Game state
  const [usedItems, setUsedItems] = useState(() => 
    loadFromLocalStorage('usedItems', [])
  );
  
  // Current game session state
  const [currentGameState, setCurrentGameState] = useState(() =>
    loadFromLocalStorage('currentGameState', null)
  );

  // Save settings when they change
  const updateSetting = useCallback((key, value) => {
    saveToLocalStorage(key, value);
    switch(key) {
      case 'difficulty': setDifficulty(value); break;
      case 'customTheme': setCustomTheme(value); break;
      case 'hideAnswerOnGeneration': setHideAnswerOnGeneration(value); break;
      case 'numberOfClues': setNumberOfClues(value); break;
      case 'enableTimer': setEnableTimer(value); break;
      case 'timePerClue': setTimePerClue(value); break;
      case 'customCategories': setCategories(value); break;
      default: break;
    }
  }, []);

  const resetUsedItems = useCallback(() => {
    setUsedItems([]);
    localStorage.removeItem('usedItems');
  }, []);

  const addUsedItem = useCallback((category, item) => {
    setUsedItems(prev => {
      const updated = [...prev, { category, item }];
      saveToLocalStorage('usedItems', updated);
      return updated;
    });
  }, []);

  const resetAllData = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);
  
  // Save current game state
  const saveGameState = useCallback((gameState) => {
    setCurrentGameState(gameState);
    saveToLocalStorage('currentGameState', gameState);
  }, []);
  
  // Clear current game state
  const clearGameState = useCallback(() => {
    setCurrentGameState(null);
    localStorage.removeItem('currentGameState');
  }, []);

  const value = {
    // Settings
    difficulty,
    customTheme,
    hideAnswerOnGeneration,
    numberOfClues,
    enableTimer,
    timePerClue,
    categories,
    updateSetting,
    
    // Game state
    usedItems,
    addUsedItem,
    resetUsedItems,
    resetAllData,
    
    // Current game session
    currentGameState,
    saveGameState,
    clearGameState,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
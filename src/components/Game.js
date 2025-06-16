import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Settings } from 'lucide-react';
import { getPrompt } from '../utils/prompts';
import { shuffleArray, selectSpecialClues } from '../utils/gameLogic';
import { useGame } from '../context/GameContext';
import CategorySelector from './CategorySelector';
import AnswerBox from './AnswerBox';
import ActionButtons from './ActionButtons';
import CluesGrid from './CluesGrid';
import Instructions from './Instructions';
import LoadingScreen from './LoadingScreen';
import Timer from './Timer';
import { generateCluesWithProgress } from '../utils/api';

const Game = ({ theme }) => {
  const {
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
    usedItems,
    addUsedItem,
    currentGameState,
    saveGameState,
    clearGameState
  } = useGame();

  const [currentCategory, setCurrentCategory] = useState(currentGameState?.currentCategory || null);
  const [currentItem, setCurrentItem] = useState(currentGameState?.currentItem || '');
  const [clues, setClues] = useState(currentGameState?.clues || []);
  const [revealedClues, setRevealedClues] = useState(currentGameState?.revealedClues || []);
  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState('');
  const [error, setError] = useState('');
  const [showAnswer, setShowAnswer] = useState(currentGameState?.showAnswer ?? true);
  const [timerPaused, setTimerPaused] = useState(true);
  const [timerResetTrigger, setTimerResetTrigger] = useState(0);
  const [generatingClues, setGeneratingClues] = useState(false);

  useEffect(() => {
    if (currentItem && !loading && !generatingClues) {
      saveGameState({
        currentCategory,
        currentItem,
        clues,
        revealedClues,
        showAnswer
      });
    }
  }, [currentCategory, currentItem, clues, revealedClues, showAnswer, loading, generatingClues, saveGameState]);

  const generateCard = async (category) => {
    setLoading(true);
    setLoadingCategory(category);
    setError('');
    setRevealedClues([]);
    setShowAnswer(!hideAnswerOnGeneration);
    setTimerPaused(true);
    setTimerResetTrigger(prev => prev + 1);
    setGeneratingClues(false);
    setClues([]);
    setCurrentItem('');
    
    clearGameState();
  
    try {
      const regularCluesNeeded = Math.max(1, numberOfClues - numberOfSpecialClues);
      const prompt = getPrompt(category, difficulty, usedItems, customTheme, regularCluesNeeded, clueDifficulty);
      
      const result = await generateCluesWithProgress(prompt, {
        onItemFound: (item) => {
          setCurrentItem(item);
          setCurrentCategory(category);
          if (!hideAnswerOnGeneration) {
            setShowAnswer(true);
          }
          setLoading(false);
          setGeneratingClues(true);
        },
        onComplete: (result) => {
          const regularClues = result.clues.slice(0, regularCluesNeeded);
          
          const selectedSpecialClues = selectSpecialClues(specialCluesConfig, numberOfSpecialClues);
          
          const allClues = [...regularClues, ...selectedSpecialClues];
          
          const shuffledClues = shuffleArray(allClues);
          
          setClues(shuffledClues);
          setGeneratingClues(false);
        }
      });
      
      addUsedItem(category, result.item);
      
    } catch (err) {
      setError(err.message || 'En fejl opstod. Prøv igen.');
      console.error('Generation error:', err);
      setLoading(false);
      setGeneratingClues(false);
    }
  };

  const toggleClue = (index) => {
    setRevealedClues(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        if (enableTimer) {
          setTimerResetTrigger(trigger => trigger + 1);
          setTimerPaused(false);
        }
        return [...prev, index];
      }
    });
  };

  const handleTimeUp = () => {
    setTimerPaused(true);
  };

  const pickRandomCategory = () => {
    const keys = Object.keys(categories);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    generateCard(randomKey);
  };

  const getCategoryName = (key) => {
    return categories[key]?.name || key;
  };

  return (
    <>
      {loading && <LoadingScreen category={getCategoryName(loadingCategory)} />}

      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} text-gray-900 dark:text-white p-4 md:p-8`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl md:text-4xl font-bold">20 Questions</h1>
            <Link
              to="/settings"
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
            <CategorySelector
              currentCategory={currentCategory}
              onCategorySelect={generateCard}
              loading={loading || generatingClues}
              usedItems={usedItems}
            />

            <AnswerBox
              currentItem={currentItem}
              showAnswer={showAnswer}
              setShowAnswer={setShowAnswer}
            />

            {enableTimer && currentItem && revealedClues.length > 0 && (
              <Timer
                timePerClue={timePerClue}
                onTimeUp={handleTimeUp}
                isPaused={timerPaused}
                resetTrigger={timerResetTrigger}
              />
            )}

            {currentItem && (
              <ActionButtons
                onRandomCategory={pickRandomCategory}
                loading={loading || generatingClues}
              />
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg flex items-center text-red-600 dark:text-red-400 text-sm">
                <AlertTriangle className="mr-2 w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {generatingClues && (
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                  Genererer ledetråde...
                </p>
              </div>
            )}

            <CluesGrid
              clues={clues}
              revealedClues={revealedClues}
              onClueClick={toggleClue}
            />

            {!currentItem && !loading && (
              <Instructions onStartRandom={pickRandomCategory} />
            )}
          </div>

          {customTheme && (
            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Tema: {customTheme}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Game;
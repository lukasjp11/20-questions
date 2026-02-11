import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Settings } from 'lucide-react';
import { getPrompt } from '../utils/prompts';
import { shuffleArray, selectSpecialClues, isItemUsed } from '../utils/gameLogic';
import { useGame } from '../context/GameContext';
import CategorySelector from './CategorySelector';
import AnswerBox from './AnswerBox';
import ActionButtons from './ActionButtons';
import CluesGrid from './CluesGrid';
import Instructions from './Instructions';
import LoadingScreen from './LoadingScreen';
import Timer from './Timer';
import { generateCluesWithProgress } from '../utils/api';

const Game = () => {
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
    ageRangeMin,
    ageRangeMax,
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

  const MAX_RETRIES = 3;

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

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const regularCluesNeeded = Math.max(1, numberOfClues - numberOfSpecialClues);
        const prompt = getPrompt(category, difficulty, usedItems, customTheme, regularCluesNeeded, clueDifficulty, ageRangeMin, ageRangeMax);

        let isDuplicate = false;

        const result = await generateCluesWithProgress(prompt, {
          onItemFound: (item) => {
            if (isItemUsed(item, usedItems, category)) {
              isDuplicate = true;
              return;
            }
            setCurrentItem(item);
            setCurrentCategory(category);
            if (!hideAnswerOnGeneration) {
              setShowAnswer(true);
            }
            setLoading(false);
            setGeneratingClues(true);
          },
          onComplete: (result) => {
            if (isDuplicate) return;
            const regularClues = result.clues.slice(0, regularCluesNeeded);
            const selectedSpecialClues = selectSpecialClues(specialCluesConfig, numberOfSpecialClues);
            const allClues = [...regularClues, ...selectedSpecialClues];
            const shuffledClues = shuffleArray(allClues);
            setClues(shuffledClues);
            setGeneratingClues(false);
          }
        });

        if (isDuplicate) {
          console.log(`Duplicate item detected (attempt ${attempt + 1}/${MAX_RETRIES}), retrying...`);
          continue;
        }

        addUsedItem(category, result.item);
        return;

      } catch (err) {
        setError(err.message || 'En fejl opstod. Prøv igen.');
        console.error('Generation error:', err);
        setLoading(false);
        setGeneratingClues(false);
        return;
      }
    }

    setError('Kunne ikke finde et nyt svar efter flere forsøg. Prøv igen.');
    setLoading(false);
    setGeneratingClues(false);
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

      <div className="min-h-screen bg-board-bg text-board-text p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl md:text-4xl font-bold font-heading text-board-gold">20 Questions</h1>
            <Link
              to="/settings"
              className="p-2 rounded-board bg-board-surface border border-[rgba(212,168,84,0.08)] hover:border-[rgba(212,168,84,0.2)] text-board-text-dim hover:text-board-gold transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-board-surface rounded-board p-4 md:p-6 border border-[rgba(212,168,84,0.06)]">
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
              <div className="mb-4 p-3 bg-[rgba(200,132,90,0.1)] border border-[rgba(200,132,90,0.2)] rounded-board flex items-center text-board-special text-sm">
                <AlertTriangle className="mr-2 w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {generatingClues && (
              <div className="text-center mb-4">
                <p className="text-sm text-board-text-muted animate-pulse">
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
            <div className="mt-4 text-center text-sm text-board-text-dimmer">
              Tema: {customTheme}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Game;
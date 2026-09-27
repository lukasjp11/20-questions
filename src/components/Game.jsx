import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { Link } from 'react-router';
import { AlertTriangle, Settings } from 'lucide-react';
import { useGame } from '../context/useGame';
import { gameReducer, isCardActive, isGenerating, restoreGame } from '../game/gameReducer';
import { useCardGenerator } from '../game/useCardGenerator';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/gameLogic';
import { categories } from '../utils/categories';
import CategorySelector from './CategorySelector';
import AnswerBox from './AnswerBox';
import ActionButtons from './ActionButtons';
import CluesGrid from './CluesGrid';
import Instructions from './Instructions';
import LoadingScreen from './LoadingScreen';
import Timer from './Timer';

const STORAGE_KEY = 'currentGameState';

const Game = () => {
  const {
    difficulty,
    clueDifficulty,
    customTheme,
    hideAnswerOnGeneration,
    numberOfClues,
    enableTimer,
    timePerClue,
    numberOfSpecialClues,
    specialCluesConfig,
    ageRangeMin,
    ageRangeMax,
    usedItems,
    addUsedItem,
  } = useGame();

  const [game, dispatch] = useReducer(gameReducer, null, () =>
    restoreGame(loadFromLocalStorage(STORAGE_KEY, null), specialCluesConfig)
  );

  useEffect(() => {
    if (isCardActive(game)) saveToLocalStorage(STORAGE_KEY, game);
    else localStorage.removeItem(STORAGE_KEY);
  }, [game]);

  const settings = useMemo(
    () => ({
      difficulty,
      clueDifficulty,
      customTheme,
      hideAnswerOnGeneration,
      numberOfClues,
      numberOfSpecialClues,
      specialCluesConfig,
      ageRangeMin,
      ageRangeMax,
    }),
    [difficulty, clueDifficulty, customTheme, hideAnswerOnGeneration, numberOfClues,
      numberOfSpecialClues, specialCluesConfig, ageRangeMin, ageRangeMax]
  );

  const generateCard = useCardGenerator(dispatch, settings, usedItems, addUsedItem);
  const busy = isGenerating(game);

  const pickRandomCategory = () => {
    const keys = Object.keys(categories);
    generateCard(keys[Math.floor(Math.random() * keys.length)]);
  };

  const toggleClue = useCallback(index => dispatch({ type: 'toggleClue', index }), []);

  return (
    <>
      {game.status === 'loading' && (
        <LoadingScreen category={categories[game.category]?.name || game.category} />
      )}

      <div className="min-h-screen bg-board-bg text-board-text p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl md:text-4xl font-bold font-heading text-board-gold">20 Spørgsmål</h1>
            <Link
              to="/settings"
              aria-label="Indstillinger"
              className="p-2 rounded-board bg-board-surface border border-[rgba(212,168,84,0.08)] hover:border-[rgba(212,168,84,0.2)] text-board-text-dim hover:text-board-gold transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-board-surface rounded-board p-4 md:p-6 border border-[rgba(212,168,84,0.06)]">
            <CategorySelector
              currentCategory={game.category}
              onCategorySelect={generateCard}
              loading={busy}
              usedItems={usedItems}
            />

            {game.item && (
              <AnswerBox
                key={game.item}
                item={game.item}
                status={game.status}
                answerVisible={game.answerVisible}
                wrongGuesses={game.wrongGuesses}
                dispatch={dispatch}
              />
            )}

            {enableTimer && game.status === 'playing' && game.revealed.length > 0 && (
              <Timer key={`${game.revealed.length}-${timePerClue}`} timePerClue={timePerClue} />
            )}

            {isCardActive(game) && (
              <ActionButtons onRandomCategory={pickRandomCategory} loading={busy} />
            )}

            {game.error && (
              <div className="mb-4 p-3 bg-[rgba(200,132,90,0.1)] border border-[rgba(200,132,90,0.2)] rounded-board flex items-center text-board-special text-sm">
                <AlertTriangle className="mr-2 w-4 h-4 flex-shrink-0" />
                <span>{game.error}</span>
              </div>
            )}

            {game.status === 'streaming' && (
              <div className="text-center mb-4">
                <p className="text-sm text-board-text-muted animate-pulse">Genererer ledetråde...</p>
              </div>
            )}

            <CluesGrid clues={game.clues} revealedClues={game.revealed} onClueClick={toggleClue} />

            {game.status === 'idle' && <Instructions onStartRandom={pickRandomCategory} />}
          </div>

          {customTheme && (
            <div className="mt-4 text-center text-sm text-board-text-dimmer">Tema: {customTheme}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Game;

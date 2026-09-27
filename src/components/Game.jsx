import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AlertTriangle, Settings } from 'lucide-react';
import { useGame } from '../context/useGame';
import { gameReducer, hasTeams, isCardActive, isGenerating, restoreGame } from '../game/gameReducer';
import { useCardGenerator } from '../game/useCardGenerator';
import { adjustDifficulty, resultOf } from '../game/scoring';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/gameLogic';
import { categories } from '../utils/categories';
import CategorySelector from './CategorySelector';
import AnswerBox from './AnswerBox';
import ActionButtons from './ActionButtons';
import CluesGrid from './CluesGrid';
import ClueList from './ClueList';
import Instructions from './Instructions';
import LoadingScreen from './LoadingScreen';
import ResultBanner from './ResultBanner';
import Scoreboard from './Scoreboard';
import Timer from './Timer';

const STORAGE_KEY = 'currentGameState';
const CATEGORY_KEYS = Object.keys(categories);
const randomCategory = () => CATEGORY_KEYS[Math.floor(Math.random() * CATEGORY_KEYS.length)];

const Game = () => {
  const {
    settings,
    updateSetting,
    usedItems,
    addUsedItem,
    history,
    recordResult,
    teamScores,
    addTeamPoints,
  } = useGame();

  const [game, dispatch] = useReducer(gameReducer, null, () =>
    restoreGame(loadFromLocalStorage(STORAGE_KEY, null), settings.specialCluesConfig)
  );
  const [adjusted, setAdjusted] = useState(null);
  const [nextCategory, setNextCategory] = useState(randomCategory);
  const gameRef = useRef(game);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    if (isCardActive(game)) saveToLocalStorage(STORAGE_KEY, game);
    else localStorage.removeItem(STORAGE_KEY);
  }, [game]);

  const teamCount = settings.mode === 'guess' && settings.teamsEnabled ? settings.teamNames.length : 0;
  const generatorSettings = useMemo(() => ({ ...settings, teamCount }), [settings, teamCount]);
  const { generate, prefetch, prefetchedCategory } = useCardGenerator(dispatch, generatorSettings, usedItems, addUsedItem);

  const startCard = useCallback((category) => {
    setAdjusted(null);
    setNextCategory(randomCategory());
    generate(category, { firstTurn: history.length });
  }, [generate, history.length]);

  useEffect(() => {
    if (game.status === 'playing') prefetch(nextCategory, [game.item]);
  }, [game.status, game.item, nextCategory, prefetch]);

  const finishRound = useCallback((finished) => {
    const result = resultOf(finished);
    recordResult(result, finished.category, finished.item);
    if (result.solved && result.team !== null) addTeamPoints(result.team, result.points);
    if (!settings.autoDifficulty) return;
    const next = adjustDifficulty(settings, result);
    if (!next) return;
    updateSetting('difficulty', next.difficulty);
    updateSetting('clueDifficulty', next.clueDifficulty);
    setAdjusted({ ...next, harder: next.clueDifficulty > settings.clueDifficulty });
  }, [settings, recordResult, addTeamPoints, updateSetting]);

  const act = useCallback((action) => {
    const before = gameRef.current;
    const after = gameReducer(before, action);
    dispatch(action);
    if (!resultOf(before) && resultOf(after)) finishRound(after);
  }, [finishRound]);

  const nextCard = () => startCard(nextCategory);

  const toggleClue = useCallback(index => act({ type: 'toggleClue', index }), [act]);
  const busy = isGenerating(game);
  const roundOver = game.status === 'solved' || game.status === 'gaveUp';
  const result = roundOver ? resultOf(game) : null;
  const teams = hasTeams(game);
  const readyName = prefetchedCategory && prefetchedCategory === nextCategory
    ? categories[prefetchedCategory]?.name
    : null;

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
            {teamCount > 0 && (
              <Scoreboard
                teamNames={settings.teamNames}
                scores={teamScores}
                turn={game.turn}
                playing={teams && game.status === 'playing'}
              />
            )}

            <CategorySelector
              currentCategory={game.category}
              onCategorySelect={startCard}
              loading={busy}
              usedItems={usedItems}
            />

            {roundOver && (
              <ResultBanner result={result} item={game.item} teamNames={settings.teamNames} adjusted={adjusted} />
            )}

            {game.item && (
              <AnswerBox key={game.item} game={game} dispatch={act} teamNames={settings.teamNames} />
            )}

            {settings.enableTimer && game.status === 'playing' && game.revealed.length > 0 && (
              <Timer key={`${game.revealed.length}-${settings.timePerClue}`} timePerClue={settings.timePerClue} />
            )}

            {isCardActive(game) && (
              <ActionButtons onNext={nextCard} loading={busy} primary={roundOver} readyCategoryName={readyName} />
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

            {game.mode === 'reader' ? (
              <CluesGrid clues={game.clues} revealedClues={game.revealed} onClueClick={toggleClue} />
            ) : (
              <ClueList game={game} dispatch={act} teamNames={settings.teamNames} />
            )}

            {game.status === 'idle' && <Instructions onStartRandom={nextCard} />}
          </div>

          {settings.customTheme && (
            <div className="mt-4 text-center text-sm text-board-text-dimmer">Tema: {settings.customTheme}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Game;

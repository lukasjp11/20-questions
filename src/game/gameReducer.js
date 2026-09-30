import { isCloseGuess, isCorrectGuess, isSpecialClue, normalizeGuess } from '../utils/gameLogic';

export const initialGame = {
  status: 'idle',
  mode: 'guess',
  teamCount: 0,
  category: null,
  item: '',
  acceptedAnswers: [],
  clues: [],
  revealed: [],
  answerVisible: false,
  wrongGuesses: [],
  lastGuess: null,
  turn: 0,
  awaitingReveal: false,
  solvedBy: null,
  error: '',
};

const ACTIVE = new Set(['playing', 'solved', 'gaveUp']);

export const isCardActive = (game) => ACTIVE.has(game.status);
export const isGenerating = (game) => game.status === 'loading' || game.status === 'streaming';
export const hasTeams = (game) => game.mode === 'guess' && game.teamCount >= 2;
export const cluesLeft = (game) => game.clues.length - game.revealed.length;

const nextTurn = (state) => ({
  ...state,
  turn: (state.turn + 1) % state.teamCount,
  awaitingReveal: cluesLeft(state) > 0,
});

export function gameReducer(state, action) {
  switch (action.type) {
    case 'start': {
      const teamCount = action.mode === 'guess' && action.teamCount >= 2 ? action.teamCount : 0;
      return {
        ...initialGame,
        status: 'loading',
        mode: action.mode,
        teamCount,
        turn: teamCount ? action.firstTurn % teamCount : 0,
        category: action.category,
      };
    }

    case 'itemFound':
      if (state.status !== 'loading') return state;
      return { ...state, status: 'streaming', item: action.item };

    case 'cardReady':
      if (!isGenerating(state)) return state;
      return {
        ...state,
        status: 'playing',
        item: action.item,
        acceptedAnswers: action.acceptedAnswers,
        clues: action.clues,
        awaitingReveal: hasTeams(state),
      };

    case 'failed':
      return { ...initialGame, mode: state.mode, error: action.error };

    case 'toggleClue': {
      if (state.mode !== 'reader' || !isCardActive(state)) return state;
      const revealed = state.revealed.includes(action.index)
        ? state.revealed.filter(i => i !== action.index)
        : [...state.revealed, action.index];
      return { ...state, revealed };
    }

    case 'revealNext': {
      if (state.mode === 'reader' || !isCardActive(state) || cluesLeft(state) === 0) return state;
      if (state.status === 'playing' && hasTeams(state) && !state.awaitingReveal) return state;
      return {
        ...state,
        revealed: [...state.revealed, state.revealed.length],
        awaitingReveal: false,
        lastGuess: null,
      };
    }

    case 'guess': {
      if (state.status !== 'playing' || state.mode !== 'guess') return state;
      if (hasTeams(state) && state.awaitingReveal) return state;
      const text = action.text.trim();
      if (!normalizeGuess(text)) return state;

      if (action.verdict === 'correct' || isCorrectGuess(text, state.acceptedAnswers)) {
        return {
          ...state,
          status: 'solved',
          answerVisible: true,
          lastGuess: null,
          solvedBy: hasTeams(state) ? state.turn : null,
        };
      }

      const close = action.verdict ? action.verdict === 'close' : isCloseGuess(text, state.acceptedAnswers);
      const lastGuess = { text, close };
      const seen = state.wrongGuesses.some(g => normalizeGuess(g) === normalizeGuess(text));
      const next = { ...state, lastGuess, wrongGuesses: seen ? state.wrongGuesses : [...state.wrongGuesses, text] };
      return hasTeams(state) ? nextTurn(next) : next;
    }

    case 'pass':
      if (state.status !== 'playing' || !hasTeams(state) || state.awaitingReveal) return state;
      return nextTurn({ ...state, lastGuess: null });

    case 'giveUp':
      if (state.status !== 'playing') return state;
      return { ...state, status: 'gaveUp', answerVisible: true, lastGuess: null };

    case 'setAnswerVisible':
      if (!isCardActive(state)) return state;
      if (state.mode === 'guess' && state.status === 'playing' && action.visible) return state;
      return { ...state, answerVisible: action.visible };

    default:
      return state;
  }
}

export function restoreGame(saved, specialCluesConfig = []) {
  if (!saved || typeof saved !== 'object') return initialGame;

  if (saved.status && Array.isArray(saved.clues)) {
    return ACTIVE.has(saved.status) ? { ...initialGame, ...saved, error: '' } : initialGame;
  }

  if (saved.currentItem && Array.isArray(saved.clues) && saved.clues.length) {
    return {
      ...initialGame,
      status: 'playing',
      mode: 'reader',
      category: saved.currentCategory ?? null,
      item: saved.currentItem,
      acceptedAnswers: saved.acceptedAnswers?.length ? saved.acceptedAnswers : [saved.currentItem],
      clues: saved.clues.map(text => ({ text, special: isSpecialClue(text, specialCluesConfig) })),
      revealed: Array.isArray(saved.revealedClues) ? saved.revealedClues : [],
      answerVisible: Boolean(saved.showAnswer),
    };
  }

  return initialGame;
}

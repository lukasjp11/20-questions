import { isCorrectGuess, isSpecialClue, normalizeGuess } from '../utils/gameLogic';

export const initialGame = {
  status: 'idle',
  category: null,
  item: '',
  acceptedAnswers: [],
  clues: [],
  revealed: [],
  answerVisible: false,
  wrongGuesses: [],
  error: '',
};

const ACTIVE = new Set(['playing', 'solved', 'gaveUp']);

export const isCardActive = (game) => ACTIVE.has(game.status);
export const isGenerating = (game) => game.status === 'loading' || game.status === 'streaming';

export function gameReducer(state, action) {
  switch (action.type) {
    case 'start':
      return {
        ...initialGame,
        status: 'loading',
        category: action.category,
        answerVisible: action.answerVisible,
      };

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
      };

    case 'failed':
      return { ...initialGame, error: action.error };

    case 'toggleClue': {
      if (!isCardActive(state)) return state;
      const revealed = state.revealed.includes(action.index)
        ? state.revealed.filter(i => i !== action.index)
        : [...state.revealed, action.index];
      return { ...state, revealed };
    }

    case 'guess': {
      if (state.status !== 'playing') return state;
      if (isCorrectGuess(action.text, state.acceptedAnswers)) {
        return { ...state, status: 'solved', answerVisible: true };
      }
      const key = normalizeGuess(action.text);
      if (!key || state.wrongGuesses.some(g => normalizeGuess(g) === key)) return state;
      return { ...state, wrongGuesses: [...state.wrongGuesses, action.text.trim()] };
    }

    case 'giveUp':
      if (state.status !== 'playing') return state;
      return { ...state, status: 'gaveUp', answerVisible: true };

    case 'setAnswerVisible':
      if (!isCardActive(state) && !isGenerating(state)) return state;
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

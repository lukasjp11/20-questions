import { useState } from 'react';
import { EyeOff } from 'lucide-react';
import { normalizeGuess } from '../utils/gameLogic';
import HoldButton from './HoldButton';

const AnswerBox = ({ item, status, answerVisible, wrongGuesses, dispatch }) => {
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState('');

  const canGuess = status === 'playing';
  const wrong =
    canGuess && submitted !== '' && wrongGuesses.some(g => normalizeGuess(g) === normalizeGuess(submitted));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guess.trim()) return;
    setSubmitted(guess);
    dispatch({ type: 'guess', text: guess });
  };

  const setVisible = visible => dispatch({ type: 'setAnswerVisible', visible });

  const barClass =
    'w-full min-h-[64px] px-4 py-3 rounded-board text-left bg-board-gold shadow-[0_3px_12px_rgba(0,0,0,0.25)] flex items-center justify-between gap-4';
  const label = (
    <span className="text-[10px] uppercase tracking-[1.5px] font-bold text-[#2c2520]/50">Svar</span>
  );

  return (
    <div className="mb-6">
      {answerVisible ? (
        <button
          onClick={() => setVisible(false)}
          className={`${barClass} transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]`}
          aria-label={`Svar: ${item}. Tryk for at skjule`}
        >
          <span className="flex items-center gap-3 flex-wrap min-w-0">
            {label}
            <span className="text-xl md:text-2xl font-bold font-heading text-[#2c2520]">
              {item}
            </span>
          </span>
          <EyeOff className="w-5 h-5 flex-shrink-0 text-[#2c2520]/35" />
        </button>
      ) : (
        <div className={barClass} aria-label="Svaret er skjult">
          <span className="flex items-center gap-3">
            {label}
            <span className="flex gap-1.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map(i => (
                <span key={i} className="w-2 h-2 rounded-full bg-[#2c2520]/30" />
              ))}
            </span>
          </span>
        </div>
      )}

      {!answerVisible && canGuess && (
        <>
          <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
            <input
              type="text"
              name="guess"
              aria-label="Dit gæt"
              value={guess}
              onChange={e => {
                setGuess(e.target.value);
                setSubmitted('');
              }}
              placeholder="Skriv dit gæt…"
              autoComplete="off"
              className={`flex-1 min-w-0 px-3 py-2.5 rounded-board bg-board-bg border outline-none transition-colors text-board-text placeholder-board-text-faint ${
                wrong ? 'border-board-special' : 'border-[rgba(212,168,84,0.1)] focus:border-board-gold'
              }`}
            />
            <button
              type="submit"
              disabled={!guess.trim()}
              className="px-5 py-2.5 bg-board-gold hover:bg-board-gold-muted disabled:bg-board-surface-active disabled:text-board-text-faint disabled:cursor-not-allowed text-board-bg font-semibold rounded-board transition-colors"
            >
              Gæt
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between gap-3 min-h-[32px]">
            <p className="text-sm text-board-special" aria-live="polite">
              {wrong ? 'Ikke helt, prøv igen' : ''}
            </p>
            <HoldButton
              onConfirm={() => dispatch({ type: 'giveUp' })}
              className="flex-shrink-0 px-3 py-1.5 rounded-board text-xs text-board-text-dim hover:text-board-text-secondary border border-dashed border-[rgba(212,168,84,0.2)]"
            >
              Hold for at give op
            </HoldButton>
          </div>
        </>
      )}
    </div>
  );
};

export default AnswerBox;

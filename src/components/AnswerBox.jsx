import { useEffect, useRef, useState } from 'react';
import { EyeOff, Eye, LoaderCircle } from 'lucide-react';
import { hasTeams } from '../game/gameReducer';
import { checkGuess } from '../utils/api';
import { isCorrectGuess, normalizeGuess } from '../utils/gameLogic';
import HoldButton from './HoldButton';

const barClass =
  'w-full min-h-[64px] px-4 py-3 rounded-board text-left bg-board-gold shadow-[0_3px_12px_rgba(0,0,0,0.25)] flex items-center justify-between gap-4';

const Label = () => (
  <span className="text-[10px] uppercase tracking-[1.5px] font-bold text-[#2c2520]/50">Svar</span>
);

const HiddenDots = () => (
  <span className="flex gap-1.5" aria-hidden="true">
    {[0, 1, 2, 3, 4].map(i => (
      <span key={i} className="w-2 h-2 rounded-full bg-[#2c2520]/30" />
    ))}
  </span>
);

const AnswerBar = ({ game, dispatch }) => {
  const canToggle = game.mode === 'reader' || game.status !== 'playing';

  if (game.answerVisible) {
    return (
      <button
        onClick={() => dispatch({ type: 'setAnswerVisible', visible: false })}
        className={`${barClass} transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]`}
        aria-label={`Svar: ${game.item}. Tryk for at skjule`}
      >
        <span className="flex items-center gap-3 flex-wrap min-w-0">
          <Label />
          <span className="text-xl md:text-2xl font-bold font-heading text-[#2c2520]">{game.item}</span>
        </span>
        <EyeOff className="w-5 h-5 flex-shrink-0 text-[#2c2520]/35" />
      </button>
    );
  }

  if (canToggle) {
    return (
      <button
        onClick={() => dispatch({ type: 'setAnswerVisible', visible: true })}
        className={`${barClass} transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]`}
        aria-label="Vis svar"
      >
        <span className="flex items-center gap-3">
          <Label />
          <HiddenDots />
        </span>
        <Eye className="w-5 h-5 flex-shrink-0 text-[#2c2520]/35" />
      </button>
    );
  }

  return (
    <div className={barClass} aria-label="Svaret er skjult">
      <span className="flex items-center gap-3">
        <Label />
        <HiddenDots />
      </span>
    </div>
  );
};

const GuessForm = ({ game, dispatch, teamNames }) => {
  const [guess, setGuess] = useState('');
  const [checking, setChecking] = useState(false);
  const verdicts = useRef(new Map());
  const mounted = useRef(true);
  const teams = hasTeams(game);
  const mustReveal = teams && game.awaitingReveal;
  const earlierGuesses = game.wrongGuesses.filter(g => g !== game.lastGuess?.text);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = guess.trim();
    if (!text || checking) return;
    if (isCorrectGuess(text, game.acceptedAnswers)) {
      dispatch({ type: 'guess', text });
      setGuess('');
      return;
    }
    const key = normalizeGuess(text);
    if (!verdicts.current.has(key)) {
      setChecking(true);
      const verdict = await checkGuess({ category: game.category, item: game.item, accept: game.acceptedAnswers, guess: text });
      if (!mounted.current) return;
      setChecking(false);
      if (verdict) verdicts.current.set(key, verdict);
    }
    dispatch({ type: 'guess', text, verdict: verdicts.current.get(key) });
    setGuess('');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
        <input
          type="text"
          name="guess"
          aria-label="Dit gæt"
          value={guess}
          disabled={mustReveal}
          readOnly={checking}
          onChange={e => setGuess(e.target.value)}
          placeholder={mustReveal ? 'Vend en ledetråd først' : teams ? `${teamNames[game.turn]} gætter…` : 'Skriv dit gæt…'}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={false}
          enterKeyHint="send"
          inputMode={game.category === 'aarstal' ? 'numeric' : 'text'}
          className={`flex-1 min-w-0 px-3 py-2.5 rounded-board bg-board-bg border outline-none transition-colors text-board-text placeholder-board-text-faint disabled:opacity-60 ${
            game.lastGuess && !game.lastGuess.close ? 'border-board-special' : 'border-[rgba(212,168,84,0.1)] focus:border-board-gold'
          }`}
        />
        <button
          type="submit"
          disabled={!guess.trim() || mustReveal || checking}
          aria-label={checking ? 'Tjekker gæt' : 'Gæt'}
          className="min-w-[72px] px-5 py-2.5 bg-board-gold hover:bg-board-gold-muted disabled:bg-board-surface-active disabled:text-board-text-faint disabled:cursor-not-allowed text-board-bg font-semibold rounded-board transition-colors flex items-center justify-center"
        >
          {checking ? <LoaderCircle className="w-5 h-5 animate-spin" /> : 'Gæt'}
        </button>
        {teams && (
          <button
            type="button"
            disabled={mustReveal}
            onClick={() => dispatch({ type: 'pass' })}
            className="px-4 py-2.5 rounded-board font-medium bg-board-surface-active text-board-text-secondary border border-[rgba(212,168,84,0.15)] hover:text-board-gold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Pas
          </button>
        )}
      </form>

      <div className="mt-2 flex items-start justify-between gap-3 min-h-[32px]">
        <div className="min-w-0" aria-live="polite">
          {game.lastGuess && (
            <p className={`text-sm font-medium ${game.lastGuess.close ? 'text-board-gold' : 'text-board-special'}`}>
              {game.lastGuess.close ? `Tæt på! »${game.lastGuess.text}« er ikke helt rigtigt.` : `»${game.lastGuess.text}« er forkert.`}
              {teams && ` Nu er det ${teamNames[game.turn]}.`}
            </p>
          )}
          {earlierGuesses.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 mt-2" aria-label="Forkerte gæt">
              {earlierGuesses.map(g => (
                <li key={g} className="px-2 py-0.5 rounded-full text-xs bg-board-surface-active text-board-text-dim line-through">
                  {g}
                </li>
              ))}
            </ul>
          )}
        </div>
        <HoldButton
          onConfirm={() => dispatch({ type: 'giveUp' })}
          className="flex-shrink-0 px-3 py-1.5 rounded-board text-xs text-board-text-dim hover:text-board-text-secondary border border-dashed border-[rgba(212,168,84,0.2)]"
        >
          Hold for at give op
        </HoldButton>
      </div>
    </>
  );
};

const AnswerBox = ({ game, dispatch, teamNames = [] }) => {
  const playing = game.status === 'playing';
  return (
    <div className="mb-6">
      <AnswerBar game={game} dispatch={dispatch} />
      {playing && game.mode === 'guess' && <GuessForm game={game} dispatch={dispatch} teamNames={teamNames} />}
    </div>
  );
};

export default AnswerBox;

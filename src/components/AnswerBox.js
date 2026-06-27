import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { isCorrectGuess } from '../utils/gameLogic';

const AnswerBox = ({ currentItem, showAnswer, setShowAnswer, acceptedAnswers = [] }) => {
  const [guess, setGuess] = useState('');
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    setGuess('');
    setWrong(false);
  }, [currentItem]);

  if (!currentItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guess.trim()) return;
    if (isCorrectGuess(guess, acceptedAnswers)) {
      setShowAnswer(true);
    } else {
      setWrong(true);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="w-full p-4 rounded-board transition-all text-left bg-board-gold shadow-[0_3px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transform hover:scale-[1.01] active:scale-[0.99]"
        aria-label={showAnswer ? 'Skjul svar' : 'Vis svar'}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-[1.5px] font-bold text-[#2c2520]/50">Svar:</span>
            {showAnswer ? (
              <span className="text-xl md:text-2xl font-bold font-heading text-[#2c2520]">
                {currentItem}
              </span>
            ) : (
              <span className="text-xl md:text-2xl font-bold text-[#2c2520]/40">
                • • • • •
              </span>
            )}
          </div>
          <div className="flex-shrink-0 text-[#2c2520]/35">
            {showAnswer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {!showAnswer && (
        <>
          <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
            <input
              type="text"
              value={guess}
              onChange={e => {
                setGuess(e.target.value);
                if (wrong) setWrong(false);
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
              className="px-5 py-2.5 bg-board-gold hover:bg-board-gold-muted disabled:opacity-40 disabled:cursor-not-allowed text-board-bg font-semibold rounded-board transition-colors"
            >
              Gæt
            </button>
          </form>
          {wrong && (
            <p className="mt-2 text-sm text-board-special">Ikke helt, prøv igen</p>
          )}
          <p className="mt-2 text-xs text-board-text-dimmer">
            Tryk på svar-feltet for at give op og afsløre svaret.
          </p>
        </>
      )}
    </div>
  );
};

export default AnswerBox;

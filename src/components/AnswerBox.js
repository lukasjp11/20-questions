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
        className="w-full p-5 rounded-board-lg transition-all text-left bg-gold-gradient shadow-gold hover:shadow-gold transform hover:scale-[1.01] active:scale-[0.99]"
        aria-label={showAnswer ? 'Skjul svar' : 'Vis svar'}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-[1.5px] font-extrabold text-board-bg/55">Svar:</span>
            {showAnswer ? (
              <span className="text-2xl md:text-3xl font-bold font-heading text-board-bg">
                {currentItem}
              </span>
            ) : (
              <span className="text-2xl md:text-3xl font-bold font-heading text-board-bg/35 tracking-widest">
                • • • •
              </span>
            )}
          </div>
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-board-bg/15 flex items-center justify-center text-board-bg/60">
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
              className={`flex-1 min-w-0 px-4 py-3 rounded-2xl bg-board-surface border-2 outline-none transition-colors text-board-text placeholder-board-text-dimmest ${
                wrong ? 'border-board-special' : 'border-transparent focus:border-board-gold'
              }`}
            />
            <button
              type="submit"
              disabled={!guess.trim()}
              className="px-6 py-3 bg-board-special-deep hover:bg-board-special disabled:opacity-40 disabled:cursor-not-allowed text-board-bg font-bold rounded-2xl shadow-terra transition-colors"
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

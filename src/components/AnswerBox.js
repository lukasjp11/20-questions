import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AnswerBox = ({ currentItem, showAnswer, setShowAnswer }) => {
  if (!currentItem) return null;

  return (
    <button
      onClick={() => setShowAnswer(!showAnswer)}
      className="w-full mb-6 p-4 rounded-board transition-all text-left bg-board-gold shadow-[0_3px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transform hover:scale-[1.01] active:scale-[0.99]"
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
  );
};

export default AnswerBox;

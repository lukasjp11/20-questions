import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AnswerBox = ({ currentItem, showAnswer, setShowAnswer }) => {
  if (!currentItem) return null;

  return (
    <button
      onClick={() => setShowAnswer(!showAnswer)}
      className="
        w-full mb-6 p-4 bg-white dark:bg-gray-700
        rounded-lg transition-all text-left
        hover:bg-gray-100 dark:hover:bg-gray-600
        transform hover:scale-[1.01] active:scale-[0.99]
        border border-gray-200 dark:border-transparent
      "
      aria-label={showAnswer ? 'Skjul svar' : 'Vis svar'}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm text-gray-500 dark:text-gray-400">Svar:</span>
          {showAnswer ? (
            <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {currentItem}
            </span>
          ) : (
            <span className="text-xl md:text-2xl font-bold text-gray-400 dark:text-gray-500">
              • • • • •
            </span>
          )}
        </div>
        <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
          {showAnswer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </div>
      </div>
    </button>
  );
};

export default AnswerBox;
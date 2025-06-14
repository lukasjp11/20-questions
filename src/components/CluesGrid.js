import React, { memo, useCallback } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { isSpecialClue } from '../utils/gameLogic';

const ClueButton = memo(({ clue, index, isRevealed, onClick }) => {
  const isSpecial = isSpecialClue(clue);
  
  const handleClick = useCallback(() => {
    onClick(index);
  }, [onClick, index]);
  
  return (
    <button
      onClick={handleClick}
      className={`
        p-3 rounded-lg transition-all text-left
        ${isRevealed 
          ? (isSpecial 
            ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700' 
            : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-transparent'
          ) 
          : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-transparent'
        }
        transform hover:scale-[1.02] active:scale-[0.98]
      `}
      aria-label={`Clue ${index + 1} ${isRevealed ? '(revealed)' : '(hidden)'}`}
    >
      <div className="flex items-center gap-2">
        {isRevealed ? (
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
        ) : (
          <Circle className="w-4 h-4 text-gray-500 flex-shrink-0" />
        )}
        <span className="font-semibold text-gray-600 dark:text-gray-400">
          #{index + 1}
        </span>
        {isRevealed && (
          <span className={`flex-1 text-sm ${isSpecial ? 'text-purple-600 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>
            {clue}
          </span>
        )}
      </div>
    </button>
  );
});

ClueButton.displayName = 'ClueButton';

const CluesGrid = memo(({ clues, revealedClues, onClueClick }) => {
  if (clues.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ledetråde</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {revealedClues.length} / {clues.length} afsløret
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {clues.map((clue, index) => (
          <ClueButton
            key={index}
            clue={clue}
            index={index}
            isRevealed={revealedClues.includes(index)}
            onClick={onClueClick}
          />
        ))}
      </div>
    </div>
  );
});

CluesGrid.displayName = 'CluesGrid';

export default CluesGrid;
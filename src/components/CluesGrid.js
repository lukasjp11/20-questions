import React, { memo, useCallback } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { isSpecialClue } from '../utils/gameLogic';
import { useGame } from '../context/GameContext';

const ClueButton = memo(({ clue, index, isRevealed, onClick, specialCluesConfig }) => {
  const isSpecial = isSpecialClue(clue, specialCluesConfig);

  const handleClick = useCallback(() => {
    onClick(index);
  }, [onClick, index]);

  return (
    <button
      onClick={handleClick}
      className={`
        p-3.5 rounded-2xl transition-all text-left
        ${isRevealed
          ? (isSpecial
            ? 'bg-[rgba(229,155,115,0.14)] border-2 border-[rgba(229,155,115,0.32)]'
            : 'bg-board-surface border-2 border-[rgba(230,193,104,0.3)]'
          )
          : 'bg-board-surface-alt border-2 border-transparent hover:bg-board-surface hover:border-[rgba(230,193,104,0.12)]'
        }
        transform hover:scale-[1.02] active:scale-[0.98]
      `}
      aria-label={`Clue ${index + 1} ${isRevealed ? '(revealed)' : '(hidden)'}`}
    >
      <div className="flex items-center gap-2">
        {isRevealed ? (
          <CheckCircle className="w-4 h-4 text-board-gold flex-shrink-0" />
        ) : (
          <Circle className="w-4 h-4 text-board-text-faint flex-shrink-0" />
        )}
        <span className={`font-extrabold ${isRevealed ? 'text-board-gold' : 'text-board-text-dimmest'}`}>
          #{index + 1}
        </span>
        {isRevealed && (
          <span className={`flex-1 text-sm ${isSpecial ? 'text-board-special' : 'text-board-text-secondary'}`}>
            {clue}
          </span>
        )}
      </div>
    </button>
  );
});

ClueButton.displayName = 'ClueButton';

const CluesGrid = memo(({ clues, revealedClues, onClueClick }) => {
  const { specialCluesConfig } = useGame();

  if (clues.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold font-heading text-board-text">Ledetråde</h3>
        <span className="text-sm text-board-text-dimmer">
          <span className="text-board-gold font-extrabold">{revealedClues.length}</span> / {clues.length} afsløret
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {clues.map((clue, index) => (
          <ClueButton
            key={index}
            clue={clue}
            index={index}
            isRevealed={revealedClues.includes(index)}
            onClick={onClueClick}
            specialCluesConfig={specialCluesConfig}
          />
        ))}
      </div>
    </div>
  );
});

CluesGrid.displayName = 'CluesGrid';

export default CluesGrid;

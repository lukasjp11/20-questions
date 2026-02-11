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
        p-3 rounded-board transition-all text-left
        ${isRevealed
          ? (isSpecial
            ? 'bg-[rgba(200,132,90,0.1)] border border-[rgba(200,132,90,0.2)]'
            : 'bg-board-surface-active border border-[rgba(212,168,84,0.15)]'
          )
          : 'bg-board-surface-alt border border-[rgba(212,168,84,0.05)] hover:bg-board-surface-active hover:border-[rgba(212,168,84,0.1)]'
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
        <span className={`font-semibold ${isRevealed ? 'text-board-gold' : 'text-board-text-faint'}`}>
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
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[11px] font-bold text-board-text-dimmer uppercase tracking-[1.5px]">Ledetråde</h3>
        <span className="text-xs text-board-text-faint">
          <span className="text-board-gold font-bold">{revealedClues.length}</span> / {clues.length} afsløret
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
            specialCluesConfig={specialCluesConfig}
          />
        ))}
      </div>
    </div>
  );
});

CluesGrid.displayName = 'CluesGrid';

export default CluesGrid;

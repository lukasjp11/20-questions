import { ChevronDown } from 'lucide-react';
import { cluesLeft, hasTeams } from '../game/gameReducer';

const ClueList = ({ game, dispatch, teamNames = [] }) => {
  if (game.clues.length === 0) return null;

  const left = cluesLeft(game);
  const teams = hasTeams(game);
  const playing = game.status === 'playing';
  const canReveal = left > 0 && (!playing || !teams || game.awaitingReveal);
  const nextNumber = game.revealed.length + 1;
  const ladder = game.mode === 'ladder';

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[11px] font-bold text-board-text-dimmer uppercase tracking-[1.5px]">Ledetråde</h3>
        <span className="text-xs text-board-text-faint">
          <span className="text-board-gold font-bold">{game.revealed.length}</span> / {game.clues.length} vendt
        </span>
      </div>

      {ladder && (
        <div className="flex gap-1 mb-3" aria-hidden="true">
          {game.clues.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < game.revealed.length ? 'bg-board-gold' : 'bg-board-surface-active'}`} />
          ))}
        </div>
      )}

      <ol className="space-y-2">
        {game.revealed.map((index, i) => (
          <li
            key={index}
            className="flex gap-3 p-3 rounded-board bg-board-surface-active border border-[rgba(212,168,84,0.15)]"
          >
            <span className="w-6 flex-shrink-0 font-semibold tabular-nums text-board-gold">{i + 1}</span>
            <span className={`text-base leading-snug md:text-sm ${game.clues[index].special ? 'text-board-special' : 'text-board-text-secondary'}`}>{game.clues[index].text}</span>
          </li>
        ))}
      </ol>

      {canReveal && (
        <button
          onClick={() => dispatch({ type: 'revealNext' })}
          className="w-full mt-2 p-3 rounded-board flex items-center justify-center gap-2 font-semibold border-[1.5px] border-dashed border-[rgba(212,168,84,0.3)] text-board-gold hover:bg-board-surface-active transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
          {!playing ? `Se ledetråd ${nextNumber}` : teams ? `${teamNames[game.turn]}: vend ledetråd ${nextNumber}` : `Vend ledetråd ${nextNumber}`}
        </button>
      )}

      {playing && left === 0 && (
        <p className="mt-3 text-sm text-center text-board-text-dim">
          {!ladder ? 'Alle ledetråde er vendt. Gæt eller giv op.' : game.answerVisible ? 'Alle ledetråde er vendt.' : 'Alle ledetråde er vendt. Tryk på svaret for at se det.'}
        </p>
      )}
    </div>
  );
};

export default ClueList;

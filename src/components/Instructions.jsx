import { Link } from 'react-router';
import { Shuffle } from 'lucide-react';
import { useGame } from '../context/useGame';
import { matchPreset } from '../game/presets';

const Instructions = ({ onStartRandom }) => {
  const { settings } = useGame();
  const preset = matchPreset(settings);
  const level = preset ? preset.label : 'Egne indstillinger';

  return (
    <div className="text-center py-16">
      <p className="text-board-text-muted mb-6 text-lg">
        Vælg en kategori ovenfor
      </p>
      <span className="text-board-text-faint mb-6 block">eller</span>
      <button
        onClick={onStartRandom}
        className="bg-board-surface-active border-[1.5px] border-[rgba(212,168,84,0.15)] text-board-text-secondary hover:border-[rgba(212,168,84,0.3)] hover:text-board-gold rounded-board font-medium text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto px-8 py-4"
      >
        <Shuffle className="w-5 h-5" />
        Start med tilfældig kategori
      </button>
      <p className="mt-8 text-sm text-board-text-dim">
        Sværhed: <span className="text-board-text-secondary font-medium">{level}</span>
        {' · '}
        <Link to="/settings" className="text-board-gold hover:underline">Skift</Link>
      </p>
    </div>
  );
};

export default Instructions;

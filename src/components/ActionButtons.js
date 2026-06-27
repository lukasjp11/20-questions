import React from 'react';
import { Shuffle } from 'lucide-react';

const ActionButtons = ({ onRandomCategory, loading }) => {
  return (
    <div className="mb-6">
      <button
        onClick={onRandomCategory}
        disabled={loading}
        className="w-full px-6 py-3.5 bg-board-surface-active border-[1.5px] border-[rgba(212,168,84,0.15)] text-board-text-secondary hover:border-[rgba(212,168,84,0.3)] hover:text-board-gold rounded-board font-semibold disabled:opacity-50 transition-all transform active:scale-95 hover:scale-[1.02] flex items-center justify-center gap-2"
        aria-label="Generer kort fra tilfældig kategori"
      >
        <Shuffle className="w-4 h-4" />
        Tilfældig kategori
      </button>
    </div>
  );
};

export default ActionButtons;

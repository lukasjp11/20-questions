import React from 'react';
import { Shuffle } from 'lucide-react';

const ActionButtons = ({ onRandomCategory, loading }) => {
  return (
    <div className="mb-6">
      <button
        onClick={onRandomCategory}
        disabled={loading}
        className="w-full px-6 py-3.5 bg-board-surface hover:bg-board-surface-active text-board-text-secondary hover:text-board-gold rounded-2xl font-bold disabled:opacity-50 transition-all transform active:scale-95 hover:scale-[1.02] flex items-center justify-center gap-2"
        aria-label="Generer kort fra tilfældig kategori"
      >
        <Shuffle className="w-4 h-4" />
        Tilfældig kategori
      </button>
    </div>
  );
};

export default ActionButtons;

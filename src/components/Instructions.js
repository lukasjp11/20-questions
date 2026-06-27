import React from 'react';
import { Shuffle } from 'lucide-react';

const Instructions = ({ onStartRandom }) => {
  return (
    <div className="text-center py-16">
      <p className="text-board-text-muted mb-6 text-lg">
        Vælg en kategori ovenfor
      </p>
      <span className="text-board-text-faint mb-6 block">eller</span>
      <button
        onClick={onStartRandom}
        className="bg-gold-gradient text-board-bg shadow-gold-sm rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto px-8 py-4"
      >
        <Shuffle className="w-5 h-5" />
        Start med tilfældig kategori
      </button>
    </div>
  );
};

export default Instructions;

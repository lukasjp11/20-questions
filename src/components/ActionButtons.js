import React from 'react';
import { Shuffle } from 'lucide-react';

const ActionButtons = ({ onRandomCategory, loading }) => {
  return (
    <div className="mb-6">
      <button
        onClick={onRandomCategory}
        disabled={loading}
        className="
          w-full px-6 py-2.5 
          bg-gradient-to-r from-green-600 to-emerald-600 
          hover:from-green-700 hover:to-emerald-700
          text-white rounded-lg flex items-center justify-center gap-2
          disabled:opacity-50 transition-all
          transform active:scale-95 hover:scale-[1.02]
          shadow-md hover:shadow-lg
        "
        aria-label="Generer kort fra tilfældig kategori"
      >
        <Shuffle className="w-4 h-4" />
        Tilfældig kategori
      </button>
    </div>
  );
};

export default ActionButtons;
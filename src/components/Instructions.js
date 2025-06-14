import React from 'react';
import { Shuffle } from 'lucide-react';

const Instructions = ({ onStartRandom }) => {
  return (
    <div className="text-center py-16">
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-lg">
        Vælg en kategori ovenfor
      </p>
      <span className="text-gray-400 dark:text-gray-500 mb-6 block">eller</span>
      <button
        onClick={onStartRandom}
        className="
          px-8 py-4 
          bg-gradient-to-r from-blue-600 to-purple-600 
          hover:from-blue-700 hover:to-purple-700 
          text-white rounded-lg font-medium text-lg
          transform transition-all hover:scale-105 active:scale-95
          shadow-lg hover:shadow-xl
          flex items-center gap-3 mx-auto
        "
      >
        <Shuffle className="w-5 h-5" />
        Start med tilfældig kategori
      </button>
    </div>
  );
};

export default Instructions;
import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingScreen = ({ category }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/90 dark:bg-gray-900/95 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="text-center">
        <div className="relative mb-8">
          <Sparkles className="w-16 h-16 text-blue-500 animate-pulse mx-auto" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-blue-500/20 rounded-full animate-spin" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white dark:text-gray-100 mb-2">
          Genererer nyt spørgsmål
        </h2>
        <p className="text-gray-300 dark:text-gray-400">
          Finder det perfekte emne i kategorien "{category}"
        </p>
        
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
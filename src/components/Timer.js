import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const Timer = ({ timePerClue, onTimeUp, isPaused, resetTrigger }) => {
  const [timeLeft, setTimeLeft] = useState(timePerClue);
  const [isTimeUp, setIsTimeUp] = useState(false);
  
  // Reset timer when resetTrigger changes (new clue revealed)
  useEffect(() => {
    setTimeLeft(timePerClue);
    setIsTimeUp(false);
  }, [resetTrigger, timePerClue]);
  
  useEffect(() => {
    if (isPaused || isTimeUp) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimeUp(true);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timePerClue, onTimeUp, isPaused, isTimeUp]);
  
  const percentage = (timeLeft / timePerClue) * 100;
  const isLow = timeLeft <= 5 && timeLeft > 0;
  
  if (isTimeUp) {
    return (
      <div className="w-full mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
        <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Tiden er udløbet!</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Tid tilbage
        </span>
        <span className={`text-sm font-bold ${isLow ? 'text-red-500 animate-pulse' : ''}`}>
          {timeLeft}s
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${
            isLow ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;
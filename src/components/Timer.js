import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const Timer = ({ timePerClue, onTimeUp, isPaused, resetTrigger }) => {
  const [timeLeft, setTimeLeft] = useState(timePerClue);
  const [isTimeUp, setIsTimeUp] = useState(false);

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
      <div className="w-full mb-4 p-3 bg-[rgba(200,132,90,0.1)] border border-[rgba(200,132,90,0.2)] rounded-board">
        <div className="flex items-center justify-center gap-2 text-board-special">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Tiden er udløbet!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium flex items-center gap-1 text-board-text-muted">
          <Clock className="w-3 h-3" />
          Tid tilbage
        </span>
        <span className={`text-sm font-bold ${isLow ? 'text-board-special animate-pulse' : 'text-board-text'}`}>
          {timeLeft}s
        </span>
      </div>
      <div className="w-full bg-[rgba(212,168,84,0.08)] rounded-board h-2 overflow-hidden">
        <div
          className={`h-full rounded-board transition-all duration-1000 ${
            isLow ? 'bg-board-special' : 'bg-board-gold'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;

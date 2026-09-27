import { useEffect, useRef, useState } from 'react';

const HoldButton = ({ onConfirm, holdMs = 800, children, className = '' }) => {
  const [holding, setHolding] = useState(false);
  const timeoutRef = useRef(null);

  const cancel = () => {
    clearTimeout(timeoutRef.current);
    setHolding(false);
  };

  const start = () => {
    clearTimeout(timeoutRef.current);
    setHolding(true);
    timeoutRef.current = setTimeout(() => {
      setHolding(false);
      onConfirm();
    }, holdMs);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const onKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
      e.preventDefault();
      start();
    }
  };

  const onKeyUp = (e) => {
    if (e.key === 'Enter' || e.key === ' ') cancel();
  };

  return (
    <button
      type="button"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative overflow-hidden select-none touch-none ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 bg-[rgba(200,132,90,0.25)]"
        style={{
          width: holding ? '100%' : '0%',
          transition: holding ? `width ${holdMs}ms linear` : 'width 150ms ease-out',
        }}
      />
      <span className="relative">{children}</span>
    </button>
  );
};

export default HoldButton;

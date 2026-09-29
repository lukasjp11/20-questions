import { useEffect, useState } from 'react';
import { RotateCw } from 'lucide-react';

const SLOW_AFTER_MS = 15000;

const CardLoading = ({ categoryName, clueCount, reader, onRetry }) => {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div aria-busy="true">
      <div className="mb-6 w-full min-h-[64px] px-4 py-3 rounded-board bg-board-gold/80 flex items-center gap-3" aria-hidden="true">
        <span className="text-[10px] uppercase tracking-[1.5px] font-bold text-[#2c2520]/50">Svar</span>
        <span className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map(i => (
            <span key={i} className="w-2 h-2 rounded-full bg-[#2c2520]/30 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </span>
      </div>

      <div className="mb-6 min-h-[52px] flex flex-col items-center justify-center text-center" role="status">
        {slow ? (
          <>
            <p className="text-sm text-board-text-secondary">Det tager længere end normalt.</p>
            <button
              onClick={onRetry}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-board text-sm font-semibold bg-board-surface-active border border-[rgba(212,168,84,0.2)] text-board-gold"
            >
              <RotateCw className="w-4 h-4" />
              Prøv igen
            </button>
          </>
        ) : (
          <p className="text-sm text-board-text-muted">
            Laver et nyt kort{categoryName ? ` · ${categoryName}` : ''}…
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[11px] font-bold text-board-text-dimmer uppercase tracking-[1.5px]">Ledetråde</h3>
      </div>
      {reader ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2" aria-hidden="true">
          {Array.from({ length: clueCount }, (_, i) => (
            <div key={i} className="p-3 rounded-board bg-board-surface-alt border border-[rgba(212,168,84,0.05)] flex items-center gap-2 animate-pulse" style={{ animationDelay: `${(i % 5) * 120}ms` }}>
              <span className="w-4 h-4 rounded-full border-2 border-board-text-faint/60 flex-shrink-0" />
              <span className="w-8 font-semibold tabular-nums text-board-text-faint">#{i + 1}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full p-3 rounded-board border-[1.5px] border-dashed border-[rgba(212,168,84,0.15)] text-center text-board-text-faint font-semibold animate-pulse" aria-hidden="true">
          Vend ledetråd 1
        </div>
      )}
    </div>
  );
};

export default CardLoading;

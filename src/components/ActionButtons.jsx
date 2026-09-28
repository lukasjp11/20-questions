import { Shuffle } from 'lucide-react';

const ActionButtons = ({ onNext, loading, primary, label, readyCategoryName }) => (
  <div className="mb-6">
    <button
      onClick={onNext}
      disabled={loading}
      className={`w-full px-6 py-3.5 rounded-board font-semibold disabled:opacity-50 transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
        primary
          ? 'bg-board-gold text-board-bg hover:bg-board-gold-muted'
          : 'bg-board-surface-active border-[1.5px] border-[rgba(212,168,84,0.15)] text-board-text-secondary hover:border-[rgba(212,168,84,0.3)] hover:text-board-gold'
      }`}
    >
      <Shuffle className="w-4 h-4" />
      {label}
      {readyCategoryName && (
        <span className={`text-xs font-medium ${primary ? 'text-board-bg/60' : 'text-board-text-dim'}`}>
          · {readyCategoryName} er klar
        </span>
      )}
    </button>
  </div>
);

export default ActionButtons;

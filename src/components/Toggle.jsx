const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-[4px] transition-colors ${
      checked ? 'bg-board-gold' : 'bg-[rgba(212,168,84,0.12)]'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 rounded-[3px] transform transition-transform ${
        checked ? 'translate-x-6 bg-board-bg' : 'translate-x-1 bg-board-text-dim'
      }`}
    />
  </button>
);

export default Toggle;

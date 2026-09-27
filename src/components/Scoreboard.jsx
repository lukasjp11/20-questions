const Scoreboard = ({ teamNames, scores, turn, playing }) => (
  <div className="mb-5 grid gap-2" style={{ gridTemplateColumns: `repeat(${teamNames.length}, minmax(0, 1fr))` }}>
    {teamNames.map((name, i) => {
      const active = playing && i === turn;
      return (
        <div
          key={i}
          aria-current={active ? 'true' : undefined}
          className={`px-3 py-2 rounded-board border-[1.5px] text-center transition-colors ${
            active ? 'border-board-gold bg-board-surface-active' : 'border-[rgba(212,168,84,0.08)] bg-board-surface-alt'
          }`}
        >
          <p className={`text-xs truncate ${active ? 'text-board-gold font-semibold' : 'text-board-text-dim'}`}>{name}</p>
          <p className="text-xl font-bold text-board-text tabular-nums">{scores[i] ?? 0}</p>
        </div>
      );
    })}
  </div>
);

export default Scoreboard;

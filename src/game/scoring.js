export const TARGET_SOLVE_FRACTION = 0.55;
const HISTORY_LIMIT = 100;

export const pointsFor = (cluesUsed, total) => Math.max(1, total - Math.max(1, cluesUsed) + 1);

export function resultOf(game) {
  const total = game.clues.length;
  if (game.status === 'solved') {
    const cluesUsed = Math.max(1, game.revealed.length);
    return { solved: true, cluesUsed, total, points: pointsFor(cluesUsed, total), team: game.solvedBy };
  }
  if (game.status === 'gaveUp') {
    return { solved: false, cluesUsed: game.revealed.length, total, points: 0, team: null };
  }
  return null;
}

export function addToHistory(history, result, category, item) {
  const entry = {
    category,
    item,
    solved: result.solved,
    cluesUsed: result.cluesUsed,
    total: result.total,
    at: Date.now(),
  };
  return [...history, entry].slice(-HISTORY_LIMIT);
}

export function summarize(history) {
  if (!history.length) return null;
  const solved = history.filter(h => h.solved);
  return {
    played: history.length,
    solvedShare: solved.length / history.length,
    averageClues: solved.length ? solved.reduce((n, h) => n + h.cluesUsed, 0) / solved.length : null,
  };
}

const clamp = (v) => Math.min(100, Math.max(0, Math.round(v)));

export function adjustDifficulty({ difficulty, clueDifficulty }, result) {
  if (!result || !result.total) return null;
  const fraction = result.solved ? result.cluesUsed / result.total : 1.25;
  const miss = fraction - TARGET_SOLVE_FRACTION;
  if (Math.abs(miss) < 0.15) return null;
  const direction = miss < 0 ? 1 : -1;
  const step = Math.abs(miss) > 0.35 ? 10 : 5;
  const next = {
    difficulty: clamp(difficulty + direction * Math.round(step / 2)),
    clueDifficulty: clamp(clueDifficulty + direction * step),
  };
  if (next.difficulty === difficulty && next.clueDifficulty === clueDifficulty) return null;
  return next;
}

import { adjustDifficulty, addToHistory, pointsFor, resultOf, summarize } from './scoring';

const game = (status, revealed, total = 10, solvedBy = null) => ({
  status,
  revealed: Array.from({ length: revealed }, (_, i) => i),
  clues: Array.from({ length: total }, () => ({ text: 'x', special: false })),
  solvedBy,
});

describe('pointsFor', () => {
  it('rewards guessing early and never drops below one point', () => {
    expect(pointsFor(1, 10)).toBe(10);
    expect(pointsFor(4, 10)).toBe(7);
    expect(pointsFor(10, 10)).toBe(1);
    expect(pointsFor(0, 10)).toBe(10);
  });
});

describe('resultOf', () => {
  it('scores solved and given-up cards and ignores unfinished ones', () => {
    expect(resultOf(game('solved', 4, 10, 1))).toEqual({ solved: true, cluesUsed: 4, total: 10, points: 7, team: 1 });
    expect(resultOf(game('gaveUp', 10))).toMatchObject({ solved: false, points: 0 });
    expect(resultOf(game('playing', 3))).toBeNull();
  });
});

describe('history and summary', () => {
  it('keeps the latest results and summarizes them', () => {
    let h = [];
    h = addToHistory(h, { solved: true, cluesUsed: 4, total: 10 }, 'ting', 'Diskette');
    h = addToHistory(h, { solved: false, cluesUsed: 10, total: 10 }, 'sted', 'Petra');
    h = addToHistory(h, { solved: true, cluesUsed: 6, total: 10 }, 'person', 'Bohr');
    expect(summarize(h)).toEqual({ played: 3, solvedShare: 2 / 3, averageClues: 5 });
    expect(summarize([])).toBeNull();
  });
});

describe('adjustDifficulty', () => {
  const base = { difficulty: 40, clueDifficulty: 80 };

  it('makes the game harder when players guess very early', () => {
    expect(adjustDifficulty(base, { solved: true, cluesUsed: 1, total: 10 })).toEqual({ difficulty: 45, clueDifficulty: 90 });
    expect(adjustDifficulty(base, { solved: true, cluesUsed: 3, total: 10 })).toEqual({ difficulty: 43, clueDifficulty: 85 });
  });

  it('makes the game easier when players need every clue or give up', () => {
    expect(adjustDifficulty(base, { solved: true, cluesUsed: 8, total: 10 })).toEqual({ difficulty: 37, clueDifficulty: 75 });
    expect(adjustDifficulty(base, { solved: false, cluesUsed: 10, total: 10 })).toEqual({ difficulty: 35, clueDifficulty: 70 });
  });

  it('leaves difficulty alone near the target and at the limits', () => {
    expect(adjustDifficulty(base, { solved: true, cluesUsed: 5, total: 10 })).toBeNull();
    expect(adjustDifficulty({ difficulty: 100, clueDifficulty: 100 }, { solved: true, cluesUsed: 1, total: 10 })).toBeNull();
  });
});

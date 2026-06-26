import { getDifficultyLabel, makeRng, getPrompt } from './promptCore';

describe('getDifficultyLabel', () => {
  it('maps values to the expected band labels', () => {
    expect(getDifficultyLabel(0)).toBe('Børneniveau');
    expect(getDifficultyLabel(10)).toBe('Børneniveau');
    expect(getDifficultyLabel(25)).toBe('Meget let');
    expect(getDifficultyLabel(40)).toBe('Let');
    expect(getDifficultyLabel(60)).toBe('Normal');
    expect(getDifficultyLabel(75)).toBe('Svær');
    expect(getDifficultyLabel(90)).toBe('Meget svær');
    expect(getDifficultyLabel(100)).toBe('Ekspert');
  });
});

describe('makeRng', () => {
  it('is deterministic for a given seed', () => {
    const a = makeRng(42);
    const b = makeRng(42);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it('produces values in [0, 1)', () => {
    const rng = makeRng(7);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('getPrompt', () => {
  it('embeds the requested clue count and difficulties, and is seed-stable', () => {
    const rng = makeRng(123);
    const prompt = getPrompt('person', 40, [], '', 12, 80, 10, 40, rng);
    expect(typeof prompt).toBe('string');
    expect(prompt).toContain('12 LEDETRÅDE');
    expect(prompt).toContain('svar-sværhed: 40%');
    expect(prompt).toContain('ledetråds-sværhed: 80%');

    const again = getPrompt('person', 40, [], '', 12, 80, 10, 40, makeRng(123));
    expect(again).toBe(prompt);
  });

  it('omits the age block for child-friendly age ranges', () => {
    const prompt = getPrompt('ting', 30, [], '', 10, 50, 8, 30, makeRng(1));
    expect(prompt).not.toContain('SPILLERNES ALDER');
  });
});

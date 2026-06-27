import { getDifficultyLabel } from './promptCore';

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

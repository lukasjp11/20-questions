import { DIFFICULTY_PRESETS, matchPreset, presetValues } from './presets';

describe('difficulty presets', () => {
  it('recognises settings that match a preset exactly', () => {
    const family = DIFFICULTY_PRESETS.find(p => p.id === 'family');
    expect(matchPreset({ ...presetValues(family), numberOfClues: 10 })).toBe(family);
    expect(matchPreset({ ...presetValues(family), difficulty: 26 })).toBeNull();
  });

  it('uses the family preset as the default for new players', async () => {
    const { render, screen } = await import('@testing-library/react');
    const { MemoryRouter } = await import('react-router');
    const { GameProvider } = await import('../context/GameContext');
    const Instructions = (await import('../components/Instructions')).default;
    localStorage.clear();
    render(<MemoryRouter><GameProvider><Instructions onStartRandom={() => {}} /></GameProvider></MemoryRouter>);
    expect(screen.getByText('Familie')).toBeInTheDocument();
  });

  it('orders presets from easiest to hardest', () => {
    const levels = DIFFICULTY_PRESETS.map(p => p.difficulty);
    expect([...levels].sort((a, b) => a - b)).toEqual(levels);
  });
});

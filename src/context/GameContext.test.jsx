import { render, screen } from '@testing-library/react';
import { GameProvider } from './GameContext';
import { useGame } from './useGame';

const Show = () => {
  const { settings } = useGame();
  return <p>{`${settings.mode} ${settings.difficulty}/${settings.clueDifficulty}`}</p>;
};

const renderWith = (stored) => {
  localStorage.clear();
  for (const [k, v] of Object.entries(stored)) localStorage.setItem(k, JSON.stringify(v));
  render(<GameProvider><Show /></GameProvider>);
};

describe('settings migration', () => {
  it('starts new phones in Oplæser on the Voksne preset', () => {
    renderWith({});
    expect(screen.getByText('reader 48/55')).toBeInTheDocument();
  });

  it('moves old phones to Oplæser and the old Voksne values to the new ones once', () => {
    renderWith({ mode: 'guess', difficulty: 55, clueDifficulty: 55, ageRangeMin: 18, ageRangeMax: 65 });
    expect(screen.getByText('reader 48/55')).toBeInTheDocument();
    expect(localStorage.getItem('settingsVersion')).toBe('3');
  });

  it('keeps custom difficulty and later choices', () => {
    renderWith({ mode: 'guess', difficulty: 70, clueDifficulty: 55, settingsVersion: 3 });
    expect(screen.getByText('guess 70/55')).toBeInTheDocument();
  });

  it('only moves the difficulty for phones on version 2', () => {
    renderWith({ mode: 'guess', difficulty: 55, clueDifficulty: 55, ageRangeMin: 18, ageRangeMax: 65, settingsVersion: 2 });
    expect(screen.getByText('guess 48/55')).toBeInTheDocument();
  });
});

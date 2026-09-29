import { render, screen } from '@testing-library/react';
import { GameProvider } from './GameContext';
import { useGame } from './useGame';

const Show = () => {
  const { settings } = useGame();
  return <p>{`${settings.mode} ${settings.difficulty}/${settings.clueDifficulty} ${settings.activeCategories.join(',')}`}</p>;
};

const renderWith = (stored) => {
  localStorage.clear();
  for (const [k, v] of Object.entries(stored)) localStorage.setItem(k, JSON.stringify(v));
  render(<GameProvider><Show /></GameProvider>);
};

describe('settings migration', () => {
  it('replaces Begivenhed with the new default four once', () => {
    renderWith({ settingsVersion: 3, activeCategories: ['person', 'sted', 'ting', 'begivenhed'] });
    expect(screen.getByText('reader 48/55 person,sted,ting,aarstal')).toBeInTheDocument();
  });

  it('starts new phones in Oplæser on the Voksne preset', () => {
    renderWith({});
    expect(screen.getByText('reader 48/55 person,sted,ting,aarstal')).toBeInTheDocument();
  });

  it('moves old phones to Oplæser and the old Voksne values to the new ones once', () => {
    renderWith({ mode: 'guess', difficulty: 55, clueDifficulty: 55, ageRangeMin: 18, ageRangeMax: 65 });
    expect(screen.getByText('reader 48/55 person,sted,ting,aarstal')).toBeInTheDocument();
    expect(localStorage.getItem('settingsVersion')).toBe('4');
  });

  it('keeps custom difficulty and later choices', () => {
    renderWith({ mode: 'guess', difficulty: 70, clueDifficulty: 55, settingsVersion: 4, activeCategories: ['dyr', 'musik', 'natur', 'sport'] });
    expect(screen.getByText('guess 70/55 dyr,musik,natur,sport')).toBeInTheDocument();
  });

  it('only moves the difficulty for phones on version 2', () => {
    renderWith({ mode: 'guess', difficulty: 55, clueDifficulty: 55, ageRangeMin: 18, ageRangeMax: 65, settingsVersion: 2 });
    expect(screen.getByText('guess 48/55 person,sted,ting,aarstal')).toBeInTheDocument();
  });
});

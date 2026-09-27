import { act, fireEvent, render, screen } from '@testing-library/react';
import { useReducer } from 'react';
import AnswerBox from './AnswerBox';
import { gameReducer, initialGame } from '../game/gameReducer';

const playing = {
  ...initialGame,
  status: 'playing',
  item: 'Diskette',
  acceptedAnswers: ['Diskette', 'Disketten'],
  clues: [{ text: 'a', special: false }],
};

const Harness = () => {
  const [game, dispatch] = useReducer(gameReducer, playing);
  return <AnswerBox game={game} dispatch={dispatch} />;
};

describe('AnswerBox', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('keeps the answer hidden on a quick tap of the give-up button', () => {
    render(<Harness />);
    const giveUp = screen.getByRole('button', { name: 'Hold for at give op' });
    fireEvent.pointerDown(giveUp);
    act(() => vi.advanceTimersByTime(200));
    fireEvent.pointerUp(giveUp);
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByText('Diskette')).not.toBeInTheDocument();
  });

  it('reveals the answer after holding the give-up button', () => {
    render(<Harness />);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Hold for at give op' }));
    act(() => vi.advanceTimersByTime(800));
    expect(screen.getByText('Diskette')).toBeInTheDocument();
  });

  it('reveals the answer on a correct guess and flags a wrong one', () => {
    render(<Harness />);
    const input = screen.getByRole('textbox', { name: 'Dit gæt' });
    fireEvent.change(input, { target: { value: 'floppy' } });
    fireEvent.click(screen.getByRole('button', { name: 'Gæt' }));
    expect(screen.getByText('»floppy« er forkert.')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Forkerte gæt' })).toHaveTextContent('floppy');

    fireEvent.change(input, { target: { value: 'disket' } });
    fireEvent.click(screen.getByRole('button', { name: 'Gæt' }));
    expect(screen.getByText(/Tæt på!/)).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'disketten' } });
    fireEvent.click(screen.getByRole('button', { name: 'Gæt' }));
    expect(screen.getByText('Diskette')).toBeInTheDocument();
  });
});

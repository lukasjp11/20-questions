import { act, fireEvent, render, screen } from '@testing-library/react';
import { useReducer } from 'react';
import AnswerBox from './AnswerBox';
import { gameReducer, initialGame } from '../game/gameReducer';
import { checkGuess } from '../utils/api';

vi.mock('../utils/api', () => ({ checkGuess: vi.fn() }));

const playing = {
  ...initialGame,
  status: 'playing',
  category: 'ting',
  item: 'Diskette',
  acceptedAnswers: ['Diskette', 'Disketten'],
  clues: [{ text: 'a', special: false }],
};

const Harness = ({ mode = 'guess' }) => {
  const [game, dispatch] = useReducer(gameReducer, { ...playing, mode });
  return <AnswerBox game={game} dispatch={dispatch} />;
};

const guess = async (text) => {
  fireEvent.change(screen.getByRole('textbox', { name: 'Dit gæt' }), { target: { value: text } });
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Gæt' }));
  });
};

describe('AnswerBox', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    checkGuess.mockReset();
  });
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

  it('asks the server about guesses it cannot match itself', async () => {
    checkGuess.mockResolvedValueOnce('wrong').mockResolvedValueOnce('close').mockResolvedValueOnce('correct');
    render(<Harness />);

    await guess('floppy');
    expect(screen.getByText('»floppy« er forkert.')).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Forkerte gæt' })).not.toBeInTheDocument();

    await guess('usb-stik');
    expect(screen.getByText(/Tæt på!/)).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Forkerte gæt' })).toHaveTextContent('floppy');

    await guess('floppy disk');
    expect(screen.getByText('Diskette')).toBeInTheDocument();
    expect(checkGuess).toHaveBeenCalledTimes(3);
    expect(checkGuess).toHaveBeenLastCalledWith({ category: 'ting', item: 'Diskette', accept: ['Diskette', 'Disketten'], guess: 'floppy disk' });
  });

  it('accepts a local match without asking the server and falls back to local rules when the server is down', async () => {
    checkGuess.mockResolvedValue(null);
    render(<Harness />);
    await guess('disket');
    expect(screen.getByText(/Tæt på!/)).toBeInTheDocument();
    await guess('disketten');
    expect(screen.getByText('Diskette')).toBeInTheDocument();
    expect(checkGuess).toHaveBeenCalledTimes(1);
  });

  it('hides the answer in reader mode until it is tapped, with no result buttons', () => {
    render(<Harness mode="reader" />);
    expect(screen.queryByText('Diskette')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Gættet!' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Vis svar' }));
    expect(screen.getByText('Diskette')).toBeInTheDocument();
  });

  it('lets the reader see the answer in Trinvis, with no guess field', () => {
    render(<Harness mode="ladder" />);
    expect(screen.queryByRole('textbox', { name: 'Dit gæt' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Vis svar' }));
    expect(screen.getByText('Diskette')).toBeInTheDocument();
  });
});

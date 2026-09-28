import { gameReducer, initialGame, restoreGame } from './gameReducer';

const card = {
  item: 'Diskette',
  acceptedAnswers: ['Diskette', 'Disketten'],
  clues: [
    { text: 'a', special: false },
    { text: 'b', special: false },
    { text: 'c', special: false },
  ],
};

const run = (actions, state = initialGame) => actions.reduce(gameReducer, state);
const ready = (mode, teamCount = 0, firstTurn = 0) =>
  run([
    { type: 'start', category: 'ting', mode, teamCount, firstTurn },
    { type: 'itemFound', item: 'Diskette' },
    { type: 'cardReady', ...card },
  ]);

describe('generation', () => {
  it('moves through loading, streaming and playing', () => {
    let s = gameReducer(initialGame, { type: 'start', category: 'ting', mode: 'reader' });
    expect(s).toMatchObject({ status: 'loading', category: 'ting', answerVisible: false, teamCount: 0 });
    s = gameReducer(s, { type: 'itemFound', item: 'Diskette' });
    expect(s).toMatchObject({ status: 'streaming', item: 'Diskette' });
    s = gameReducer(s, { type: 'cardReady', ...card });
    expect(s).toMatchObject({ status: 'playing', clues: card.clues });
  });

  it('hides the answer in both modes and ignores teams in reader mode', () => {
    expect(ready('guess')).toMatchObject({ answerVisible: false });
    expect(ready('reader')).toMatchObject({ answerVisible: false });
    expect(ready('reader', 3)).toMatchObject({ teamCount: 0 });
  });

  it('ignores a late cardReady after a failure', () => {
    const s = run([
      { type: 'start', category: 'ting', mode: 'guess' },
      { type: 'failed', error: 'boom' },
      { type: 'cardReady', ...card },
    ]);
    expect(s).toMatchObject({ status: 'idle', error: 'boom', clues: [] });
  });
});

describe('reader mode', () => {
  it('toggles any clue and the answer, and never ends the round', () => {
    let s = run([{ type: 'toggleClue', index: 2 }, { type: 'toggleClue', index: 0 }], ready('reader'));
    expect(s.revealed).toEqual([2, 0]);
    s = gameReducer(s, { type: 'toggleClue', index: 2 });
    expect(s.revealed).toEqual([0]);
    expect(gameReducer(s, { type: 'guess', text: 'Diskette' })).toBe(s);
    expect(gameReducer(s, { type: 'readerResult', solved: true })).toBe(s);
    s = gameReducer(s, { type: 'setAnswerVisible', visible: true });
    expect(s).toMatchObject({ status: 'playing', answerVisible: true });
    expect(gameReducer(s, { type: 'setAnswerVisible', visible: false }).answerVisible).toBe(false);
  });
});

describe('solo guess mode', () => {
  it('trusts the server verdict for guesses the local matcher does not know', () => {
    const playing = ready('guess');
    expect(gameReducer(playing, { type: 'guess', text: 'floppy disk', verdict: 'correct' })).toMatchObject({ status: 'solved' });
    expect(gameReducer(playing, { type: 'guess', text: 'usb', verdict: 'close' }).lastGuess).toEqual({ text: 'usb', close: true });
    expect(gameReducer(playing, { type: 'guess', text: 'disket', verdict: 'wrong' }).lastGuess).toEqual({ text: 'disket', close: false });
    expect(gameReducer(playing, { type: 'guess', text: 'disket' }).lastGuess).toEqual({ text: 'disket', close: true });
  });

  it('reveals clues in order and solves on a correct guess', () => {
    let s = run([{ type: 'revealNext' }, { type: 'revealNext' }], ready('guess'));
    expect(s.revealed).toEqual([0, 1]);
    expect(gameReducer(s, { type: 'toggleClue', index: 2 })).toBe(s);
    s = gameReducer(s, { type: 'guess', text: ' disketten ' });
    expect(s).toMatchObject({ status: 'solved', answerVisible: true, solvedBy: null });
  });

  it('records distinct wrong guesses and flags close ones', () => {
    let s = run([
      { type: 'guess', text: 'CD-rom' },
      { type: 'guess', text: ' cd-ROM ' },
      { type: 'guess', text: '   ' },
      { type: 'guess', text: 'diskete' },
    ], ready('guess'));
    expect(s.status).toBe('playing');
    expect(s.wrongGuesses).toEqual(['CD-rom', 'diskete']);
    expect(s.lastGuess).toEqual({ text: 'diskete', close: true });
    s = gameReducer(s, { type: 'revealNext' });
    expect(s.lastGuess).toBeNull();
  });

  it('keeps the answer hidden until the round is over', () => {
    const s = ready('guess');
    expect(gameReducer(s, { type: 'setAnswerVisible', visible: true })).toBe(s);
    const over = gameReducer(s, { type: 'giveUp' });
    expect(over).toMatchObject({ status: 'gaveUp', answerVisible: true });
    expect(gameReducer(over, { type: 'guess', text: 'Diskette' })).toBe(over);
    expect(gameReducer(over, { type: 'revealNext' }).revealed).toEqual([0]);
  });
});

describe('teams', () => {
  it('makes each team reveal a clue before guessing, and rotates on a miss or pass', () => {
    let s = ready('guess', 3, 1);
    expect(s).toMatchObject({ turn: 1, awaitingReveal: true });
    expect(gameReducer(s, { type: 'guess', text: 'x' })).toBe(s);
    expect(gameReducer(s, { type: 'pass' })).toBe(s);

    s = gameReducer(s, { type: 'revealNext' });
    expect(gameReducer(s, { type: 'revealNext' })).toBe(s);
    s = gameReducer(s, { type: 'guess', text: 'CD-rom' });
    expect(s).toMatchObject({ turn: 2, awaitingReveal: true, revealed: [0] });

    s = run([{ type: 'revealNext' }, { type: 'pass' }], s);
    expect(s).toMatchObject({ turn: 0, awaitingReveal: true, revealed: [0, 1] });

    s = run([{ type: 'revealNext' }, { type: 'guess', text: 'Diskette' }], s);
    expect(s).toMatchObject({ status: 'solved', solvedBy: 0 });
  });

  it('lets teams keep guessing in turn once every clue is out', () => {
    let s = run([
      { type: 'revealNext' }, { type: 'pass' },
      { type: 'revealNext' }, { type: 'pass' },
      { type: 'revealNext' }, { type: 'pass' },
    ], ready('guess', 2));
    expect(s).toMatchObject({ awaitingReveal: false, turn: 1, revealed: [0, 1, 2] });
    s = gameReducer(s, { type: 'guess', text: 'nope' });
    expect(s).toMatchObject({ turn: 0, awaitingReveal: false });
  });
});

describe('restoreGame', () => {
  it('restores an active saved game', () => {
    const saved = gameReducer(ready('guess'), { type: 'revealNext' });
    expect(restoreGame(saved)).toEqual(saved);
  });

  it('drops a game that was still generating', () => {
    const s = gameReducer(initialGame, { type: 'start', category: 'ting', mode: 'guess' });
    expect(restoreGame(s)).toBe(initialGame);
  });

  it('migrates the legacy saved shape into reader mode', () => {
    const legacy = {
      currentCategory: 'ting',
      currentItem: 'Diskette',
      acceptedAnswers: ['Diskette'],
      clues: ['a', 'Ryk 3 felter frem'],
      revealedClues: [1],
      showAnswer: false,
    };
    expect(restoreGame(legacy, [{ text: 'Ryk 3 felter frem', weight: 3 }])).toMatchObject({
      status: 'playing',
      mode: 'reader',
      item: 'Diskette',
      revealed: [1],
      clues: [
        { text: 'a', special: false },
        { text: 'Ryk 3 felter frem', special: true },
      ],
    });
  });

  it('returns a fresh game for junk', () => {
    expect(restoreGame(null)).toBe(initialGame);
    expect(restoreGame({ foo: 1 })).toBe(initialGame);
  });
});

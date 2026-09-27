import { gameReducer, initialGame, restoreGame } from './gameReducer';

const card = {
  item: 'Diskette',
  acceptedAnswers: ['Diskette', 'Disketten'],
  clues: [
    { text: 'a', special: false },
    { text: 'b', special: false },
    { text: 'Ryk 3 felter frem', special: true },
  ],
};

const playing = () => {
  let s = gameReducer(initialGame, { type: 'start', category: 'ting', answerVisible: false });
  s = gameReducer(s, { type: 'itemFound', item: 'Diskette' });
  return gameReducer(s, { type: 'cardReady', ...card });
};

describe('gameReducer', () => {
  it('moves through loading, streaming and playing', () => {
    let s = gameReducer(initialGame, { type: 'start', category: 'ting', answerVisible: true });
    expect(s).toMatchObject({ status: 'loading', category: 'ting', answerVisible: true });
    s = gameReducer(s, { type: 'itemFound', item: 'Diskette' });
    expect(s).toMatchObject({ status: 'streaming', item: 'Diskette' });
    s = gameReducer(s, { type: 'cardReady', ...card });
    expect(s).toMatchObject({ status: 'playing', clues: card.clues });
  });

  it('ignores a late cardReady after a failure reset', () => {
    let s = gameReducer(initialGame, { type: 'start', category: 'ting', answerVisible: false });
    s = gameReducer(s, { type: 'failed', error: 'boom' });
    s = gameReducer(s, { type: 'cardReady', ...card });
    expect(s).toMatchObject({ status: 'idle', error: 'boom', clues: [] });
  });

  it('toggles clues only while a card is on the table', () => {
    expect(gameReducer(initialGame, { type: 'toggleClue', index: 0 })).toBe(initialGame);
    let s = gameReducer(playing(), { type: 'toggleClue', index: 1 });
    s = gameReducer(s, { type: 'toggleClue', index: 0 });
    expect(s.revealed).toEqual([1, 0]);
    s = gameReducer(s, { type: 'toggleClue', index: 1 });
    expect(s.revealed).toEqual([0]);
  });

  it('solves on a correct guess and reveals the answer', () => {
    const s = gameReducer(playing(), { type: 'guess', text: ' disketten ' });
    expect(s).toMatchObject({ status: 'solved', answerVisible: true });
  });

  it('records distinct wrong guesses', () => {
    let s = gameReducer(playing(), { type: 'guess', text: 'CD-rom' });
    s = gameReducer(s, { type: 'guess', text: ' cd-ROM ' });
    s = gameReducer(s, { type: 'guess', text: '   ' });
    s = gameReducer(s, { type: 'guess', text: 'USB-stik' });
    expect(s.status).toBe('playing');
    expect(s.wrongGuesses).toEqual(['CD-rom', 'USB-stik']);
  });

  it('gives up only while playing', () => {
    const s = gameReducer(playing(), { type: 'giveUp' });
    expect(s).toMatchObject({ status: 'gaveUp', answerVisible: true });
    expect(gameReducer(s, { type: 'guess', text: 'Diskette' }).status).toBe('gaveUp');
  });
});

describe('restoreGame', () => {
  it('restores an active saved game', () => {
    const saved = gameReducer(playing(), { type: 'toggleClue', index: 2 });
    expect(restoreGame(saved)).toEqual(saved);
  });

  it('drops a game that was still generating', () => {
    const s = gameReducer(initialGame, { type: 'start', category: 'ting', answerVisible: false });
    expect(restoreGame(s)).toBe(initialGame);
  });

  it('migrates the legacy saved shape and marks special clues', () => {
    const legacy = {
      currentCategory: 'ting',
      currentItem: 'Diskette',
      acceptedAnswers: ['Diskette'],
      clues: ['a', 'Ryk 3 felter frem'],
      revealedClues: [1],
      showAnswer: false,
    };
    const s = restoreGame(legacy, [{ text: 'Ryk 3 felter frem', weight: 3 }]);
    expect(s).toMatchObject({
      status: 'playing',
      category: 'ting',
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

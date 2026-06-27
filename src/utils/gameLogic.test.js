import {
  normalizeItem,
  isItemUsed,
  getUsedItemsInCategory,
  isSpecialClue,
  selectSpecialClues,
  shuffleArray,
  normalizeGuess,
  buildAcceptedAnswers,
  isCorrectGuess,
} from './gameLogic';

describe('normalizeItem', () => {
  it('lowercases, trims and collapses whitespace', () => {
    expect(normalizeItem('  Hello   World  ')).toBe('hello world');
  });

  it('strips diacritics so accented variants match', () => {
    expect(normalizeItem('Café')).toBe(normalizeItem('cafe'));
    expect(normalizeItem('Æbleskiver')).toBe('æbleskiver'.normalize('NFD').replace(/[̀-ͯ]/g, ''));
  });
});

describe('isItemUsed', () => {
  const used = [
    { category: 'person', item: 'Napoleon' },
    { category: 'sted', item: 'Paris' },
  ];

  it('matches case- and accent-insensitively', () => {
    expect(isItemUsed('napoleon', used)).toBe(true);
    expect(isItemUsed('NAPOLEON', used)).toBe(true);
  });

  it('respects the category filter when provided', () => {
    expect(isItemUsed('Paris', used, 'sted')).toBe(true);
    expect(isItemUsed('Paris', used, 'person')).toBe(false);
  });

  it('returns false for unseen items', () => {
    expect(isItemUsed('Berlin', used)).toBe(false);
  });
});

describe('getUsedItemsInCategory', () => {
  it('counts only items in the given category', () => {
    const used = [
      { category: 'person', item: 'A' },
      { category: 'person', item: 'B' },
      { category: 'ting', item: 'C' },
    ];
    expect(getUsedItemsInCategory(used, 'person')).toBe(2);
    expect(getUsedItemsInCategory(used, 'ting')).toBe(1);
    expect(getUsedItemsInCategory(used, 'sted')).toBe(0);
  });
});

describe('isSpecialClue', () => {
  const config = [{ text: 'Ryk 3 felter frem', weight: 3 }];

  it('matches ignoring case and surrounding whitespace', () => {
    expect(isSpecialClue('  ryk 3 felter frem ', config)).toBe(true);
  });

  it('returns false for regular clues', () => {
    expect(isSpecialClue('En helt almindelig ledetråd', config)).toBe(false);
  });
});

describe('selectSpecialClues', () => {
  const config = [
    { text: 'A', weight: 1 },
    { text: 'B', weight: 2 },
  ];

  it('returns the requested count', () => {
    expect(selectSpecialClues(config, 3)).toHaveLength(3);
  });

  it('returns an empty array for count 0 or empty config', () => {
    expect(selectSpecialClues(config, 0)).toEqual([]);
    expect(selectSpecialClues([], 3)).toEqual([]);
    expect(selectSpecialClues(undefined, 3)).toEqual([]);
  });

  it('only returns texts from the config', () => {
    const texts = config.map(c => c.text);
    selectSpecialClues(config, 10).forEach(t => expect(texts).toContain(t));
  });
});

describe('shuffleArray', () => {
  it('keeps the same elements and length without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleArray(input);
    expect(result).toHaveLength(input.length);
    expect([...result].sort()).toEqual([...input].sort());
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('normalizeGuess', () => {
  it('lowercases, strips accents and punctuation, and collapses whitespace', () => {
    expect(normalizeGuess('  H.C.  Andersen ')).toBe('hc andersen');
    expect(normalizeGuess('Café')).toBe('cafe');
  });
});

describe('buildAcceptedAnswers', () => {
  it('always puts the exact item first and dedupes case/accent variants', () => {
    const list = buildAcceptedAnswers('Elefant', ['elefant', 'Elefanten', 'Elephant']);
    expect(list[0]).toBe('Elefant');
    expect(list).toEqual(['Elefant', 'Elefanten', 'Elephant']);
  });

  it('falls back to just the item when accept is missing or empty', () => {
    expect(buildAcceptedAnswers('Træ')).toEqual(['Træ']);
    expect(buildAcceptedAnswers('Træ', [])).toEqual(['Træ']);
    expect(buildAcceptedAnswers('Træ', undefined)).toEqual(['Træ']);
  });

  it('caps the list length', () => {
    const many = Array.from({ length: 20 }, (_, i) => `svar ${i}`);
    expect(buildAcceptedAnswers('Item', many)).toHaveLength(10);
  });
});

describe('isCorrectGuess', () => {
  const accepted = buildAcceptedAnswers('Elefant', ['Elefanten']);

  it('accepts exact and normalized variants', () => {
    expect(isCorrectGuess('elefant', accepted)).toBe(true);
    expect(isCorrectGuess('  Elefant ', accepted)).toBe(true);
    expect(isCorrectGuess('Elefanten', accepted)).toBe(true);
  });

  it('rejects typos and wrong answers (no fuzzy matching)', () => {
    expect(isCorrectGuess('elefnat', accepted)).toBe(false);
    expect(isCorrectGuess('næsehorn', accepted)).toBe(false);
    expect(isCorrectGuess('', accepted)).toBe(false);
  });

  it('matches punctuation/spacing variants of names', () => {
    const names = buildAcceptedAnswers('H.C. Andersen', ['Hans Christian Andersen']);
    expect(isCorrectGuess('hc andersen', names)).toBe(true);
    expect(isCorrectGuess('Hans Christian Andersen', names)).toBe(true);
  });
});

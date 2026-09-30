import { act, renderHook } from '@testing-library/react';
import { useCardGenerator, buildCard } from './useCardGenerator';
import { generateCluesWithProgress } from '../utils/api';

vi.mock('../utils/api', () => ({ generateCluesWithProgress: vi.fn() }));

const settings = {
  mode: 'reader',
  teamCount: 0,
  difficulty: 40,
  clueDifficulty: 80,
  customTheme: '',
  numberOfClues: 4,
  numberOfSpecialClues: 1,
  specialCluesConfig: [{ text: 'Ryk 3 felter frem', weight: 1 }],
  ageRangeMin: 10,
  ageRangeMax: 40,
};

const respondWith = (item) => async (_body, { onItemFound }, signal) => {
  onItemFound(item);
  if (signal.aborted) {
    const err = new Error('aborted');
    err.name = 'AbortError';
    throw err;
  }
  return { item, clues: ['a', 'b', 'c', 'd'], sharpness: [4, 1, 3, 2], accept: [item] };
};

describe('buildCard', () => {
  it('mixes in special clues in reader mode', () => {
    const card = buildCard({ item: 'X', clues: ['a', 'b', 'c', 'd'] }, { mode: 'reader', regularCount: 3, specialTexts: ['S'] });
    expect(card.clues).toHaveLength(4);
    expect(card.clues.filter(c => c.special).map(c => c.text)).toEqual(['S']);
    expect(card.acceptedAnswers).toEqual(['X']);
  });

  it('keeps the server order from vague to obvious in guess mode and skips special clues', () => {
    const card = buildCard(
      { item: 'X', clues: ['a', 'b', 'c', 'd'], sharpness: [1, 2, 5, 4] },
      { mode: 'guess', regularCount: 4, specialTexts: ['S'] }
    );
    expect(card.clues.map(c => c.text)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('keeps the ladder order in Trinvis and never opens with a special clue', () => {
    for (let i = 0; i < 20; i++) {
      const card = buildCard({ item: 'X', clues: ['a', 'b', 'c', 'd'] }, { mode: 'ladder', regularCount: 3, specialTexts: ['S'] });
      expect(card.clues.filter(c => !c.special).map(c => c.text)).toEqual(['a', 'b', 'c']);
      expect(card.clues[0].text).toBe('a');
      expect(card.clues).toHaveLength(4);
    }
  });
});

describe('useCardGenerator', () => {
  beforeEach(() => {
    generateCluesWithProgress.mockReset();
  });

  it('retries when the model returns an already used item', async () => {
    generateCluesWithProgress
      .mockImplementationOnce(respondWith('Diskette'))
      .mockImplementationOnce(respondWith('Kassettebånd'));
    const dispatch = vi.fn();
    const addUsedItem = vi.fn();
    const used = [{ category: 'ting', item: 'diskette' }];

    const { result } = renderHook(() => useCardGenerator(dispatch, settings, used, addUsedItem));
    await act(() => result.current.generate('ting'));

    expect(generateCluesWithProgress).toHaveBeenCalledTimes(2);
    expect(generateCluesWithProgress.mock.calls[0][0]).toMatchObject({
      category: 'ting',
      settings: { numberOfClues: 3, usedItems: used },
    });
    expect(dispatch.mock.calls.map(([a]) => a.type)).toEqual(['start', 'itemFound', 'cardReady']);
    expect(dispatch.mock.calls[0][0]).toMatchObject({ mode: 'reader', teamCount: 0 });
    expect(dispatch.mock.calls[1][0].item).toBe('Kassettebånd');
    expect(addUsedItem).toHaveBeenCalledWith('ting', 'Kassettebånd');
  });

  it('asks for every clue from the model in guess mode', async () => {
    generateCluesWithProgress.mockImplementationOnce(respondWith('Diskette'));
    const dispatch = vi.fn();
    const { result } = renderHook(() => useCardGenerator(dispatch, { ...settings, mode: 'guess' }, [], vi.fn()));
    await act(() => result.current.generate('ting'));
    expect(generateCluesWithProgress.mock.calls[0][0].settings.numberOfClues).toBe(4);
    expect(dispatch.mock.calls[2][0].clues.every(c => !c.special)).toBe(true);
  });

  it('asks for ladder cards in Trinvis and Gæt selv, and any order in Oplæser', async () => {
    const orderFor = async (mode) => {
      generateCluesWithProgress.mockImplementationOnce(respondWith('Diskette'));
      const { result } = renderHook(() => useCardGenerator(vi.fn(), { ...settings, mode }, [], vi.fn()));
      await act(() => result.current.generate('ting'));
      return generateCluesWithProgress.mock.lastCall[0].settings.clueOrder;
    };
    expect(await orderFor('ladder')).toBe('ladder');
    expect(await orderFor('guess')).toBe('ladder');
    expect(await orderFor('reader')).toBe('any');
  });

  it('reports server errors', async () => {
    generateCluesWithProgress.mockRejectedValueOnce(new Error('Too many requests'));
    const dispatch = vi.fn();
    const { result } = renderHook(() => useCardGenerator(dispatch, settings, [], vi.fn()));
    await act(() => result.current.generate('sted'));
    expect(dispatch).toHaveBeenLastCalledWith({ type: 'failed', error: 'Too many requests' });
  });
});

import { act, renderHook } from '@testing-library/react';
import { useCardGenerator, buildCard } from './useCardGenerator';
import { generateCluesWithProgress } from '../utils/api';

vi.mock('../utils/api', () => ({ generateCluesWithProgress: vi.fn() }));

const settings = {
  difficulty: 40,
  clueDifficulty: 80,
  customTheme: '',
  hideAnswerOnGeneration: true,
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
  return { item, clues: ['a', 'b', 'c', 'd'], accept: [item] };
};

describe('buildCard', () => {
  it('mixes regular and special clues and keeps the requested count', () => {
    const card = buildCard({ item: 'X', clues: ['a', 'b', 'c', 'd'] }, 3, ['S']);
    expect(card.clues).toHaveLength(4);
    expect(card.clues.filter(c => c.special)).toEqual([{ text: 'S', special: true }]);
    expect(card.acceptedAnswers).toEqual(['X']);
  });
});

describe('useCardGenerator', () => {
  beforeEach(() => generateCluesWithProgress.mockReset());

  it('retries when the model returns an already used item', async () => {
    generateCluesWithProgress
      .mockImplementationOnce(respondWith('Diskette'))
      .mockImplementationOnce(respondWith('Kassettebånd'));
    const dispatch = vi.fn();
    const addUsedItem = vi.fn();
    const used = [{ category: 'ting', item: 'diskette' }];

    const { result } = renderHook(() => useCardGenerator(dispatch, settings, used, addUsedItem));
    await act(() => result.current('ting'));

    expect(generateCluesWithProgress).toHaveBeenCalledTimes(2);
    expect(generateCluesWithProgress.mock.calls[0][0]).toMatchObject({
      category: 'ting',
      settings: { numberOfClues: 3, usedItems: used },
    });
    const types = dispatch.mock.calls.map(([a]) => a.type);
    expect(types).toEqual(['start', 'itemFound', 'cardReady']);
    expect(dispatch.mock.calls[1][0].item).toBe('Kassettebånd');
    expect(addUsedItem).toHaveBeenCalledWith('ting', 'Kassettebånd');
  });

  it('reports server errors', async () => {
    generateCluesWithProgress.mockRejectedValueOnce(new Error('Too many requests'));
    const dispatch = vi.fn();
    const { result } = renderHook(() => useCardGenerator(dispatch, settings, [], vi.fn()));
    await act(() => result.current('sted'));
    expect(dispatch).toHaveBeenLastCalledWith({ type: 'failed', error: 'Too many requests' });
  });
});

import { StrictMode, useEffect } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
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

  it('orders clues from broad to sharp in guess mode and skips special clues', () => {
    const card = buildCard(
      { item: 'X', clues: ['a', 'b', 'c', 'd'], sharpness: [4, 1, 3, 2] },
      { mode: 'guess', regularCount: 4, specialTexts: ['S'] }
    );
    expect(card.clues.map(c => c.text)).toEqual(['b', 'd', 'c', 'a']);
  });
});

describe('useCardGenerator', () => {
  beforeEach(() => {
    generateCluesWithProgress.mockReset();
  });

  it('still prefetches when an effect asks for a card on a StrictMode double mount', async () => {
    generateCluesWithProgress.mockImplementation(async (body, handlers, signal) => {
      await new Promise(resolve => setTimeout(resolve, 0));
      return respondWith('Diskette')(body, handlers, signal);
    });
    const { result } = renderHook(() => {
      const generator = useCardGenerator(vi.fn(), settings, [], vi.fn());
      const { prefetch } = generator;
      useEffect(() => prefetch('ting'), [prefetch]);
      return generator;
    }, { wrapper: StrictMode });
    await waitFor(() => expect(result.current.prefetchedCategory).toBe('ting'));
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

  it('serves a prefetched card without a new request', async () => {
    generateCluesWithProgress.mockImplementationOnce(respondWith('Walkman'));
    const dispatch = vi.fn();
    const addUsedItem = vi.fn();
    const { result } = renderHook(() => useCardGenerator(dispatch, settings, [], addUsedItem));

    act(() => result.current.prefetch('ting', ['Diskette']));
    await waitFor(() => expect(result.current.prefetchedCategory).toBe('ting'));
    expect(generateCluesWithProgress.mock.calls[0][0].settings.usedItems).toEqual([{ category: 'ting', item: 'Diskette' }]);

    await act(() => result.current.generate('ting'));
    expect(generateCluesWithProgress).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls.map(([a]) => a.type)).toEqual(['start', 'itemFound', 'cardReady']);
    expect(addUsedItem).toHaveBeenCalledWith('ting', 'Walkman');
    expect(result.current.prefetchedCategory).toBeNull();
  });

  it('ignores a prefetched card for another category', async () => {
    generateCluesWithProgress
      .mockImplementationOnce(respondWith('Walkman'))
      .mockImplementationOnce(respondWith('Petra'));
    const dispatch = vi.fn();
    const { result } = renderHook(() => useCardGenerator(dispatch, settings, [], vi.fn()));
    act(() => result.current.prefetch('ting'));
    await waitFor(() => expect(result.current.prefetchedCategory).toBe('ting'));
    await act(() => result.current.generate('sted'));
    expect(generateCluesWithProgress).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls.at(-1)[0].item).toBe('Petra');
  });

  it('stops prefetching when the server says it cannot afford it', async () => {
    generateCluesWithProgress.mockImplementationOnce(async (_body, { onItemFound }) => {
      onItemFound('Walkman');
      return { item: 'Walkman', clues: ['a', 'b', 'c', 'd'], accept: ['Walkman'], prefetch: false };
    });
    const { result } = renderHook(() => useCardGenerator(vi.fn(), settings, [], vi.fn()));
    await act(() => result.current.generate('ting'));
    act(() => result.current.prefetch('sted'));
    expect(generateCluesWithProgress).toHaveBeenCalledTimes(1);
  });

  it('reports server errors', async () => {
    generateCluesWithProgress.mockRejectedValueOnce(new Error('Too many requests'));
    const dispatch = vi.fn();
    const { result } = renderHook(() => useCardGenerator(dispatch, settings, [], vi.fn()));
    await act(() => result.current.generate('sted'));
    expect(dispatch).toHaveBeenLastCalledWith({ type: 'failed', error: 'Too many requests' });
  });
});

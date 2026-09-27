import { useCallback, useEffect, useRef, useState } from 'react';
import { generateCluesWithProgress } from '../utils/api';
import {
  buildAcceptedAnswers,
  isItemUsed,
  selectSpecialClues,
  shuffleArray,
} from '../utils/gameLogic';

const MAX_ATTEMPTS = 3;
const DIFFICULTY_TOLERANCE = 10;

export function buildCard(result, { mode, regularCount, specialTexts = [] }) {
  const sharpness = Array.isArray(result.sharpness) ? result.sharpness : [];
  const regular = result.clues
    .slice(0, regularCount)
    .map((text, i) => ({ text, special: false, sharpness: sharpness[i] ?? null }));

  let clues;
  if (mode === 'guess') {
    const shuffled = shuffleArray(regular);
    clues = sharpness.length
      ? shuffled.sort((a, b) => (a.sharpness ?? 3) - (b.sharpness ?? 3))
      : shuffled;
  } else {
    clues = shuffleArray([...regular, ...specialTexts.map(text => ({ text, special: true, sharpness: null }))]);
  }

  return {
    item: result.item,
    acceptedAnswers: buildAcceptedAnswers(result.item, result.accept),
    clues,
  };
}

function clueCounts(settings) {
  if (settings.mode === 'guess') return { regularCount: settings.numberOfClues, specialCount: 0 };
  const specialCount = Math.min(settings.numberOfSpecialClues, Math.max(0, settings.numberOfClues - 1));
  return { regularCount: Math.max(1, settings.numberOfClues - specialCount), specialCount };
}

const requestKey = (category, settings) =>
  JSON.stringify([category, clueCounts(settings).regularCount, settings.customTheme, settings.ageRangeMin, settings.ageRangeMax]);

const closeEnough = (a, b) =>
  Math.abs(a.difficulty - b.difficulty) <= DIFFICULTY_TOLERANCE &&
  Math.abs(a.clueDifficulty - b.clueDifficulty) <= DIFFICULTY_TOLERANCE;

async function requestCard(category, settings, usedItems, { signal, onItemFound }) {
  const used = usedItems.filter(u => u.category === category);
  const body = {
    category,
    settings: {
      difficulty: settings.difficulty,
      clueDifficulty: settings.clueDifficulty,
      customTheme: settings.customTheme,
      numberOfClues: clueCounts(settings).regularCount,
      ageRangeMin: settings.ageRangeMin,
      ageRangeMax: settings.ageRangeMax,
      usedItems: used.slice(-20),
    },
  };

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal?.addEventListener('abort', abort);
    let duplicate = false;
    try {
      const result = await generateCluesWithProgress(
        body,
        {
          onItemFound: (item) => {
            if (isItemUsed(item, used)) {
              duplicate = true;
              controller.abort();
              return;
            }
            onItemFound?.(item);
          },
        },
        controller.signal
      );
      if (!result || !Array.isArray(result.clues)) throw new Error('Tomt svar fra serveren');
      if (isItemUsed(result.item, used)) {
        duplicate = true;
        continue;
      }
      return result;
    } catch (err) {
      if (duplicate && !signal?.aborted) continue;
      throw err;
    } finally {
      signal?.removeEventListener('abort', abort);
    }
  }
  throw new Error('Kunne ikke finde et nyt svar efter flere forsøg. Prøv igen.');
}

export function useCardGenerator(dispatch, settings, usedItems, addUsedItem) {
  const activeRef = useRef(null);
  const prefetchRef = useRef(null);
  const [prefetchedCategory, setPrefetchedCategory] = useState(null);
  const [prefetchAllowed, setPrefetchAllowed] = useState(true);

  useEffect(() => () => {
    activeRef.current?.abort();
    prefetchRef.current?.controller.abort();
  }, []);

  const deliver = useCallback((category, result) => {
    const specialTexts = selectSpecialClues(settings.specialCluesConfig, clueCounts(settings).specialCount);
    dispatch({
      type: 'cardReady',
      ...buildCard(result, { mode: settings.mode, regularCount: clueCounts(settings).regularCount, specialTexts }),
    });
    addUsedItem(category, result.item);
    setPrefetchAllowed(result.prefetch !== false);
  }, [dispatch, settings, addUsedItem]);

  const generate = useCallback(async (category, { firstTurn = 0 } = {}) => {
    activeRef.current?.abort();
    const controller = new AbortController();
    activeRef.current = controller;
    dispatch({ type: 'start', category, mode: settings.mode, teamCount: settings.teamCount, firstTurn });

    const pending = prefetchRef.current;
    if (pending && pending.key === requestKey(category, settings) && closeEnough(pending.settings, settings)) {
      prefetchRef.current = null;
      setPrefetchedCategory(null);
      try {
        const result = pending.result ?? (await pending.promise);
        if (activeRef.current !== controller) return;
        if (!isItemUsed(result.item, usedItems, category)) {
          dispatch({ type: 'itemFound', item: result.item });
          deliver(category, result);
          return;
        }
      } catch {
        if (activeRef.current !== controller) return;
      }
    }

    try {
      const result = await requestCard(category, settings, usedItems, {
        signal: controller.signal,
        onItemFound: item => dispatch({ type: 'itemFound', item }),
      });
      if (activeRef.current !== controller) return;
      deliver(category, result);
    } catch (err) {
      if (activeRef.current !== controller) return;
      dispatch({ type: 'failed', error: err.message || 'En fejl opstod. Prøv igen.' });
    }
  }, [dispatch, settings, usedItems, deliver]);

  const prefetch = useCallback((category, alsoAvoid = []) => {
    if (!prefetchAllowed) return;
    const key = requestKey(category, settings);
    const current = prefetchRef.current;
    if (current && current.key === key && closeEnough(current.settings, settings)) return;
    current?.controller.abort();

    const controller = new AbortController();
    const avoid = [...usedItems, ...alsoAvoid.map(item => ({ category, item }))];
    const entry = { key, category, settings, controller };
    entry.promise = requestCard(category, settings, avoid, { signal: controller.signal });
    entry.promise.then(
      (result) => {
        entry.result = result;
        if (prefetchRef.current === entry) setPrefetchedCategory(category);
      },
      () => {
        if (prefetchRef.current === entry) {
          prefetchRef.current = null;
          setPrefetchedCategory(null);
        }
      }
    );
    prefetchRef.current = entry;
    setPrefetchedCategory(null);
  }, [settings, usedItems, prefetchAllowed]);

  return { generate, prefetch, prefetchedCategory };
}

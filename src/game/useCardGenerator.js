import { useCallback, useEffect, useRef } from 'react';
import { generateCluesWithProgress } from '../utils/api';
import {
  buildAcceptedAnswers,
  isItemUsed,
  selectSpecialClues,
  shuffleArray,
} from '../utils/gameLogic';

const MAX_ATTEMPTS = 3;

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
      activeCategories: settings.activeCategories,
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

  useEffect(() => () => activeRef.current?.abort(), []);

  const deliver = useCallback((category, result) => {
    const specialTexts = selectSpecialClues(settings.specialCluesConfig, clueCounts(settings).specialCount);
    dispatch({
      type: 'cardReady',
      ...buildCard(result, { mode: settings.mode, regularCount: clueCounts(settings).regularCount, specialTexts }),
    });
    addUsedItem(category, result.item);
  }, [dispatch, settings, addUsedItem]);

  const generate = useCallback(async (category, { firstTurn = 0 } = {}) => {
    activeRef.current?.abort();
    const controller = new AbortController();
    activeRef.current = controller;
    dispatch({ type: 'start', category, mode: settings.mode, teamCount: settings.teamCount, firstTurn });

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

  return { generate };
}

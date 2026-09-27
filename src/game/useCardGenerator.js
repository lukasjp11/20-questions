import { useCallback, useEffect, useRef } from 'react';
import { generateCluesWithProgress } from '../utils/api';
import {
  buildAcceptedAnswers,
  isItemUsed,
  selectSpecialClues,
  shuffleArray,
} from '../utils/gameLogic';

const MAX_ATTEMPTS = 3;

export function buildCard(result, regularCount, specialTexts) {
  const regular = result.clues.slice(0, regularCount).map(text => ({ text, special: false }));
  const special = specialTexts.map(text => ({ text, special: true }));
  return {
    item: result.item,
    acceptedAnswers: buildAcceptedAnswers(result.item, result.accept),
    clues: shuffleArray([...regular, ...special]),
  };
}

export function useCardGenerator(dispatch, settings, usedItems, addUsedItem) {
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return useCallback(
    async (category) => {
      controllerRef.current?.abort();
      dispatch({ type: 'start', category, answerVisible: !settings.hideAnswerOnGeneration });

      const specialCount = Math.min(settings.numberOfSpecialClues, Math.max(0, settings.numberOfClues - 1));
      const regularCount = Math.max(1, settings.numberOfClues - specialCount);
      const requestBody = {
        category,
        settings: {
          difficulty: settings.difficulty,
          clueDifficulty: settings.clueDifficulty,
          customTheme: settings.customTheme,
          numberOfClues: regularCount,
          ageRangeMin: settings.ageRangeMin,
          ageRangeMax: settings.ageRangeMax,
          usedItems: usedItems.filter(u => u.category === category).slice(-20),
        },
      };

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const controller = new AbortController();
        controllerRef.current = controller;
        let duplicate = false;

        try {
          const result = await generateCluesWithProgress(
            requestBody,
            {
              onItemFound: (item) => {
                if (isItemUsed(item, usedItems, category)) {
                  duplicate = true;
                  controller.abort();
                  return;
                }
                dispatch({ type: 'itemFound', item });
              },
            },
            controller.signal
          );

          if (controllerRef.current !== controller) return;
          if (!result || !Array.isArray(result.clues)) throw new Error('Tomt svar fra serveren');
          dispatch({
            type: 'cardReady',
            ...buildCard(result, regularCount, selectSpecialClues(settings.specialCluesConfig, specialCount)),
          });
          addUsedItem(category, result.item);
          return;
        } catch (err) {
          if (controllerRef.current !== controller) return;
          if (duplicate) continue;
          dispatch({ type: 'failed', error: err.message || 'En fejl opstod. Prøv igen.' });
          return;
        }
      }

      dispatch({ type: 'failed', error: 'Kunne ikke finde et nyt svar efter flere forsøg. Prøv igen.' });
    },
    [dispatch, settings, usedItems, addUsedItem]
  );
}

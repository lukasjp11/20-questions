export const normalizeItem = (item) => {
  return item
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
};

export const normalizeGuess = (value) => {
  return (value || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const buildAcceptedAnswers = (item, accept = [], max = 10) => {
  const candidates = [item, ...(Array.isArray(accept) ? accept : [])]
    .filter(value => typeof value === 'string' && value.trim());
  const seen = new Set();
  const result = [];
  for (const candidate of candidates) {
    const key = normalizeGuess(candidate);
    if (key && !seen.has(key)) {
      seen.add(key);
      result.push(candidate.trim());
    }
  }
  return result.slice(0, max);
};

const DANISH_ENDINGS = ['erne', 'ene', 'er', 'en', 'et', 'ne', 'e', 'n', 't'];

const sameAnswer = (guess, answer) => {
  if (guess === answer) return true;
  if (answer.length < 4 || !guess.startsWith(answer)) return false;
  return DANISH_ENDINGS.includes(guess.slice(answer.length));
};

export const isCorrectGuess = (guess, acceptedAnswers = []) => {
  const normalized = normalizeGuess(guess);
  if (!normalized) return false;
  return acceptedAnswers.some(answer => sameAnswer(normalized, normalizeGuess(answer)));
};

const editDistance = (a, b) => {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[b.length];
};

export const isCloseGuess = (guess, acceptedAnswers = []) => {
  const g = normalizeGuess(guess);
  if (!g || isCorrectGuess(guess, acceptedAnswers)) return false;
  const guessWords = g.split(' ');
  return acceptedAnswers.some(answer => {
    const a = normalizeGuess(answer);
    const limit = a.length >= 8 ? 2 : a.length >= 4 ? 1 : 0;
    if (limit && editDistance(g, a) <= limit) return true;
    const answerWords = a.split(' ').filter(w => w.length >= 4);
    return guessWords.some(w => answerWords.includes(w));
  });
};

export const isItemUsed = (item, usedItems, category = null) => {
  const normalized = normalizeItem(item);
  return usedItems.some(used => {
    if (category && used.category !== category) return false;
    return normalizeItem(used.item) === normalized;
  });
};

export const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  export const getUsedItemsInCategory = (usedItems, category) => {
    return usedItems.filter(item => item.category === category).length;
  };
  
  export const isSpecialClue = (clue, specialCluesConfig = []) => {
    return specialCluesConfig.some(config => 
      clue.toLowerCase().trim() === config.text.toLowerCase().trim()
    );
  };
  
  export const selectSpecialClues = (specialCluesConfig, count) => {
    if (!specialCluesConfig || specialCluesConfig.length === 0 || count === 0) {
      return [];
    }
  
    const selected = [];
    
    const totalWeight = specialCluesConfig.reduce((sum, clue) => sum + clue.weight, 0);
    
    for (let i = 0; i < count; i++) {
      let random = Math.random() * totalWeight;
      
      let weightSum = 0;
      for (let j = 0; j < specialCluesConfig.length; j++) {
        weightSum += specialCluesConfig[j].weight;
        if (random <= weightSum) {
          selected.push(specialCluesConfig[j].text);
          break;
        }
      }
    }
    
    return selected;
  };
  
  export const saveToLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  
  export const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  };
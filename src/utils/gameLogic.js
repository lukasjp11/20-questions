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
  // Check if the clue exactly matches any special clue text
  return specialCluesConfig.some(config => 
    clue.toLowerCase().trim() === config.text.toLowerCase().trim()
  );
};

// Select special clues based on weights
export const selectSpecialClues = (specialCluesConfig, count) => {
  if (!specialCluesConfig || specialCluesConfig.length === 0 || count === 0) {
    return [];
  }

  // Calculate total weight
  const totalWeight = specialCluesConfig.reduce((sum, clue) => sum + clue.weight, 0);
  
  const selected = [];
  const availableClues = [...specialCluesConfig];
  
  for (let i = 0; i < count && availableClues.length > 0; i++) {
    // Random number between 0 and totalWeight
    let random = Math.random() * availableClues.reduce((sum, clue) => sum + clue.weight, 0);
    
    // Find which clue this random number corresponds to
    let weightSum = 0;
    for (let j = 0; j < availableClues.length; j++) {
      weightSum += availableClues[j].weight;
      if (random <= weightSum) {
        selected.push(availableClues[j].text);
        // Remove selected clue to avoid duplicates
        availableClues.splice(j, 1);
        break;
      }
    }
  }
  
  return selected;
};

// Insert special clues at random positions
export const insertSpecialClues = (regularClues, specialClueTexts) => {
  if (!specialClueTexts || specialClueTexts.length === 0) {
    return regularClues;
  }

  const result = [...regularClues];
  const availablePositions = Array.from({ length: regularClues.length }, (_, i) => i);
  
  // Shuffle positions to get random insertion points
  const shuffledPositions = shuffleArray(availablePositions);
  
  // Insert special clues at random positions
  specialClueTexts.forEach((specialClue, index) => {
    if (index < shuffledPositions.length) {
      result[shuffledPositions[index]] = specialClue;
    }
  });
  
  return result;
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
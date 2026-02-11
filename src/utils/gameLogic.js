export const normalizeItem = (item) => {
  return item
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
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
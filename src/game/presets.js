export const DIFFICULTY_PRESETS = [
  { id: 'kids', label: 'Børn', description: 'Kendte ting og enkle ord', difficulty: 5, clueDifficulty: 20, ageRangeMin: 6, ageRangeMax: 12 },
  { id: 'family', label: 'Familie', description: 'Børn og voksne sammen', difficulty: 25, clueDifficulty: 45, ageRangeMin: 8, ageRangeMax: 70 },
  { id: 'adults', label: 'Voksne', description: 'Almen viden, snedige ledetråde', difficulty: 48, clueDifficulty: 55, ageRangeMin: 18, ageRangeMax: 65 },
  { id: 'experts', label: 'Quiz-nørder', description: 'Sjældne svar, kryptiske ledetråde', difficulty: 85, clueDifficulty: 85, ageRangeMin: 18, ageRangeMax: 70 },
];

const KEYS = ['difficulty', 'clueDifficulty', 'ageRangeMin', 'ageRangeMax'];

export const matchPreset = (settings) =>
  DIFFICULTY_PRESETS.find(p => KEYS.every(k => p[k] === settings[k])) ?? null;

export const presetValues = (preset) => Object.fromEntries(KEYS.map(k => [k, preset[k]]));

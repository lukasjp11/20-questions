export const DIFFICULTY_PRESETS = [
  { id: 'kids', label: 'Børn', description: 'Kendte ting og enkle ord', difficulty: 10, clueDifficulty: 30, ageRangeMin: 6, ageRangeMax: 12 },
  { id: 'family', label: 'Familie', description: 'Børn og voksne sammen', difficulty: 25, clueDifficulty: 55, ageRangeMin: 8, ageRangeMax: 70 },
  { id: 'adults', label: 'Voksne', description: 'Almen viden, snedige ledetråde', difficulty: 45, clueDifficulty: 75, ageRangeMin: 18, ageRangeMax: 65 },
  { id: 'experts', label: 'Quiz-nørder', description: 'Sjældne svar, kryptiske ledetråde', difficulty: 75, clueDifficulty: 90, ageRangeMin: 18, ageRangeMax: 70 },
];

const KEYS = ['difficulty', 'clueDifficulty', 'ageRangeMin', 'ageRangeMax'];

export const matchPreset = (settings) =>
  DIFFICULTY_PRESETS.find(p => KEYS.every(k => p[k] === settings[k])) ?? null;

export const presetValues = (preset) => Object.fromEntries(KEYS.map(k => [k, preset[k]]));

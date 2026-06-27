export const getDifficultyLabel = (v) => v <= 10 ? 'Børneniveau' : v <= 25 ? 'Meget let' : v <= 40 ? 'Let'
  : v <= 60 ? 'Normal' : v <= 75 ? 'Svær' : v <= 90 ? 'Meget svær' : 'Ekspert';

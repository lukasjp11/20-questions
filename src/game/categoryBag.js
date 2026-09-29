const shuffle = (items, rng) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export function drawCategory(bag, keys, last = null, rng = Math.random) {
  let next = bag.filter(k => keys.includes(k));
  if (next.length === 0) {
    next = shuffle(keys, rng);
    if (next.length > 1 && next[0] === last) [next[0], next[1]] = [next[1], next[0]];
  }
  const [category, ...rest] = next;
  return { category, bag: rest };
}

export const markPlayed = (bag, category) => {
  const i = bag.indexOf(category);
  return i === -1 ? bag : [...bag.slice(0, i), ...bag.slice(i + 1)];
};

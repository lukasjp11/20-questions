import { drawCategory, markPlayed } from './categoryBag';

const KEYS = ['person', 'sted', 'ting', 'begivenhed'];

describe('category bag', () => {
  it('deals every category once before any repeats', () => {
    let bag = [];
    let last = null;
    for (let round = 0; round < 25; round++) {
      const seen = [];
      for (let i = 0; i < KEYS.length; i++) {
        const next = drawCategory(bag, KEYS, last);
        bag = next.bag;
        last = next.category;
        seen.push(next.category);
      }
      expect([...seen].sort()).toEqual([...KEYS].sort());
    }
  });

  it('never repeats a category across the start of a new round', () => {
    const unshuffled = () => 0.999;
    expect(drawCategory([], ['a', 'b', 'c'], null, unshuffled).category).toBe('a');
    expect(drawCategory([], ['a', 'b', 'c'], 'a', unshuffled).category).toBe('b');
  });

  it('counts a category picked by hand as played in the current round', () => {
    expect(markPlayed(['sted', 'ting'], 'ting')).toEqual(['sted']);
    expect(markPlayed(['sted'], 'person')).toEqual(['sted']);
  });

  it('ignores categories that no longer exist', () => {
    expect(drawCategory(['gammel', 'sted'], KEYS).category).toBe('sted');
  });
});

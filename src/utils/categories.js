import { Brain, MapPin, Lightbulb, CalendarDays, PawPrint, Clapperboard, Leaf, Trophy, Music, Cpu, Swords } from 'lucide-react';
import { getDifficultyLabel } from './promptCore';

export const categories = {
  person: { name: 'Person', icon: Brain, description: 'Kendte personer og figurer' },
  sted: { name: 'Sted', icon: MapPin, description: 'Byer, lande, bygninger og steder' },
  ting: { name: 'Ting', icon: Lightbulb, description: 'Genstande, opfindelser, mad og idéer' },
  aarstal: { name: 'Årstal', icon: CalendarDays, description: 'Et år og det, der skete' },
  dyr: { name: 'Dyr', icon: PawPrint, description: 'Dyrearter og racer' },
  vaerk: { name: 'Film & TV', icon: Clapperboard, description: 'Film, serier, bøger og tegneserier' },
  natur: { name: 'Natur', icon: Leaf, description: 'Planter, vejr, landskaber og sten' },
  sport: { name: 'Sport & leg', icon: Trophy, description: 'Sportsgrene, spil og lege' },
  musik: { name: 'Musik', icon: Music, description: 'Sange, kunstnere og instrumenter' },
  teknologi: { name: 'Teknologi', icon: Cpu, description: 'Maskiner, computere, spil og gammel teknik' },
};

export const legacyCategories = {
  begivenhed: { name: 'Begivenhed', icon: Swords, description: 'Historiske begivenheder' },
};

export const DEFAULT_CATEGORIES = ['person', 'sted', 'ting', 'aarstal'];
export const ACTIVE_COUNT = 4;

export const categoryInfo = (key) => categories[key] ?? legacyCategories[key] ?? null;

export const activeCategoryKeys = (active) => {
  const valid = Array.isArray(active) ? Object.keys(categories).filter(k => active.includes(k)) : [];
  return valid.length === ACTIVE_COUNT ? valid : DEFAULT_CATEGORIES;
};

export { getDifficultyLabel };

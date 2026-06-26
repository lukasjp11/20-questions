import { Brain, MapPin, Lightbulb, Swords } from 'lucide-react';
import { getPrompt, getDifficultyLabel } from './promptCore';

export const categories = {
  person: {
    name: 'Person',
    icon: Brain,
    description: 'Berømte personer, karakterer & erhverv'
  },
  sted: {
    name: 'Sted',
    icon: MapPin,
    description: 'Geografiske lokationer & steder'
  },
  ting: {
    name: 'Ting',
    icon: Lightbulb,
    description: 'Objekter, koncepter & idéer'
  },
  begivenhed: {
    name: 'Begivenhed',
    icon: Swords,
    description: 'Historiske begivenheder & øjeblikke'
  }
};

export { getPrompt, getDifficultyLabel };
export const defaultCategories = categories;

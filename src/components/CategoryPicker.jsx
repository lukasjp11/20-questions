import { useState } from 'react';
import { categories, ACTIVE_COUNT, DEFAULT_CATEGORIES } from '../utils/categories';

const CategoryPicker = ({ value, onChange }) => {
  const [full, setFull] = useState(false);
  const selected = Object.keys(categories).filter(k => value.includes(k));

  const toggle = (key) => {
    if (selected.includes(key)) {
      setFull(false);
      onChange(selected.filter(k => k !== key));
    } else if (selected.length < ACTIVE_COUNT) {
      onChange([...selected, key]);
    } else {
      setFull(true);
    }
  };

  const isDefault = DEFAULT_CATEGORIES.every(k => selected.includes(k)) && selected.length === ACTIVE_COUNT;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="Kategorier">
        {Object.entries(categories).map(([key, category]) => {
          const Icon = category.icon;
          const on = selected.includes(key);
          return (
            <button
              key={key}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(key)}
              className={`flex flex-col items-start justify-start text-left p-3 rounded-board border-[1.5px] transition-colors ${
                on
                  ? 'bg-board-surface-active border-board-gold text-board-text'
                  : 'bg-board-surface-alt border-[rgba(212,168,84,0.1)] text-board-text-dim hover:border-[rgba(212,168,84,0.25)]'
              }`}
            >
              <span className="flex items-center gap-2 font-semibold">
                <Icon className="w-4 h-4 flex-shrink-0" />
                {category.name}
              </span>
              <span className="block text-xs text-board-text-dimmer mt-1">{category.description}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-sm">
        <span className={selected.length === ACTIVE_COUNT ? 'text-board-text-dim' : 'text-board-special'} aria-live="polite">
          {full ? `Fravælg en kategori først. Der er plads til ${ACTIVE_COUNT}.` : `${selected.length} af ${ACTIVE_COUNT} valgt`}
        </span>
        {!isDefault && (
          <button type="button" onClick={() => { setFull(false); onChange(DEFAULT_CATEGORIES); }} className="text-board-gold hover:underline">
            Brug standard (Person, Sted, Ting, Årstal)
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryPicker;

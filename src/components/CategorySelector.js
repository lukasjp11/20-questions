import React from 'react';
import { categories } from '../utils/prompts';
import { getUsedItemsInCategory } from '../utils/gameLogic';

const CategorySelector = ({ 
  currentCategory, 
  onCategorySelect, 
  loading, 
  usedItems 
}) => {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {Object.entries(categories).map(([key, category]) => {
          const Icon = category.icon;
          const usedCount = getUsedItemsInCategory(usedItems, key);
          const isActive = currentCategory === key;
          
          return (
            <button 
              key={key} 
              onClick={() => onCategorySelect(key)} 
              disabled={loading}
              className={`
                relative p-3 md:p-4 rounded-lg flex flex-col items-center 
                transition-all transform hover:scale-105
                ${isActive 
                  ? `bg-gradient-to-br ${category.gradient} shadow-lg text-white` 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                border border-gray-200 dark:border-transparent
              `}
              aria-label={`Select ${category.name} category`}
            >
              <Icon className="w-6 h-6 md:w-8 md:h-8 mb-1" />
              <span className="text-sm md:text-base font-medium">
                {category.name}
              </span>
              {usedCount > 0 && (
                <span className="absolute top-1 right-1 text-xs bg-gray-800 dark:bg-gray-900 text-white px-1.5 py-0.5 rounded-full">
                  {usedCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
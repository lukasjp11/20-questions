import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  X,
  Clock,
  Palette,
  Grid,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getDifficultyLabel, getDifficultyDescription } from '../utils/prompts';

const SettingsPage = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const {
    difficulty,
    customTheme,
    hideAnswerOnGeneration,
    numberOfClues,
    enableTimer,
    timePerClue,
    categories,
    updateSetting,
    resetUsedItems,
    resetAllData,
    usedItems
  } = useGame();

  const [localSettings, setLocalSettings] = useState({
    difficulty,
    customTheme,
    hideAnswerOnGeneration,
    numberOfClues,
    enableTimer,
    timePerClue,
    categories: { ...categories }
  });

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ key: '', name: '', description: '' });
  const [hasChanges, setHasChanges] = useState(false);

  const handleLocalChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    Object.entries(localSettings).forEach(([key, value]) => {
      if (key === 'categories') {
        updateSetting('customCategories', value);
      } else {
        updateSetting(key, value);
      }
    });
    setHasChanges(false);
    navigate(-1); // Go back to previous page instead of always going home
  };

  const handleAddCategory = () => {
    if (newCategory.key && newCategory.name) {
      const updatedCategories = {
        ...localSettings.categories,
        [newCategory.key]: {
          name: newCategory.name,
          description: newCategory.description || 'Brugerdefineret kategori',
          custom: true,
          icon: Sparkles,
          gradient: 'from-gray-600 to-gray-700'
        }
      };
      handleLocalChange('categories', updatedCategories);
      setNewCategory({ key: '', name: '', description: '' });
      setShowAddCategory(false);
    }
  };

  const handleRemoveCategory = (key) => {
    if (window.confirm(`Er du sikker på at du vil fjerne kategorien "${localSettings.categories[key].name}"?`)) {
      const { [key]: removed, ...remaining } = localSettings.categories;
      handleLocalChange('categories', remaining);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} text-gray-900 dark:text-white`}>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">Indstillinger</h1>
          </div>
          {hasChanges && (
            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Gem ændringer
            </button>
          )}
        </div>

        {/* Settings sections */}
        <div className="space-y-6">
          {/* Appearance */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Udseende
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span className="font-medium">Mørk tema</span>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                    theme === 'dark' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <span className="font-medium">Skjul svar ved generering</span>
                <button
                  onClick={() => handleLocalChange('hideAnswerOnGeneration', !localSettings.hideAnswerOnGeneration)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                    localSettings.hideAnswerOnGeneration ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${
                    localSettings.hideAnswerOnGeneration ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>
            </div>
          </section>

          {/* Game Rules */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5" />
              Spilregler
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Sværhedsgrad: {getDifficultyLabel(localSettings.difficulty)}</span>
                  <span className="text-sm text-gray-500">{localSettings.difficulty}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.difficulty}
                  onChange={e => handleLocalChange('difficulty', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{ 
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${localSettings.difficulty}%, ${theme === 'dark' ? '#374151' : '#e5e7eb'} ${localSettings.difficulty}%, ${theme === 'dark' ? '#374151' : '#e5e7eb'} 100%)` 
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">{getDifficultyDescription(localSettings.difficulty)}</p>
              </div>

              <div>
                <label className="block mb-2 font-medium">Antal ledetråde</label>
                <input
                  type="number"
                  value={localSettings.numberOfClues}
                  onChange={e => {
                    const value = parseInt(e.target.value) || 1;
                    handleLocalChange('numberOfClues', value);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-center"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Tilpasset tema (valgfrit)</label>
                <input
                  type="text"
                  value={localSettings.customTheme}
                  onChange={e => handleLocalChange('customTheme', e.target.value)}
                  placeholder='f.eks. "Film og serier", "Dansk historie"'
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                />
              </div>

              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Tidsgrænse</span>
                </div>
                <button
                  onClick={() => handleLocalChange('enableTimer', !localSettings.enableTimer)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                    localSettings.enableTimer ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${
                    localSettings.enableTimer ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </label>

              {localSettings.enableTimer && (
                <div>
                  <label className="block mb-2 text-sm font-medium">Sekunder per ledetråd</label>
                  <input
                    type="number"
                    value={localSettings.timePerClue}
                    onChange={e => {
                      const value = parseInt(e.target.value) || 1;
                      handleLocalChange('timePerClue', value);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-center"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Categories */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Grid className="w-5 h-5" />
                Kategorier
              </h2>
              <button
                onClick={() => setShowAddCategory(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tilføj kategori
              </button>
            </div>

            <div className="space-y-2">
              {Object.entries(localSettings.categories).map(([key, category]) => (
                <div 
                  key={key} 
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                  {category.custom && (
                    <button
                      onClick={() => handleRemoveCategory(key)}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {showAddCategory && (
              <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <h3 className="font-medium mb-3">Ny kategori</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Kategori ID (f.eks. 'sport')"
                    value={newCategory.key}
                    onChange={e => setNewCategory(prev => ({ ...prev, key: e.target.value.toLowerCase().replace(/\s/g, '_') }))}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Kategori navn (f.eks. 'Sport')"
                    value={newCategory.name}
                    onChange={e => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Beskrivelse (valgfrit)"
                    value={newCategory.description}
                    onChange={e => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Tilføj
                    </button>
                    <button
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategory({ key: '', name: '', description: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 rounded-lg transition-colors"
                    >
                      Annuller
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Data Management */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Data håndtering</h2>
            
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Brugte kort</span>
                  <span className="text-2xl font-bold">{usedItems.length}</span>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Er du sikker på at du vil nulstille alle brugte kort?')) {
                      resetUsedItems();
                    }
                  }}
                  className="w-full mt-2 py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Nulstil brugte kort
                </button>
              </div>

              <button
                onClick={() => {
                  if (window.confirm('ADVARSEL: Dette vil slette ALLE data inklusiv indstillinger og brugte kort. Er du helt sikker?')) {
                    resetAllData();
                  }
                }}
                className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Slet alle data
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
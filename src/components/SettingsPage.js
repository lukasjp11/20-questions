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
  Sliders,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getDifficultyLabel, getDifficultyDescription } from '../utils/prompts';

const SettingsPage = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const {
    difficulty,
    clueDifficulty,
    customTheme,
    hideAnswerOnGeneration,
    numberOfClues,
    enableTimer,
    timePerClue,
    numberOfSpecialClues,
    specialCluesConfig,
    updateSetting,
    resetUsedItems,
    resetAllData,
    usedItems
  } = useGame();

  const [localSettings, setLocalSettings] = useState({
    difficulty,
    clueDifficulty,
    customTheme,
    hideAnswerOnGeneration,
    numberOfClues,
    enableTimer,
    timePerClue,
    numberOfSpecialClues,
    specialCluesConfig: [...specialCluesConfig]
  });

  const [showAddSpecialClue, setShowAddSpecialClue] = useState(false);
  const [newSpecialClue, setNewSpecialClue] = useState({ text: '', weight: 2 });
  const [hasChanges, setHasChanges] = useState(false);

  const handleLocalChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    Object.entries(localSettings).forEach(([key, value]) => {
      updateSetting(key, value);
    });
    setHasChanges(false);
    navigate(-1);
  };

  const handleAddSpecialClue = () => {
    if (newSpecialClue.text.trim()) {
      const updatedClues = [...localSettings.specialCluesConfig, {
        text: newSpecialClue.text.trim(),
        weight: newSpecialClue.weight
      }];
      handleLocalChange('specialCluesConfig', updatedClues);
      setNewSpecialClue({ text: '', weight: 2 });
      setShowAddSpecialClue(false);
    }
  };

  const handleRemoveSpecialClue = (index) => {
    const updatedClues = localSettings.specialCluesConfig.filter((_, i) => i !== index);
    handleLocalChange('specialCluesConfig', updatedClues);
  };

  const handleWeightChange = (index, newWeight) => {
    const updatedClues = [...localSettings.specialCluesConfig];
    updatedClues[index] = { ...updatedClues[index], weight: newWeight };
    handleLocalChange('specialCluesConfig', updatedClues);
  };

  const getCluesDifficultyDescription = (value) => {
    if (value <= 25) return 'Simple, konkrete ledetråde med basale ord';
    if (value <= 50) return 'Standard trivia-niveau ledetråde';
    if (value <= 75) return 'Komplekse ledetråde der kræver god viden';
    return 'Meget komplekse ledetråde der kræver specialviden';
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
                  <span className="font-medium">Sværhedsgrad - Svar: {getDifficultyLabel(localSettings.difficulty)}</span>
                  <span className="text-sm text-gray-500">{localSettings.difficulty}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.difficulty}
                  onChange={e => handleLocalChange('difficulty', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{ 
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${localSettings.difficulty}%, ${theme === 'dark' ? '#374151' : '#e5e7eb'} ${localSettings.difficulty}%, ${theme === 'dark' ? '#374151' : '#e5e7eb'} 100%)` 
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">{getDifficultyDescription(localSettings.difficulty)}</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Sværhedsgrad - Ledetråde: {getDifficultyLabel(localSettings.clueDifficulty)}</span>
                  <span className="text-sm text-gray-500">{localSettings.clueDifficulty}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.clueDifficulty}
                  onChange={e => handleLocalChange('clueDifficulty', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{ 
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${localSettings.clueDifficulty}%, ${theme === 'dark' ? '#374151' : '#e5e7eb'} ${localSettings.clueDifficulty}%, ${theme === 'dark' ? '#374151' : '#e5e7eb'} 100%)` 
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">{getCluesDifficultyDescription(localSettings.clueDifficulty)}</p>
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
                <label className="block mb-2 font-medium">
                  Tilpasset tema (valgfrit)
                  <span className="ml-2 inline-flex items-center gap-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    Eksperimentel
                  </span>
                </label>
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

          {/* Special Clues */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Special-ledetråde
              </h2>
              <button
                onClick={() => setShowAddSpecialClue(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tilføj
              </button>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Antal special-ledetråde per spil</label>
              <input
                type="number"
                min="0"
                max="5"
                value={localSettings.numberOfSpecialClues}
                onChange={e => {
                  const value = Math.min(5, Math.max(0, parseInt(e.target.value) || 0));
                  handleLocalChange('numberOfSpecialClues', value);
                }}
                className="w-20 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-center"
              />
              <p className="text-xs text-gray-500 mt-1">Mellem 0 og 5 special-ledetråde</p>
            </div>

            <div className="space-y-2">
              {localSettings.specialCluesConfig.map((clueConfig, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <p className="text-purple-600 dark:text-purple-300 flex-1">{clueConfig.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Hyppighed:</span>
                      <select
                        value={clueConfig.weight}
                        onChange={(e) => handleWeightChange(index, parseInt(e.target.value))}
                        className="px-2 py-1 rounded bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-sm"
                      >
                        <option value={1}>Sjælden</option>
                        <option value={2}>Normal</option>
                        <option value={3}>Almindelig</option>
                        <option value={4}>Meget almindelig</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleRemoveSpecialClue(index)}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {localSettings.specialCluesConfig.length === 0 && (
                <p className="text-center text-gray-500 py-4">Ingen special-ledetråde tilføjet</p>
              )}
            </div>

            {showAddSpecialClue && (
              <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <h3 className="font-medium mb-3">Ny special-ledetråd</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder='f.eks. "Du må åbne 2 ledetråde gratis"'
                    value={newSpecialClue.text}
                    onChange={e => setNewSpecialClue(prev => ({ ...prev, text: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  />
                  <div className="flex items-center gap-3">
                    <label className="text-sm">Hyppighed:</label>
                    <select
                      value={newSpecialClue.weight}
                      onChange={(e) => setNewSpecialClue(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                    >
                      <option value={1}>Sjælden</option>
                      <option value={2}>Normal</option>
                      <option value={3}>Almindelig</option>
                      <option value={4}>Meget almindelig</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddSpecialClue}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Tilføj
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSpecialClue(false);
                        setNewSpecialClue({ text: '', weight: 2 });
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
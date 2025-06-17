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
  AlertCircle,
  FlaskConical,
  Gauge,
  CheckSquare,
  ListChecks,
  Database,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Minus
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getDifficultyLabel } from '../utils/prompts';

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

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} text-gray-900 dark:text-white`}>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">Indstillinger</h1>
          </div>
          {hasChanges && (
            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Gem ændringer</span>
            </button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{localSettings.numberOfClues}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Ledetråde</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round((localSettings.difficulty + localSettings.clueDifficulty) / 2)}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Sværhed</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{usedItems.length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Brugte kort</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {localSettings.enableTimer ? `${localSettings.timePerClue}s` : 'Fra'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Timer</p>
          </div>
        </div>

        {/* Settings sections */}
        <div className="space-y-6">
          {/* Basic Game Settings */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5" />
              Grundlæggende
            </h2>

            <div className="space-y-4">
              {/* Number of clues */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <label className="font-medium">Antal ledetråde</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLocalChange('numberOfClues', Math.max(1, localSettings.numberOfClues - 5))}
                    className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={localSettings.numberOfClues}
                    onChange={e => {
                      const value = parseInt(e.target.value) || 1;
                      handleLocalChange('numberOfClues', value);
                    }}
                    className="w-16 px-2 py-1 text-center rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    onClick={() => handleLocalChange('numberOfClues', localSettings.numberOfClues + 5)}
                    className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span className="font-medium">Dark mode</span>
                </div>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                    theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Hide Answer */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  {localSettings.hideAnswerOnGeneration ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="font-medium">Skjul svar ved start</span>
                </div>
                <button
                  onClick={() => handleLocalChange('hideAnswerOnGeneration', !localSettings.hideAnswerOnGeneration)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                    localSettings.hideAnswerOnGeneration ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${
                    localSettings.hideAnswerOnGeneration ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Timer */}
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Tidsgrænse</span>
                  </div>
                  <button
                  onClick={() => handleLocalChange('enableTimer', !localSettings.enableTimer)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                    localSettings.enableTimer ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${
                    localSettings.enableTimer ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
                </div>
                {localSettings.enableTimer && (
                  <div className="flex items-center justify-between mt-3 pl-6">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sekunder per ledetråd</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLocalChange('timePerClue', Math.max(5, localSettings.timePerClue - 5))}
                        className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        value={localSettings.timePerClue}
                        onChange={e => {
                          const value = parseInt(e.target.value) || 1;
                          handleLocalChange('timePerClue', value);
                        }}
                        className="w-12 px-1 py-0.5 text-center rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm"
                      />
                      <button
                        onClick={() => handleLocalChange('timePerClue', localSettings.timePerClue + 5)}
                        className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Game Difficulty */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Sværhedsgrad
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-sm">Svar</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {getDifficultyLabel(localSettings.difficulty)}
                  </span>
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
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Let</span>
                  <span className="text-xs text-gray-500">{localSettings.difficulty}%</span>
                  <span className="text-xs text-gray-500">Ekspert</span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-sm">Ledetråde</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {getDifficultyLabel(localSettings.clueDifficulty)}
                  </span>
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
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Let</span>
                  <span className="text-xs text-gray-500">{localSettings.clueDifficulty}%</span>
                  <span className="text-xs text-gray-500">Ekspert</span>
                </div>
              </div>

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
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tilføj
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span className="font-medium text-sm">Antal per spil</span>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => handleLocalChange('numberOfSpecialClues', num)}
                    className={`w-8 h-8 rounded-lg font-medium text-sm transition-all ${
                      localSettings.numberOfSpecialClues === num
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {localSettings.specialCluesConfig.map((clueConfig, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <p className="text-gray-700 dark:text-gray-300 flex-1 text-sm">{clueConfig.text}</p>
                  <div className="flex items-center gap-2 ml-4">
                    <select
                      value={clueConfig.weight}
                      onChange={(e) => handleWeightChange(index, parseInt(e.target.value))}
                      className="px-2 py-1 rounded bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-sm"
                    >
                      <option value={1}>Sjælden</option>
                      <option value={2}>Normal</option>
                      <option value={3}>Hyppig</option>
                      <option value={4}>Meget hyppig</option>
                    </select>
                    <button
                      onClick={() => handleRemoveSpecialClue(index)}
                      className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {localSettings.specialCluesConfig.length === 0 && !showAddSpecialClue && (
                <p className="text-center text-gray-500 py-4 text-sm">Ingen special-ledetråde tilføjet</p>
              )}
            </div>

            {showAddSpecialClue && (
              <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <h3 className="font-medium mb-3">Ny special-ledetråd</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder='f.eks. "Ryk 3 felter tilbage"'
                    value={newSpecialClue.text}
                    onChange={e => setNewSpecialClue(prev => ({ ...prev, text: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex items-center gap-3">
                    <label className="text-sm">Hyppighed:</label>
                    <select
                      value={newSpecialClue.weight}
                      onChange={(e) => setNewSpecialClue(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    >
                      <option value={1}>Sjælden</option>
                      <option value={2}>Normal</option>
                      <option value={3}>Hyppig</option>
                      <option value={4}>Meget hyppig</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddSpecialClue}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
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

          {/* Experimental Features */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FlaskConical className="w-5 h-5" />
              Eksperimentelle funktioner
            </h2>
            
            <div className="bg-yellow-100/70 dark:bg-yellow-900/20 border border-yellow-300/70 dark:border-yellow-700/50 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Disse funktioner er under udvikling og kan være ustabile
              </p>
            </div>

            <div>
              <label className="block mb-2 font-medium">Tilpasset tema</label>
              <input
                type="text"
                value={localSettings.customTheme}
                onChange={e => handleLocalChange('customTheme', e.target.value)}
                placeholder='f.eks. "Marvel", "90erne", "Dansk historie"'
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-colors"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Begrænser alle kategorier til det valgte tema
              </p>
            </div>
          </section>

          {/* Data Management */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data
            </h2>
            
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">Brugte kort</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nulstil for at få dem igen
                    </p>
                  </div>
                  <span className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                    {usedItems.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Er du sikker på at du vil nulstille alle brugte kort?')) {
                      resetUsedItems();
                    }
                  }}
                  className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
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
                className="w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
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
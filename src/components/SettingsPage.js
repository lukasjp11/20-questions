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
  Minus,
  Users
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getDifficultyLabel } from '../utils/prompts';

const SettingsPage = () => {
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
    ageRangeMin,
    ageRangeMax,
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
    specialCluesConfig: [...specialCluesConfig],
    ageRangeMin,
    ageRangeMax
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
    <div className="min-h-screen bg-board-bg text-board-text">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-board bg-board-surface border border-[rgba(212,168,84,0.08)] hover:border-[rgba(212,168,84,0.2)] transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-board-text-dim" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-board-text">Indstillinger</h1>
          </div>
          {hasChanges && (
            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 px-4 py-2 bg-board-gold hover:bg-board-gold-muted text-board-bg rounded-board shadow-sm hover:shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Gem ændringer</span>
            </button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-board-surface-alt rounded-board p-3 text-center border border-[rgba(212,168,84,0.06)]">
            <p className="text-2xl font-bold text-board-gold">{localSettings.numberOfClues}</p>
            <p className="text-xs text-board-text-dimmer">Ledetråde</p>
          </div>
          <div className="bg-board-surface-alt rounded-board p-3 text-center border border-[rgba(212,168,84,0.06)]">
            <p className="text-2xl font-bold text-board-gold">
              {Math.round((localSettings.difficulty + localSettings.clueDifficulty) / 2)}%
            </p>
            <p className="text-xs text-board-text-dimmer">Sværhed</p>
          </div>
          <div className="bg-board-surface-alt rounded-board p-3 text-center border border-[rgba(212,168,84,0.06)]">
            <p className="text-2xl font-bold text-board-gold">{usedItems.length}</p>
            <p className="text-xs text-board-text-dimmer">Brugte kort</p>
          </div>
          <div className="bg-board-surface-alt rounded-board p-3 text-center border border-[rgba(212,168,84,0.06)]">
            <p className="text-2xl font-bold text-board-gold">
              {localSettings.enableTimer ? `${localSettings.timePerClue}s` : 'Fra'}
            </p>
            <p className="text-xs text-board-text-dimmer">Timer</p>
          </div>
        </div>

        {/* Settings sections */}
        <div className="space-y-6">
          {/* Basic Game Settings */}
          <section className="bg-board-surface-alt rounded-board p-6 border border-[rgba(212,168,84,0.06)]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-heading text-board-text">
              <Sliders className="w-5 h-5 text-board-text-dim" />
              Grundlæggende
            </h2>

            <div className="space-y-4">
              {/* Number of clues */}
              <div className="flex items-center justify-between p-3 rounded-board bg-board-surface">
                <label className="font-medium">Antal ledetråde</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLocalChange('numberOfClues', Math.max(1, localSettings.numberOfClues - 5))}
                    className="w-8 h-8 rounded-board bg-board-surface-active border border-[rgba(212,168,84,0.08)] hover:border-[rgba(212,168,84,0.2)] text-board-text-muted hover:text-board-gold flex items-center justify-center transition-colors"
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
                    className="w-16 px-2 py-1 text-center rounded-board bg-board-bg border border-[rgba(212,168,84,0.08)] text-board-text"
                  />
                  <button
                    onClick={() => handleLocalChange('numberOfClues', localSettings.numberOfClues + 5)}
                    className="w-8 h-8 rounded-board bg-board-surface-active border border-[rgba(212,168,84,0.08)] hover:border-[rgba(212,168,84,0.2)] text-board-text-muted hover:text-board-gold flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Hide Answer */}
              <div className="flex items-center justify-between p-3 rounded-board bg-board-surface">
                <div className="flex items-center gap-3">
                  {localSettings.hideAnswerOnGeneration ? <EyeOff className="w-4 h-4 text-board-text-dim" /> : <Eye className="w-4 h-4 text-board-text-dim" />}
                  <span className="font-medium">Skjul svar ved start</span>
                </div>
                <button
                  onClick={() => handleLocalChange('hideAnswerOnGeneration', !localSettings.hideAnswerOnGeneration)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-[4px] transition-all ${
                    localSettings.hideAnswerOnGeneration ? 'bg-board-gold' : 'bg-[rgba(212,168,84,0.08)]'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 rounded-[3px] bg-board-bg transform transition-transform ${
                    localSettings.hideAnswerOnGeneration ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Timer */}
              <div className="p-3 rounded-board bg-board-surface">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-board-text-dim" />
                    <span className="font-medium">Tidsgrænse</span>
                  </div>
                  <button
                  onClick={() => handleLocalChange('enableTimer', !localSettings.enableTimer)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-[4px] transition-all ${
                    localSettings.enableTimer ? 'bg-board-gold' : 'bg-[rgba(212,168,84,0.08)]'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 rounded-[3px] bg-board-bg transform transition-transform ${
                    localSettings.enableTimer ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
                </div>
                {localSettings.enableTimer && (
                  <div className="flex items-center justify-between mt-3 pl-6">
                    <span className="text-sm text-board-text-dimmer">Sekunder per ledetråd</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLocalChange('timePerClue', Math.max(5, localSettings.timePerClue - 5))}
                        className="w-7 h-7 rounded-board bg-board-surface-active border border-[rgba(212,168,84,0.08)] hover:border-[rgba(212,168,84,0.2)] text-board-text-muted hover:text-board-gold flex items-center justify-center transition-colors"
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
                        className="w-12 px-1 py-0.5 text-center rounded-board bg-board-bg border border-[rgba(212,168,84,0.08)] text-sm text-board-text"
                      />
                      <button
                        onClick={() => handleLocalChange('timePerClue', localSettings.timePerClue + 5)}
                        className="w-7 h-7 rounded-board bg-board-surface-active border border-[rgba(212,168,84,0.08)] hover:border-[rgba(212,168,84,0.2)] text-board-text-muted hover:text-board-gold flex items-center justify-center transition-colors"
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
          <section className="bg-board-surface-alt rounded-board p-6 border border-[rgba(212,168,84,0.06)]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-heading text-board-text">
              <Gauge className="w-5 h-5 text-board-text-dim" />
              Sværhedsgrad
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <div className="bg-board-surface rounded-board p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-board-text-dim" />
                    <span className="font-medium text-sm">Svar</span>
                  </div>
                  <span className="text-lg font-bold text-board-gold">
                    {getDifficultyLabel(localSettings.difficulty)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.difficulty}
                  onChange={e => handleLocalChange('difficulty', parseInt(e.target.value))}
                  className="w-full h-2 rounded-board appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #d4a854 0%, #d4a854 ${localSettings.difficulty}%, rgba(212,168,84,0.08) ${localSettings.difficulty}%, rgba(212,168,84,0.08) 100%)`
                  }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-board-text-faint">Let</span>
                  <span className="text-xs text-board-text-faint">{localSettings.difficulty}%</span>
                  <span className="text-xs text-board-text-faint">Ekspert</span>
                </div>
              </div>

              <div className="bg-board-surface rounded-board p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-board-text-dim" />
                    <span className="font-medium text-sm">Ledetråde</span>
                  </div>
                  <span className="text-lg font-bold text-board-gold">
                    {getDifficultyLabel(localSettings.clueDifficulty)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.clueDifficulty}
                  onChange={e => handleLocalChange('clueDifficulty', parseInt(e.target.value))}
                  className="w-full h-2 rounded-board appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #d4a854 0%, #d4a854 ${localSettings.clueDifficulty}%, rgba(212,168,84,0.08) ${localSettings.clueDifficulty}%, rgba(212,168,84,0.08) 100%)`
                  }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-board-text-faint">Let</span>
                  <span className="text-xs text-board-text-faint">{localSettings.clueDifficulty}%</span>
                  <span className="text-xs text-board-text-faint">Ekspert</span>
                </div>
              </div>

            </div>

            {/* Age Range */}
            <div className="bg-board-surface rounded-board p-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-board-text-dim" />
                  <span className="font-medium text-sm">Spillernes alder</span>
                </div>
                <span className="text-lg font-bold text-board-gold">
                  {localSettings.ageRangeMin}–{localSettings.ageRangeMax} år
                </span>
              </div>
              {(() => {
                const minPct = ((localSettings.ageRangeMin - 5) / 75) * 100;
                const maxPct = ((localSettings.ageRangeMax - 5) / 75) * 100;
                const trackBg = 'rgba(212,168,84,0.08)';
                const trackFill = `linear-gradient(to right, ${trackBg} ${minPct}%, #d4a854 ${minPct}%, #d4a854 ${maxPct}%, ${trackBg} ${maxPct}%)`;
                return (
                  <div className="relative h-2">
                    <div
                      className="absolute inset-0 rounded-board"
                      style={{ background: trackFill }}
                    />
                    {/* Min thumb */}
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={localSettings.ageRangeMin}
                      onChange={e => {
                        const val = Math.min(parseInt(e.target.value), localSettings.ageRangeMax - 1);
                        handleLocalChange('ageRangeMin', val);
                      }}
                      className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-[3px] [&::-webkit-slider-thumb]:bg-board-gold [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-[3px] [&::-moz-range-thumb]:bg-[#d4a854] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
                      style={{ zIndex: localSettings.ageRangeMin > 70 ? 5 : 3 }}
                    />
                    {/* Max thumb */}
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={localSettings.ageRangeMax}
                      onChange={e => {
                        const val = Math.max(parseInt(e.target.value), localSettings.ageRangeMin + 1);
                        handleLocalChange('ageRangeMax', val);
                      }}
                      className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-[3px] [&::-webkit-slider-thumb]:bg-board-gold [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-[3px] [&::-moz-range-thumb]:bg-[#d4a854] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
                      style={{ zIndex: 2 }}
                    />
                  </div>
                );
              })()}
              <div className="flex justify-between mt-2">
                <span className="text-xs text-board-text-faint">5 år</span>
                <span className="text-xs text-board-text-faint">80 år</span>
              </div>
            </div>
          </section>

          {/* Special Clues */}
          <section className="bg-board-surface-alt rounded-board p-6 border border-[rgba(212,168,84,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 font-heading text-board-text">
                <Sparkles className="w-5 h-5 text-board-special" />
                Special-ledetråde
              </h2>
              <button
                onClick={() => setShowAddSpecialClue(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-board-special hover:bg-[#b3734d] text-board-bg rounded-board text-sm transition-colors hover:shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tilføj</span>
              </button>
            </div>

            {/* Number per game selector */}
            <div className="mb-5 p-3 rounded-board bg-board-surface border border-[rgba(212,168,84,0.06)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="font-medium text-sm">Antal per spil</span>
                  <p className="text-xs text-board-text-dimmer mt-0.5">Vælg hvor mange der skal med</p>
                </div>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => handleLocalChange('numberOfSpecialClues', num)}
                      className={`w-9 h-9 rounded-board font-medium text-sm transition-all ${
                        localSettings.numberOfSpecialClues === num
                          ? 'bg-board-gold text-board-bg shadow-sm'
                          : 'bg-board-surface-active hover:bg-board-surface-active text-board-text-muted hover:text-board-text-secondary border border-[rgba(212,168,84,0.08)]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {localSettings.specialCluesConfig.map((clueConfig, index) => (
                <div
                  key={index}
                  className="group flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-board bg-board-surface hover:bg-board-surface-active transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-board-text-secondary text-sm font-medium">{clueConfig.text}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-board text-xs font-medium ${
                      clueConfig.weight === 1 ? 'bg-board-surface-active text-board-text-dim' :
                      clueConfig.weight === 2 ? 'bg-[rgba(212,168,84,0.1)] text-board-gold' :
                      clueConfig.weight === 3 ? 'bg-[rgba(200,132,90,0.12)] text-board-special' :
                      'bg-[rgba(200,132,90,0.16)] text-board-special'
                    }`}>
                      {clueConfig.weight === 1 ? 'Sjælden' :
                      clueConfig.weight === 2 ? 'Normal' :
                      clueConfig.weight === 3 ? 'Hyppig' : 'Meget hyppig'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <select
                      value={clueConfig.weight}
                      onChange={(e) => handleWeightChange(index, parseInt(e.target.value))}
                      className="px-2 py-1 rounded-board bg-board-bg border border-[rgba(212,168,84,0.08)] hover:border-board-gold text-sm cursor-pointer transition-colors text-board-text"
                    >
                      <option value={1}>Sjælden</option>
                      <option value={2}>Normal</option>
                      <option value={3}>Hyppig</option>
                      <option value={4}>Meget hyppig</option>
                    </select>
                    <button
                      onClick={() => handleRemoveSpecialClue(index)}
                      className="p-1.5 rounded-board hover:bg-[rgba(200,132,90,0.1)] text-board-special transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {localSettings.specialCluesConfig.length === 0 && !showAddSpecialClue && (
                <div className="text-center py-8 px-4 rounded-board border-2 border-dashed border-[rgba(212,168,84,0.1)]">
                  <Sparkles className="w-8 h-8 mx-auto text-board-text-faint mb-2" />
                  <p className="text-board-text-muted text-sm">Ingen special-ledetråde tilføjet</p>
                </div>
              )}
            </div>

            {showAddSpecialClue && (
              <div className="mt-4 p-4 rounded-board bg-board-surface border border-[rgba(212,168,84,0.1)]">
                <h3 className="font-medium mb-3 text-board-text">Ny special-ledetråd</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder='f.eks. "Ryk 3 felter tilbage" eller "Tag en ekstra tur"'
                    value={newSpecialClue.text}
                    onChange={e => setNewSpecialClue(prev => ({ ...prev, text: e.target.value }))}
                    className="w-full px-3 py-2 rounded-board bg-board-bg border border-[rgba(212,168,84,0.08)] focus:border-board-gold outline-none transition-colors text-board-text placeholder-board-text-faint"
                    autoFocus
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="text-sm font-medium">Hyppighed:</label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { value: 1, label: 'Sjælden' },
                        { value: 2, label: 'Normal' },
                        { value: 3, label: 'Hyppig' },
                        { value: 4, label: 'Meget hyppig' }
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setNewSpecialClue(prev => ({ ...prev, weight: value }))}
                          className={`px-3 py-1.5 rounded-board text-sm font-medium transition-all ${
                            newSpecialClue.weight === value
                              ? 'bg-[rgba(212,168,84,0.12)] text-board-gold'
                              : 'bg-board-surface-active text-board-text-muted hover:bg-board-surface-active hover:text-board-text-secondary'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleAddSpecialClue}
                      disabled={!newSpecialClue.text.trim()}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-board-gold hover:bg-board-gold-muted disabled:bg-board-surface-active disabled:text-board-text-faint text-board-bg rounded-board transition-colors font-medium disabled:cursor-not-allowed"
                    >
                      Tilføj
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSpecialClue(false);
                        setNewSpecialClue({ text: '', weight: 2 });
                      }}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-board-surface hover:bg-board-surface-active text-board-text-muted rounded-board transition-colors"
                    >
                      Annuller
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Experimental Features */}
          <section className="bg-board-surface-alt rounded-board p-6 border border-[rgba(212,168,84,0.06)]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-heading text-board-text">
              <FlaskConical className="w-5 h-5 text-board-text-dim" />
              Eksperimentelle funktioner
            </h2>

            <div className="bg-[rgba(212,168,84,0.06)] border border-[rgba(212,168,84,0.15)] rounded-board p-3 mb-4">
              <p className="text-sm text-board-gold-muted flex items-start gap-2">
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
                className="w-full px-3 py-2 rounded-board bg-board-bg border border-[rgba(212,168,84,0.08)] focus:border-board-gold outline-none transition-colors text-board-text placeholder-board-text-faint"
              />
              <p className="text-xs text-board-text-dimmer mt-2">
                Begrænser alle kategorier til det valgte tema
              </p>
            </div>
          </section>

          {/* Data Management */}
          <section className="bg-board-surface-alt rounded-board p-6 border border-[rgba(212,168,84,0.06)]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-heading text-board-text">
              <Database className="w-5 h-5 text-board-text-dim" />
              Data
            </h2>

            <div className="space-y-3">
              <div className="p-4 rounded-board bg-board-surface">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">Brugte kort</p>
                    <p className="text-sm text-board-text-dimmer">
                      Nulstil for at få dem igen
                    </p>
                  </div>
                  <span className="text-3xl font-bold text-board-text">
                    {usedItems.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Er du sikker på at du vil nulstille alle brugte kort?')) {
                      resetUsedItems();
                    }
                  }}
                  className="w-full py-2 px-4 bg-board-gold hover:bg-board-gold-muted text-board-bg rounded-board transition-colors"
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
                className="w-full py-3 px-4 bg-[rgba(200,132,90,0.1)] border-2 border-[rgba(200,132,90,0.2)] text-board-special font-medium rounded-board hover:bg-[rgba(200,132,90,0.15)] transition-colors flex items-center justify-center gap-2"
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

import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  X,
  Clock,
  Sliders,
  Sparkles,
  AlertCircle,
  FlaskConical,
  Gauge,
  CheckSquare,
  ListChecks,
  Database,
  Minus,
  Users,
  LayoutGrid
} from 'lucide-react';
import { useGame } from '../context/useGame';
import { getDifficultyLabel } from '../utils/categories';
import { summarize } from '../game/scoring';
import { DIFFICULTY_PRESETS, matchPreset, presetValues } from '../game/presets';
import Toggle from './Toggle';
import CategoryPicker from './CategoryPicker';
import { activeCategoryKeys, ACTIVE_COUNT } from '../utils/categories';

const MODES = [
  { value: 'reader', label: 'Oplæser', description: 'Til brætspillet. Du læser ledetrådene op og kan se svaret, når du trykker på det.' },
  { value: 'guess', label: 'Gæt selv', description: 'Solo eller på skift. I gætter i appen og får point.' },
];
const MAX_TEAMS = 4;

const SettingsPage = () => {
  const navigate = useNavigate();
  const { settings, updateSetting, resetUsedItems, resetAllData, usedItems, history, resetTeamScores } = useGame();

  const [localSettings, setLocalSettings] = useState(() => ({
    ...settings,
    specialCluesConfig: [...settings.specialCluesConfig],
    teamNames: [...settings.teamNames],
    activeCategories: activeCategoryKeys(settings.activeCategories),
  }));
  const categoriesValid = localSettings.activeCategories.length === ACTIVE_COUNT;
  const stats = summarize(history);

  const MIN_CLUES = 1;
  const MAX_CLUES = 30;

  const [showAddSpecialClue, setShowAddSpecialClue] = useState(false);
  const [newSpecialClue, setNewSpecialClue] = useState({ text: '', weight: 2 });
  const [hasChanges, setHasChanges] = useState(false);

  const handleLocalChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const goBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate('/', { replace: true });
  };

  const handleSaveSettings = () => {
    if (!categoriesValid) return;
    const teamNames = localSettings.teamNames.map((name, i) => name.trim() || `Hold ${i + 1}`);
    Object.entries({ ...localSettings, teamNames }).forEach(([key, value]) => {
      updateSetting(key, value);
    });
    setHasChanges(false);
    goBack();
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
    <div className="min-h-dvh bg-board-bg text-board-text">
      <div className={`max-w-4xl mx-auto px-3 py-4 sm:p-4 md:p-8 ${hasChanges ? 'pb-28 sm:pb-8' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={goBack}
              aria-label="Tilbage"
              className="p-2 rounded-board bg-board-surface border border-[rgba(212,168,84,0.08)] hover:border-[rgba(212,168,84,0.2)] transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-board-text-dim" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-board-text">Indstillinger</h1>
          </div>
          {hasChanges && (
            <button
              onClick={handleSaveSettings}
              disabled={!categoriesValid}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-board-gold hover:bg-board-gold-muted disabled:opacity-50 disabled:cursor-not-allowed text-board-bg rounded-board shadow-sm hover:shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              {categoriesValid ? 'Gem ændringer' : `Vælg ${ACTIVE_COUNT} kategorier`}
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
            <p className="text-2xl font-bold text-board-gold">
              {stats?.averageClues ? stats.averageClues.toFixed(1).replace('.', ',') : '-'}
            </p>
            <p className="text-xs text-board-text-dimmer">
              Snit ledetråde{stats ? ` (${stats.played} spil)` : ''}
            </p>
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
          <section className="bg-board-surface-alt rounded-board p-4 sm:p-6 border border-[rgba(212,168,84,0.06)]">
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
                    onClick={() => handleLocalChange('numberOfClues', Math.max(MIN_CLUES, localSettings.numberOfClues - 5))}
                    className="w-8 h-8 rounded-board bg-board-surface-active border border-[rgba(212,168,84,0.08)] hover:border-[rgba(212,168,84,0.2)] text-board-text-muted hover:text-board-gold flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={MIN_CLUES}
                    max={MAX_CLUES}
                    value={localSettings.numberOfClues}
                    onChange={e => {
                      const parsed = parseInt(e.target.value) || MIN_CLUES;
                      const value = Math.min(MAX_CLUES, Math.max(MIN_CLUES, parsed));
                      handleLocalChange('numberOfClues', value);
                    }}
                    className="w-16 px-2 py-1 text-center rounded-board bg-board-bg border border-[rgba(212,168,84,0.08)] text-board-text outline-none focus:border-board-gold"
                  />
                  <button
                    onClick={() => handleLocalChange('numberOfClues', Math.min(MAX_CLUES, localSettings.numberOfClues + 5))}
                    className="w-8 h-8 rounded-board bg-board-surface-active border border-[rgba(212,168,84,0.08)] hover:border-[rgba(212,168,84,0.2)] text-board-text-muted hover:text-board-gold flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-board bg-board-surface">
                <p className="font-medium mb-2">Spiltype</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Spiltype">
                  {MODES.map(m => {
                    const active = localSettings.mode === m.value;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => handleLocalChange('mode', m.value)}
                        className={`text-left p-3 rounded-board border-[1.5px] transition-colors ${
                          active
                            ? 'bg-board-surface-active border-board-gold'
                            : 'bg-board-surface-alt border-[rgba(212,168,84,0.1)] hover:border-[rgba(212,168,84,0.25)]'
                        }`}
                      >
                        <span className={`block font-semibold ${active ? 'text-board-text' : 'text-board-text-secondary'}`}>{m.label}</span>
                        <span className="block text-xs text-board-text-dim mt-1">{m.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timer */}
              <div className="p-3 rounded-board bg-board-surface">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-board-text-dim" />
                    <span className="font-medium">Tidsgrænse</span>
                  </div>
                  <Toggle
                    label="Tidsgrænse"
                    checked={localSettings.enableTimer}
                    onChange={v => handleLocalChange('enableTimer', v)}
                  />
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
                        className="w-12 px-1 py-0.5 text-center rounded-board bg-board-bg border border-[rgba(212,168,84,0.08)] text-sm text-board-text outline-none focus:border-board-gold"
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

          <section className="bg-board-surface-alt rounded-board p-4 sm:p-6 border border-[rgba(212,168,84,0.06)]">
            <h2 className="text-xl font-semibold flex items-center gap-2 font-heading text-board-text mb-1">
              <LayoutGrid className="w-5 h-5 text-board-text-dim" />
              Kategorier
            </h2>
            <p className="text-xs text-board-text-dimmer mb-4">Vælg de {ACTIVE_COUNT} kategorier, der er med i spillet.</p>
            <CategoryPicker
              value={localSettings.activeCategories}
              onChange={v => handleLocalChange('activeCategories', v)}
            />
          </section>

          {localSettings.mode === 'guess' && (
            <section className="bg-board-surface-alt rounded-board p-4 sm:p-6 border border-[rgba(212,168,84,0.06)]">
              <div className="flex items-center justify-between gap-4 mb-1">
                <h2 className="text-xl font-semibold flex items-center gap-2 font-heading text-board-text">
                  <Users className="w-5 h-5 text-board-text-dim" />
                  Hold
                </h2>
                <Toggle
                  label="Spil i hold"
                  checked={localSettings.teamsEnabled}
                  onChange={v => handleLocalChange('teamsEnabled', v)}
                />
              </div>
              <p className="text-sm text-board-text-dimmer mb-4">
                Holdene skiftes til at vende en ledetråd og gætte. Det hold, der gætter rigtigt, får point for hver ledetråd, der er tilbage.
              </p>
              {localSettings.teamsEnabled && (
                <div className="space-y-2">
                  {localSettings.teamNames.map((name, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        name={`team-${i}`}
                        aria-label={`Navn på hold ${i + 1}`}
                        value={name}
                        maxLength={20}
                        onChange={e => {
                          const names = [...localSettings.teamNames];
                          names[i] = e.target.value;
                          handleLocalChange('teamNames', names);
                        }}
                        className="flex-1 min-w-0 px-3 py-2 rounded-board bg-board-bg border border-[rgba(212,168,84,0.08)] focus:border-board-gold outline-none text-board-text"
                      />
                      <button
                        type="button"
                        disabled={localSettings.teamNames.length <= 2}
                        onClick={() => handleLocalChange('teamNames', localSettings.teamNames.filter((_, j) => j !== i))}
                        aria-label={`Fjern hold ${i + 1}`}
                        className="p-2 rounded-board text-board-special hover:bg-[rgba(200,132,90,0.1)] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {localSettings.teamNames.length < MAX_TEAMS && (
                      <button
                        type="button"
                        onClick={() => handleLocalChange('teamNames', [...localSettings.teamNames, `Hold ${localSettings.teamNames.length + 1}`])}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-board text-sm bg-board-surface-active text-board-text-secondary hover:text-board-gold border border-[rgba(212,168,84,0.1)]"
                      >
                        <Plus className="w-4 h-4" />
                        Tilføj hold
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Nulstil holdenes point?')) resetTeamScores();
                      }}
                      className="px-3 py-1.5 rounded-board text-sm text-board-text-dim hover:text-board-text-secondary border border-dashed border-[rgba(212,168,84,0.2)]"
                    >
                      Nulstil point
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Game Difficulty */}
          <section className="bg-board-surface-alt rounded-board p-4 sm:p-6 border border-[rgba(212,168,84,0.06)]">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-heading text-board-text">
              <Gauge className="w-5 h-5 text-board-text-dim" />
              Sværhedsgrad
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4" role="radiogroup" aria-label="Sværhedsniveau">
              {DIFFICULTY_PRESETS.map(preset => {
                const active = matchPreset(localSettings)?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      setLocalSettings(prev => ({ ...prev, ...presetValues(preset) }));
                      setHasChanges(true);
                    }}
                    className={`text-left p-3 rounded-board border-[1.5px] transition-colors ${
                      active
                        ? 'bg-board-surface-active border-board-gold'
                        : 'bg-board-surface border-[rgba(212,168,84,0.1)] hover:border-[rgba(212,168,84,0.25)]'
                    }`}
                  >
                    <span className={`block font-semibold ${active ? 'text-board-text' : 'text-board-text-secondary'}`}>{preset.label}</span>
                    <span className="block text-xs text-board-text-dim mt-1">{preset.description}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-board-text-dimmer mb-4">
              {matchPreset(localSettings) ? 'Du kan finjustere nedenfor.' : 'Egne indstillinger. Vælg et niveau ovenfor for at starte forfra.'}
            </p>

            {localSettings.mode === 'guess' && (
              <div className="flex items-center justify-between gap-4 p-3 mb-4 rounded-board bg-board-surface">
                <div>
                  <p className="font-medium">Tilpas automatisk</p>
                  <p className="text-xs text-board-text-dimmer mt-0.5">
                    Gør kortene sværere, når I gætter tidligt, og lettere, når I går i stå.
                  </p>
                </div>
                <Toggle
                  label="Tilpas sværhed automatisk"
                  checked={localSettings.autoDifficulty}
                  onChange={v => handleLocalChange('autoDifficulty', v)}
                />
              </div>
            )}

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
                      className="absolute w-full h-2 dual-range-slider"
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
                      className="absolute w-full h-2 dual-range-slider"
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
          <section className="bg-board-surface-alt rounded-board p-4 sm:p-6 border border-[rgba(212,168,84,0.06)]">
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

            {localSettings.mode !== 'reader' && (
              <p className="mb-4 text-sm text-board-text-dimmer">
                Special-ledetråde er handlinger til brætspillet og bruges kun i Oplæser-tilstand.
              </p>
            )}

            {/* Number per game selector */}
            <div className="mb-5 p-3 rounded-board bg-board-surface border border-[rgba(212,168,84,0.06)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="font-medium text-sm">Antal per spil</span>
                  <p className="text-xs text-board-text-dimmer mt-0.5">Vælg hvor mange der skal med</p>
                </div>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4, 5].map(num => {
                    const disabled = num > localSettings.numberOfClues - 1;
                    return (
                      <button
                        key={num}
                        disabled={disabled}
                        onClick={() => handleLocalChange('numberOfSpecialClues', num)}
                        className={`w-9 h-9 rounded-board font-medium text-sm transition-all ${
                          localSettings.numberOfSpecialClues === num
                            ? 'bg-board-gold text-board-bg shadow-sm'
                            : 'bg-board-surface-active hover:bg-board-surface-active text-board-text-muted hover:text-board-text-secondary border border-[rgba(212,168,84,0.08)]'
                        } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {localSettings.specialCluesConfig.map((clueConfig, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-board bg-board-surface hover:bg-board-surface-active transition-colors"
                >
                  <p className="flex-1 min-w-0 text-board-text-secondary text-sm font-medium">{clueConfig.text}</p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <select
                      aria-label={`Hyppighed for ${clueConfig.text}`}
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
                      aria-label={`Fjern ${clueConfig.text}`}
                      className="p-2 rounded-board hover:bg-[rgba(200,132,90,0.1)] text-board-special transition-colors"
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
          <section className="bg-board-surface-alt rounded-board p-4 sm:p-6 border border-[rgba(212,168,84,0.06)]">
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
          <section className="bg-board-surface-alt rounded-board p-4 sm:p-6 border border-[rgba(212,168,84,0.06)]">
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

      {hasChanges && (
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] bg-board-bg/95 border-t border-[rgba(212,168,84,0.12)]">
          <button
            onClick={handleSaveSettings}
            disabled={!categoriesValid}
            className="w-full flex items-center justify-center gap-2 py-3 bg-board-gold disabled:opacity-50 text-board-bg font-semibold rounded-board"
          >
            <Save className="w-4 h-4" />
            {categoriesValid ? 'Gem ændringer' : `Vælg ${ACTIVE_COUNT} kategorier`}
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;

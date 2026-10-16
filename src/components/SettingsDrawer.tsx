import React, { useState } from 'react';
import { useMotion } from '../context/MotionContext';
import {
  X,
  RotateCcw,
  Download,
  Upload,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Eye,
  Shield,
  Layers,
  Zap,
} from 'lucide-react';
import {
  AnimationSpeed,
  CursorEffects,
  MotionIntensity,
  ParallaxIntensity,
  ThemeMode,
} from '../types';
import { StudioLogo, StudioLogoStyle } from './StudioLogo';

export const SettingsDrawer: React.FC = () => {
  const {
    settings,
    isSettingsOpen,
    setIsSettingsOpen,
    updateSetting,
    resetDefaults,
    downloadConfigFile,
    importConfigJSON,
    copyConfigToClipboard,
    playFeedbackSound,
  } = useMotion();

  const [copySuccess, setCopySuccess] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ error?: string; success?: boolean }>({});

  if (!isSettingsOpen) return null;

  const handleCopy = async () => {
    const ok = await copyConfigToClipboard();
    if (ok) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) {
      setImportStatus({ error: 'Please paste configuration JSON.' });
      return;
    }
    const res = importConfigJSON(importText);
    if (res.success) {
      setImportStatus({ success: true });
      setTimeout(() => {
        setImportStatus({});
        setImportModalOpen(false);
        setImportText('');
      }, 1000);
    } else {
      setImportStatus({ error: res.error || 'Failed to parse JSON.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
        const res = importConfigJSON(content);
        if (res.success) {
          setImportStatus({ success: true });
          setTimeout(() => {
            setImportStatus({});
            setImportModalOpen(false);
            setImportText('');
          }, 1000);
        } else {
          setImportStatus({ error: res.error });
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          playFeedbackSound('click');
          setIsSettingsOpen(false);
        }}
      />

      {/* Drawer Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Personalized Motion & Visual Preferences"
        className="relative z-10 w-full max-w-md h-full flex flex-col border-l shadow-2xl transition-all overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-canvas)',
          borderColor: 'var(--border-hover)',
        }}
      >
        {/* Sticky Header */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-6 py-5 border-b backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(var(--bg-canvas), 0.95)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 opacity-75" />
            <h3
              className="text-base font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
            >
              Motion & Visual Settings
            </h3>
          </div>

          <button
            onClick={() => {
              playFeedbackSound('click');
              setIsSettingsOpen(false);
            }}
            aria-label="Close Settings Drawer"
            className="p-1.5 rounded-lg border hover:border-white/30 cursor-pointer"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-main)',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-8 flex-1">
          
          {/* E. Visual Theme Preference */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Visual Theme
              </label>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Active: {settings.theme}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dark' as ThemeMode, label: 'Dark', icon: Moon },
                { id: 'light' as ThemeMode, label: 'Light', icon: Sun },
                { id: 'system' as ThemeMode, label: 'System', icon: Laptop },
              ].map(th => {
                const isSelected = settings.theme === th.id;
                const Icon = th.icon;
                return (
                  <button
                    key={th.id}
                    onClick={() => {
                      playFeedbackSound('toggle');
                      updateSetting('theme', th.id);
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected ? 'font-semibold shadow-xs' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      borderColor: isSelected ? 'var(--border-hover)' : 'var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--accent-focal)' : 'var(--bg-surface)',
                      color: isSelected ? 'var(--accent-inverted)' : 'var(--text-main)',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{th.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Studio Brand Mark Style */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Brand Emblem Style
              </label>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">
                {settings.logoStyle || 'monolith'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'monolith' as StudioLogoStyle, label: '01 Monolith' },
                { id: 'crucible' as StudioLogoStyle, label: '02 Crucible' },
                { id: 'prism' as StudioLogoStyle, label: '03 Prism' },
              ].map(item => {
                const isSelected = (settings.logoStyle || 'monolith') === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      playFeedbackSound('click');
                      updateSetting('logoStyle', item.id);
                    }}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer"
                    style={{
                      borderColor: isSelected ? 'var(--accent-focal)' : 'var(--border-subtle)',
                      backgroundColor: isSelected ? 'rgba(52, 211, 153, 0.12)' : 'var(--bg-surface)',
                      color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                    }}
                  >
                    <StudioLogo size={24} variant="emblem" style={item.id} />
                    <span className="font-mono text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* A. Motion Intensity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Motion Intensity
              </label>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                {settings.motionIntensity}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl border" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
              {(['off', 'low', 'medium', 'high'] as MotionIntensity[]).map(val => (
                <button
                  key={val}
                  onClick={() => {
                    playFeedbackSound('toggle');
                    updateSetting('motionIntensity', val);
                  }}
                  className={`py-1.5 text-xs font-medium capitalize rounded-lg transition-all cursor-pointer ${
                    settings.motionIntensity === val ? 'font-semibold' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: settings.motionIntensity === val ? 'var(--accent-focal)' : 'transparent',
                    color: settings.motionIntensity === val ? 'var(--accent-inverted)' : 'var(--text-main)',
                  }}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* B. Parallax Intensity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Parallax Intensity
              </label>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                {settings.parallaxIntensity}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl border" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
              {(['off', 'subtle', 'balanced', 'strong'] as ParallaxIntensity[]).map(val => (
                <button
                  key={val}
                  onClick={() => {
                    playFeedbackSound('toggle');
                    updateSetting('parallaxIntensity', val);
                  }}
                  className={`py-1.5 text-xs font-medium capitalize rounded-lg transition-all cursor-pointer ${
                    settings.parallaxIntensity === val ? 'font-semibold' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: settings.parallaxIntensity === val ? 'var(--accent-focal)' : 'transparent',
                    color: settings.parallaxIntensity === val ? 'var(--accent-inverted)' : 'var(--text-main)',
                  }}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* C. Animation Speed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Animation Speed
              </label>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                {settings.animationSpeed}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl border" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
              {(['slow', 'normal', 'fast'] as AnimationSpeed[]).map(val => (
                <button
                  key={val}
                  onClick={() => {
                    playFeedbackSound('toggle');
                    updateSetting('animationSpeed', val);
                  }}
                  className={`py-1.5 text-xs font-medium capitalize rounded-lg transition-all cursor-pointer ${
                    settings.animationSpeed === val ? 'font-semibold' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: settings.animationSpeed === val ? 'var(--accent-focal)' : 'transparent',
                    color: settings.animationSpeed === val ? 'var(--accent-inverted)' : 'var(--text-main)',
                  }}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* D. Cursor Effects */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Custom Cursor Effects
              </label>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                {settings.cursorEffects}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl border" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
              {(['disabled', 'minimal', 'full'] as CursorEffects[]).map(val => (
                <button
                  key={val}
                  onClick={() => {
                    playFeedbackSound('toggle');
                    updateSetting('cursorEffects', val);
                  }}
                  className={`py-1.5 text-xs font-medium capitalize rounded-lg transition-all cursor-pointer ${
                    settings.cursorEffects === val ? 'font-semibold' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: settings.cursorEffects === val ? 'var(--accent-focal)' : 'transparent',
                    color: settings.cursorEffects === val ? 'var(--accent-inverted)' : 'var(--text-main)',
                  }}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* F. Accessibility & Toggles */}
          <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Accessibility Overrides
            </div>

            <div className="space-y-2">
              {[
                {
                  key: 'reducedMotion' as const,
                  label: 'Force Reduced Motion',
                  desc: 'Disable all non-essential transition loops',
                },
                {
                  key: 'disableFloatingElements' as const,
                  label: 'Disable Floating Elements',
                  desc: 'Lock 3D cards and background coordinates in place',
                },
                {
                  key: 'disableHoverMovement' as const,
                  label: 'Disable Hover Movement',
                  desc: 'Disable pointer tilt and magnetic cursor inertia',
                },
                {
                  key: 'simplifiedVisualEffects' as const,
                  label: 'Simplified Visual Effects',
                  desc: 'Remove grain overlay and backdrop blur filters',
                },
                {
                  key: 'soundEnabled' as const,
                  label: 'Synthesized Sound Effects',
                  desc: 'Subtle Web Audio micro-feedback on interaction',
                },
              ].map(item => {
                const isActive = settings[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => {
                      playFeedbackSound('toggle');
                      updateSetting(item.key, !isActive);
                    }}
                    className="p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors hover:border-white/20 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold" style={{ color: 'var(--text-main)' }}>
                        {item.label}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        {item.desc}
                      </div>
                    </div>

                    <div
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors relative shrink-0 ${
                        isActive ? 'bg-emerald-500' : 'bg-neutral-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          isActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* G. Actions & Export/Import Controls */}
          <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Configuration Actions
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-lg border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 hover:border-white/30 cursor-pointer"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                }}
              >
                {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copySuccess ? 'Copied' : 'Copy JSON'}</span>
              </button>

              <button
                onClick={downloadConfigFile}
                className="p-2.5 rounded-lg border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 hover:border-white/30 cursor-pointer"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => {
                  playFeedbackSound('click');
                  setImportModalOpen(true);
                }}
                className="p-2.5 rounded-lg border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 hover:border-white/30 cursor-pointer"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                }}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
              </button>

              <button
                onClick={resetDefaults}
                className="p-2.5 rounded-lg border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 hover:border-white/30 cursor-pointer"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 z-20 px-6 py-4 border-t backdrop-blur-md flex items-center justify-between"
          style={{
            backgroundColor: 'rgba(var(--bg-canvas), 0.95)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Saved to local profile
          </span>
          <button
            onClick={() => {
              playFeedbackSound('success');
              setIsSettingsOpen(false);
            }}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer"
            style={{
              backgroundColor: 'var(--accent-focal)',
              color: 'var(--accent-inverted)',
            }}
          >
            Apply & Close
          </button>
        </div>
      </div>

      {/* Import Configuration Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-lg p-6 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--bg-canvas)',
              borderColor: 'var(--border-hover)',
            }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>
                Import Motion Configuration
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="p-1 rounded-md border hover:border-white/30"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {importStatus.error && (
              <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono">
                {importStatus.error}
              </div>
            )}

            {importStatus.success && (
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                Configuration successfully verified and applied!
              </div>
            )}

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                  Paste JSON Configuration
                </label>
                <textarea
                  rows={6}
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  placeholder='{"theme": "dark", "motionIntensity": "high", ...}'
                  className="w-full p-3 rounded-lg border font-mono text-xs bg-transparent"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Or upload .json file:</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-mono file:bg-neutral-800 file:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono uppercase rounded-lg border hover:border-white/30"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg"
                  style={{
                    backgroundColor: 'var(--accent-focal)',
                    color: 'var(--accent-inverted)',
                  }}
                >
                  Validate & Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  MotionIntensity,
  MotionSettings,
  ParallaxIntensity,
  AnimationSpeed,
  CursorEffects,
  ThemeMode,
} from '../types';
import { playSound } from '../utils/audio';

const STORAGE_KEY = 'design_foundry_motion_settings_v1';

export const DEFAULT_SETTINGS: MotionSettings = {
  theme: 'dark',
  motionIntensity: 'medium',
  parallaxIntensity: 'balanced',
  animationSpeed: 'normal',
  cursorEffects: 'full',
  reducedMotion: false,
  disableFloatingElements: false,
  disableHoverMovement: false,
  simplifiedVisualEffects: false,
  soundEnabled: false,
  logoStyle: 'monolith',
};

interface MotionContextValue {
  settings: MotionSettings;
  effectiveTheme: 'dark' | 'light';
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  updateSetting: <K extends keyof MotionSettings>(key: K, value: MotionSettings[K]) => void;
  setAllSettings: (newSettings: MotionSettings) => void;
  resetDefaults: () => void;
  exportConfigJSON: () => string;
  downloadConfigFile: () => void;
  importConfigJSON: (jsonString: string) => { success: boolean; error?: string };
  copyConfigToClipboard: () => Promise<boolean>;
  playFeedbackSound: (type: 'hover' | 'click' | 'toggle' | 'success' | 'reveal' | 'chime') => void;
}

const MotionContext = createContext<MotionContextValue | undefined>(undefined);

export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<MotionSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load motion settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [systemDark, setSystemDark] = useState<boolean>(true);

  // Monitor system color scheme
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Monitor system reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches && !settings.reducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  const effectiveTheme: 'dark' | 'light' =
    settings.theme === 'system' ? (systemDark ? 'dark' : 'light') : settings.theme;

  // Apply CSS custom properties and theme data attribute
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', effectiveTheme);

    // Motion multiplier
    let motionMult = 1.0;
    if (settings.reducedMotion || settings.disableFloatingElements || settings.motionIntensity === 'off') {
      motionMult = 0;
    } else if (settings.motionIntensity === 'low') {
      motionMult = 0.45;
    } else if (settings.motionIntensity === 'medium') {
      motionMult = 1.0;
    } else if (settings.motionIntensity === 'high') {
      motionMult = 1.6;
    }
    root.style.setProperty('--motion-mult', motionMult.toString());

    // Parallax multiplier
    let parallaxMult = 1.0;
    if (settings.reducedMotion || settings.parallaxIntensity === 'off') {
      parallaxMult = 0;
    } else if (settings.parallaxIntensity === 'subtle') {
      parallaxMult = 0.4;
    } else if (settings.parallaxIntensity === 'balanced') {
      parallaxMult = 1.0;
    } else if (settings.parallaxIntensity === 'strong') {
      parallaxMult = 1.8;
    }
    root.style.setProperty('--parallax-mult', parallaxMult.toString());

    // Animation speed multiplier
    let speedMult = 1.0;
    if (settings.animationSpeed === 'slow') speedMult = 0.7;
    else if (settings.animationSpeed === 'normal') speedMult = 1.0;
    else if (settings.animationSpeed === 'fast') speedMult = 1.45;
    root.style.setProperty('--speed-mult', speedMult.toString());

    // Cursor enabled
    const cursorEnabled = settings.cursorEffects === 'disabled' ? '0' : '1';
    root.style.setProperty('--cursor-enabled', cursorEnabled);

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save motion settings to localStorage', e);
    }
  }, [settings, effectiveTheme]);

  const updateSetting = <K extends keyof MotionSettings>(key: K, value: MotionSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const setAllSettings = (newSettings: MotionSettings) => {
    setSettings(newSettings);
  };

  const resetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    playSound('toggle', settings.soundEnabled);
  };

  const exportConfigJSON = (): string => {
    return JSON.stringify(settings, null, 2);
  };

  const downloadConfigFile = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportConfigJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'design-foundry-motion-config.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    playSound('success', settings.soundEnabled);
  };

  const validateConfig = (parsed: any): { valid: boolean; error?: string } => {
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'Configuration must be a valid JSON object.' };
    }
    const validThemes: ThemeMode[] = ['dark', 'light', 'system'];
    const validMotions: MotionIntensity[] = ['off', 'low', 'medium', 'high'];
    const validParallaxes: ParallaxIntensity[] = ['off', 'subtle', 'balanced', 'strong'];
    const validSpeeds: AnimationSpeed[] = ['slow', 'normal', 'fast'];
    const validCursors: CursorEffects[] = ['disabled', 'minimal', 'full'];

    if (parsed.theme && !validThemes.includes(parsed.theme)) {
      return { valid: false, error: `Invalid theme: ${parsed.theme}` };
    }
    if (parsed.motionIntensity && !validMotions.includes(parsed.motionIntensity)) {
      return { valid: false, error: `Invalid motion intensity: ${parsed.motionIntensity}` };
    }
    if (parsed.parallaxIntensity && !validParallaxes.includes(parsed.parallaxIntensity)) {
      return { valid: false, error: `Invalid parallax intensity: ${parsed.parallaxIntensity}` };
    }
    if (parsed.animationSpeed && !validSpeeds.includes(parsed.animationSpeed)) {
      return { valid: false, error: `Invalid animation speed: ${parsed.animationSpeed}` };
    }
    if (parsed.cursorEffects && !validCursors.includes(parsed.cursorEffects)) {
      return { valid: false, error: `Invalid cursor effect: ${parsed.cursorEffects}` };
    }
    return { valid: true };
  };

  const importConfigJSON = (jsonString: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      const validation = validateConfig(parsed);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      setSettings(prev => ({
        ...prev,
        ...parsed,
        reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : prev.reducedMotion,
        disableFloatingElements:
          typeof parsed.disableFloatingElements === 'boolean'
            ? parsed.disableFloatingElements
            : prev.disableFloatingElements,
        disableHoverMovement:
          typeof parsed.disableHoverMovement === 'boolean' ? parsed.disableHoverMovement : prev.disableHoverMovement,
        simplifiedVisualEffects:
          typeof parsed.simplifiedVisualEffects === 'boolean'
            ? parsed.simplifiedVisualEffects
            : prev.simplifiedVisualEffects,
        soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : prev.soundEnabled,
      }));
      playSound('success', true);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Invalid JSON syntax.' };
    }
  };

  const copyConfigToClipboard = async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(exportConfigJSON());
      playSound('success', settings.soundEnabled);
      return true;
    } catch {
      return false;
    }
  };

  const playFeedbackSound = (type: 'hover' | 'click' | 'toggle' | 'success' | 'reveal' | 'chime') => {
    playSound(type, settings.soundEnabled);
  };

  return (
    <MotionContext.Provider
      value={{
        settings,
        effectiveTheme,
        isSettingsOpen,
        setIsSettingsOpen,
        updateSetting,
        setAllSettings,
        resetDefaults,
        exportConfigJSON,
        downloadConfigFile,
        importConfigJSON,
        copyConfigToClipboard,
        playFeedbackSound,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
};

export const useMotion = () => {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  return context;
};

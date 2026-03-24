'use client';

import { useState, useCallback, useEffect } from 'react';

interface Settings {
  sound: boolean;
  volume: number;
  mouseTrail: boolean;
  reduceMotion: boolean;
  emojiMode: boolean;
  particleIntensity: number;
}

const DEFAULT_SETTINGS: Settings = {
  sound: true,
  volume: 70,
  mouseTrail: true,
  reduceMotion: false,
  emojiMode: false,
  particleIntensity: 3,
};

const STORAGE_KEY = 'smashplay-settings';

function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

export function useParentPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(v => !v), []);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
  }, []);

  return { isOpen, open, close, toggle, settings, updateSetting };
}

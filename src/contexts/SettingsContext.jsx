import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Temas de tabuleiro disponíveis
 */
export const BOARD_THEMES = {
  classic: {
    id: 'classic',
    name: 'Clássico',
    description: 'Cores tradicionais de madeira',
    light: '#f0d9b5',
    dark: '#b58863',
  },
  green: {
    id: 'green',
    name: 'Verde',
    description: 'Estilo Chess.com',
    light: '#eeeed2',
    dark: '#769656',
  },
  blue: {
    id: 'blue',
    name: 'Azul',
    description: 'Moderno e clean',
    light: '#dee3e6',
    dark: '#8ca2ad',
  },
  purple: {
    id: 'purple',
    name: 'Roxo',
    description: 'Elegante e diferente',
    light: '#f0d9ff',
    dark: '#9e7cb5',
  },
  gray: {
    id: 'gray',
    name: 'Cinza',
    description: 'Minimalista e neutro',
    light: '#f5f5f5',
    dark: '#bbbbbb',
  },
};

/**
 * Configurações padrão de som
 */
const DEFAULT_SOUND_SETTINGS = {
  enabled: true,
  volume: 0.7,
  sounds: {
    move: true,
    capture: true,
    check: true,
    matchFound: true,
    gameEnd: true,
  },
};

const STORAGE_KEY_BOARD = 'chess-board-theme';
const STORAGE_KEY_SOUND = 'chess-sound-settings';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  // Board theme state
  const [boardTheme, setBoardTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_BOARD);
      if (saved && BOARD_THEMES[saved]) {
        return saved;
      }
    }
    return 'classic';
  });

  // Sound settings state
  const [soundSettings, setSoundSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_SOUND);
        if (saved) {
          return { ...DEFAULT_SOUND_SETTINGS, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.error('Error parsing sound settings:', e);
      }
    }
    return DEFAULT_SOUND_SETTINGS;
  });

  // Persist board theme
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOARD, boardTheme);
  }, [boardTheme]);

  // Persist sound settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SOUND, JSON.stringify(soundSettings));
  }, [soundSettings]);

  // Get current board theme config
  const boardThemeConfig = BOARD_THEMES[boardTheme];

  // Update sound enabled
  const setSoundEnabled = useCallback((enabled) => {
    setSoundSettings(prev => ({ ...prev, enabled }));
  }, []);

  // Update sound volume
  const setSoundVolume = useCallback((volume) => {
    setSoundSettings(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  // Update individual sound setting
  const setSoundType = useCallback((type, enabled) => {
    setSoundSettings(prev => ({
      ...prev,
      sounds: { ...prev.sounds, [type]: enabled },
    }));
  }, []);

  // Check if a specific sound should play
  const shouldPlaySound = useCallback((type) => {
    return soundSettings.enabled && soundSettings.sounds[type];
  }, [soundSettings]);

  const value = {
    // Board theme
    boardTheme,
    boardThemeConfig,
    setBoardTheme,
    boardThemes: BOARD_THEMES,
    
    // Sound settings
    soundSettings,
    setSoundEnabled,
    setSoundVolume,
    setSoundType,
    shouldPlaySound,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export default SettingsContext;

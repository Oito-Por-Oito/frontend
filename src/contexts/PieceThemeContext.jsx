import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Temas de peças disponíveis
 * - classic: Imagens PNG tradicionais
 * - modern: SVGs com design contemporâneo
 * - minimalist: Símbolos Unicode estilizados
 */
export const PIECE_THEMES = {
  classic: {
    id: 'classic',
    name: 'Clássico',
    description: 'Peças tradicionais em estilo Staunton',
    type: 'image',
  },
  modern: {
    id: 'modern',
    name: 'Moderno',
    description: 'Design contemporâneo com cores vibrantes',
    type: 'svg',
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalista',
    description: 'Símbolos limpos e elegantes',
    type: 'unicode',
  },
};

const STORAGE_KEY = 'chess-piece-theme';

const PieceThemeContext = createContext(null);

export function PieceThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && PIECE_THEMES[saved]) {
        return saved;
      }
    }
    return 'classic';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = {
    theme,
    themeConfig: PIECE_THEMES[theme],
    setTheme,
    themes: PIECE_THEMES,
  };

  return (
    <PieceThemeContext.Provider value={value}>
      {children}
    </PieceThemeContext.Provider>
  );
}

export function usePieceTheme() {
  const context = useContext(PieceThemeContext);
  if (!context) {
    throw new Error('usePieceTheme must be used within a PieceThemeProvider');
  }
  return context;
}

export default PieceThemeContext;

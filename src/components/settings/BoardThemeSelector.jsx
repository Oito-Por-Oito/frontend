import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/contexts/SettingsContext';

/**
 * Preview de um mini tabuleiro com as cores do tema
 */
function BoardPreview({ theme, size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const cellSize = sizes[size];

  return (
    <div className="grid grid-cols-4 gap-0 rounded-lg overflow-hidden shadow-md">
      {Array.from({ length: 16 }).map((_, idx) => {
        const row = Math.floor(idx / 4);
        const col = idx % 4;
        const isLight = (row + col) % 2 === 0;
        
        return (
          <div
            key={idx}
            className={cellSize}
            style={{ backgroundColor: isLight ? theme.light : theme.dark }}
          />
        );
      })}
    </div>
  );
}

/**
 * Componente para selecionar o tema do tabuleiro
 */
export default function BoardThemeSelector({ compact = false }) {
  const { boardTheme, setBoardTheme, boardThemes } = useSettings();

  if (compact) {
    return (
      <div className="flex gap-2 flex-wrap">
        {Object.values(boardThemes).map((theme) => (
          <button
            key={theme.id}
            onClick={() => setBoardTheme(theme.id)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${boardTheme === theme.id 
                ? 'bg-gold text-black' 
                : 'bg-surface-secondary text-foreground hover:bg-surface-secondary/80'
              }
            `}
          >
            <div className="grid grid-cols-2 gap-0 w-4 h-4 rounded overflow-hidden">
              <div style={{ backgroundColor: theme.light }} />
              <div style={{ backgroundColor: theme.dark }} />
              <div style={{ backgroundColor: theme.dark }} />
              <div style={{ backgroundColor: theme.light }} />
            </div>
            {theme.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Cores do Tabuleiro</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(boardThemes).map((theme) => (
          <motion.button
            key={theme.id}
            onClick={() => setBoardTheme(theme.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-4 rounded-xl border-2 transition-all text-left
              ${boardTheme === theme.id 
                ? 'border-gold bg-gold/10' 
                : 'border-surface-secondary bg-surface-primary hover:border-gold/50'
              }
            `}
          >
            {/* Badge de selecionado */}
            {boardTheme === theme.id && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-gold rounded-full" />
            )}

            {/* Preview do tabuleiro */}
            <div className="flex justify-center mb-3">
              <BoardPreview theme={theme} size="md" />
            </div>

            {/* Info do tema */}
            <h4 className="font-semibold text-foreground">{theme.name}</h4>
            <p className="text-sm text-muted-foreground">{theme.description}</p>
            
            {/* Cores */}
            <div className="flex gap-2 mt-2">
              <div 
                className="w-6 h-6 rounded border border-white/20"
                style={{ backgroundColor: theme.light }}
                title="Casa clara"
              />
              <div 
                className="w-6 h-6 rounded border border-white/20"
                style={{ backgroundColor: theme.dark }}
                title="Casa escura"
              />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

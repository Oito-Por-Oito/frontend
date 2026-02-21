import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Circle } from 'lucide-react';
import { usePieceTheme, PIECE_THEMES } from '@/contexts/PieceThemeContext';
import ThemedChessPiece from './ThemedChessPiece';

// Ícones para cada tema
const themeIcons = {
  classic: Crown,
  modern: Sparkles,
  minimalist: Circle,
};

/**
 * Componente para selecionar o tema das peças de xadrez
 */
export default function PieceThemeSelector({ compact = false }) {
  const { theme, setTheme, themes } = usePieceTheme();

  const previewPieces = [
    { type: 'k', color: 'w' },
    { type: 'q', color: 'w' },
    { type: 'n', color: 'b' },
    { type: 'p', color: 'b' },
  ];

  if (compact) {
    return (
      <div className="flex gap-2">
        {Object.values(themes).map((t) => {
          const Icon = themeIcons[t.id] || Crown;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${theme === t.id 
                  ? 'bg-gold text-black' 
                  : 'bg-surface-secondary text-foreground hover:bg-surface-secondary/80'
                }
              `}
              title={t.name}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{t.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Tema das Peças</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(themes).map((t) => (
          <motion.button
            key={t.id}
            onClick={() => setTheme(t.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-4 rounded-xl border-2 transition-all text-left
              ${theme === t.id 
                ? 'border-gold bg-gold/10' 
                : 'border-surface-secondary bg-surface-primary hover:border-gold/50'
              }
            `}
          >
            {/* Badge de selecionado */}
            {theme === t.id && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-gold rounded-full" />
            )}

            {/* Preview das peças */}
            <div className="flex justify-center gap-1 mb-3 p-2 bg-[#b58863] rounded-lg">
              {previewPieces.map((piece, idx) => (
                <div 
                  key={idx} 
                  className={`w-10 h-10 flex items-center justify-center rounded ${idx % 2 === 0 ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'}`}
                >
                  <ThemedChessPiece 
                    piece={piece} 
                    size="sm" 
                    themeOverride={t.id}
                  />
                </div>
              ))}
            </div>

            {/* Info do tema */}
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = themeIcons[t.id] || Crown;
                return <Icon size={16} className="text-gold" />;
              })()}
              <h4 className="font-semibold text-foreground">{t.name}</h4>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

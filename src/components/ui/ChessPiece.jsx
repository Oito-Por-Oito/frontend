import React, { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * Mapeamento de peças para arquivos de imagem
 * Formato: {cor}{Tipo} -> arquivo.png
 */
const PIECE_MAP = {
  bK: 'bK.png', bQ: 'bQ.png', bR: 'bR.png',
  bN: 'bN.png', bB: 'bB.png', bP: 'bP.png',
  wK: 'wK.png', wQ: 'wQ.png', wR: 'wR.png',
  wN: 'wN.png', wB: 'wB.png', wP: 'wP.png',
};

/**
 * Tamanhos predefinidos para o componente
 */
const SIZE_CLASSES = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10 md:w-12 md:h-12',
  lg: 'w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16',
  xl: 'w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20',
};

/**
 * Componente reutilizável para exibir peças de xadrez
 * 
 * @param {Object} props
 * @param {Object} piece - Objeto da peça { type: 'k'|'q'|'r'|'b'|'n'|'p', color: 'w'|'b' }
 * @param {'sm'|'md'|'lg'|'xl'} size - Tamanho da peça (default: 'md')
 * @param {boolean} animated - Se deve usar animação de entrada (default: false)
 * @param {string} layoutId - ID único para animações de layout (Framer Motion)
 * @param {boolean} shadow - Se deve exibir sombra (default: true)
 * @param {string} className - Classes CSS adicionais
 */
function ChessPiece({ 
  piece, 
  size = 'md', 
  animated = false,
  layoutId,
  shadow = true,
  className = '' 
}) {
  if (!piece || !piece.type || !piece.color) return null;

  const key = piece.color + piece.type.toUpperCase();
  const imagePath = PIECE_MAP[key];
  
  if (!imagePath) return null;

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const shadowClass = shadow ? 'drop-shadow-[2px_3px_3px_rgba(0,0,0,0.4)]' : '';
  
  const commonProps = {
    src: `/assets/pieces/${imagePath}`,
    alt: key,
    className: `${sizeClass} ${shadowClass} pointer-events-none select-none ${className}`,
    draggable: false,
    style: { maxWidth: '98%', maxHeight: '98%' },
  };

  if (animated) {
    return (
      <motion.img
        {...commonProps}
        layoutId={layoutId}
        initial={{ opacity: 0.6, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      />
    );
  }

  return <img {...commonProps} />;
}

/**
 * Componente para modal de promoção de peão
 * 
 * @param {Object} props
 * @param {'white'|'black'} color - Cor do jogador fazendo a promoção
 * @param {Function} onSelect - Callback quando uma peça é selecionada
 * @param {Function} onCancel - Callback para cancelar a promoção
 */
export function PromotionPicker({ color, onSelect, onCancel }) {
  const colorPrefix = color === 'white' ? 'w' : 'b';
  const promotionPieces = ['q', 'r', 'b', 'n'];

  return (
    <div 
      className="absolute inset-0 bg-black/60 flex items-center justify-center z-20"
      onClick={onCancel}
    >
      <motion.div 
        className="bg-surface-secondary p-4 rounded-xl shadow-2xl border border-gold/20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-foreground text-center mb-3 font-semibold">
          Escolha a promoção
        </p>
        <div className="flex gap-2">
          {promotionPieces.map(pieceType => (
            <button
              key={pieceType}
              onClick={() => onSelect(pieceType)}
              className="w-14 h-14 md:w-16 md:h-16 bg-[#f0d9b5] rounded-lg flex items-center justify-center 
                         hover:scale-110 hover:ring-2 hover:ring-gold transition-all"
            >
              <ChessPiece 
                piece={{ type: pieceType, color: colorPrefix }}
                size="md"
                shadow={true}
              />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Utilitário para obter o caminho da imagem de uma peça
 * Útil quando você precisa apenas do path sem o componente completo
 */
export function getPieceImagePath(piece) {
  if (!piece || !piece.type || !piece.color) return null;
  const key = piece.color + piece.type.toUpperCase();
  const imagePath = PIECE_MAP[key];
  return imagePath ? `/assets/pieces/${imagePath}` : null;
}

/**
 * Exporta o mapa de peças para uso externo se necessário
 */
export { PIECE_MAP };

export default memo(ChessPiece);

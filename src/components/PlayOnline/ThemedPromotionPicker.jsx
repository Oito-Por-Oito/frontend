import React from 'react';
import { motion } from 'framer-motion';
import ThemedChessPiece from '@/components/ui/ThemedChessPiece';

/**
 * Componente para modal de promoção de peão com suporte a temas
 */
export default function ThemedPromotionPicker({ color, onSelect, onCancel }) {
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
              <ThemedChessPiece 
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

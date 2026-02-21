import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';

const RESULT_CONFIG = {
  win: {
    title: 'Vitória!',
    subtitle: 'Parabéns, você venceu!',
    emoji: '🎉',
    bgClass: 'from-green-500/20 to-green-900/20',
    borderClass: 'border-green-500'
  },
  loss: {
    title: 'Derrota',
    subtitle: 'O computador venceu',
    emoji: '😔',
    bgClass: 'from-red-500/20 to-red-900/20',
    borderClass: 'border-red-500'
  },
  draw: {
    title: 'Empate',
    subtitle: 'A partida terminou empatada',
    emoji: '🤝',
    bgClass: 'from-blue-500/20 to-blue-900/20',
    borderClass: 'border-blue-500'
  }
};

const REASON_TEXT = {
  checkmate: 'Xeque-mate',
  stalemate: 'Afogamento',
  repetition: 'Repetição tripla',
  insufficient: 'Material insuficiente',
  fifty_moves: 'Regra dos 50 lances',
  timeout: 'Tempo esgotado',
  resignation: 'Desistência'
};

export default function GameResultModal({ 
  isOpen, 
  result, // 'win' | 'loss' | 'draw'
  reason, // 'checkmate' | 'stalemate' | etc.
  bot,
  moves = [],
  playerColor = 'w',
  onRematch,
  onNewGame,
  onClose
}) {
  if (!isOpen) return null;

  const config = RESULT_CONFIG[result] || RESULT_CONFIG.draw;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`
            bg-gradient-to-br ${config.bgClass} 
            border-2 ${config.borderClass}
            rounded-2xl p-6 max-w-md w-full shadow-2xl
          `}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-6xl mb-3"
            >
              {config.emoji}
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {config.title}
            </h2>
            <p className="text-muted-foreground">
              {config.subtitle}
            </p>
            {reason && (
              <p className="text-sm text-gold mt-2">
                {REASON_TEXT[reason] || reason}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="bg-surface-primary/50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gold">{moves.length}</div>
                <div className="text-xs text-muted-foreground">Lances</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                  <span>{bot?.avatar}</span>
                  <span className="text-sm">{bot?.rating}</span>
                </div>
                <div className="text-xs text-muted-foreground">Adversário</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onRematch}
            >
              ♻️ Revanche
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={onNewGame}
            >
              🎮 Novo Jogo
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

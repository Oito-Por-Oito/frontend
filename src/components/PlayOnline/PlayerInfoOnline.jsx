import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimeWithTenths } from '@/lib/gameHelpers';
import { playLowTimeSound } from '@/hooks/useSound';

export default function PlayerInfoOnline({
  player,
  rating,
  timeLeft,
  isActive,
  isMe,
  captured = [],
}) {
  const isLowTime = timeLeft < 30000;
  const isCriticalTime = timeLeft < 10000;
  const isUrgentTime = timeLeft < 5000;

  React.useEffect(() => {
    if (isActive && isCriticalTime && timeLeft > 0) {
      playLowTimeSound();
    }
  }, [isActive, isCriticalTime, Math.floor(timeLeft / 1000)]);

  return (
    <div className={`
      relative flex items-center justify-between p-3 rounded-xl transition-all
      ${isActive
        ? `bg-surface-tertiary ring-2 ${isCriticalTime ? 'ring-red-500' : 'ring-gold'}`
        : 'bg-surface-secondary'
      }
      ${isMe ? 'border-l-4 border-gold' : ''}
    `}>
      {/* Efeito de pulso crítico */}
      <AnimatePresence>
        {isCriticalTime && isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: isUrgentTime ? 0.3 : 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-red-500 rounded-xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 relative z-10 min-w-0">
        <div className="relative shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-tertiary overflow-hidden border-2 border-gold/20">
            {player?.avatar_url ? (
              <img
                src={player.avatar_url}
                alt={player.display_name || player.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gold">
                {(player?.display_name || player?.username || '?')[0]?.toUpperCase()}
              </div>
            )}
          </div>
          {isActive && (
            <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full animate-pulse ${
              isCriticalTime ? 'bg-red-500' : 'bg-green-500'
            }`} />
          )}
        </div>

        <div className="min-w-0">
          <div className="font-semibold text-foreground text-sm truncate">
            {player?.display_name || player?.username || 'Jogador'}
            {isMe && <span className="text-xs text-gold ml-2">(você)</span>}
          </div>
          <div className="text-xs text-muted-foreground">
            Rating: {rating || 800}
          </div>
        </div>
      </div>

      {/* Peças capturadas */}
      {captured.length > 0 && (
        <div className="flex gap-0.5 text-base relative z-10 hidden sm:flex">
          {captured.map((piece, i) => (
            <span key={i} className="opacity-70">{piece}</span>
          ))}
        </div>
      )}

      {/* Timer */}
      <motion.div
        className={`
          relative font-mono text-xl sm:text-2xl font-bold px-3 sm:px-4 py-2 rounded-lg transition-colors z-10 overflow-hidden shrink-0
          ${isUrgentTime
            ? 'bg-red-600 text-white'
            : isCriticalTime
            ? 'bg-red-700 text-white'
            : isLowTime
            ? 'bg-red-900/50 text-red-300'
            : 'bg-surface-tertiary text-foreground'
          }
        `}
        animate={isCriticalTime && isActive ? {
          scale: isUrgentTime ? [1, 1.08, 1] : [1, 1.04, 1],
        } : {}}
        transition={{
          duration: isUrgentTime ? 0.3 : 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <AnimatePresence>
          {isCriticalTime && isActive && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                duration: isUrgentTime ? 0.5 : 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>

        {isCriticalTime && (
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            className="absolute -left-1 -top-1 text-xs"
          >
            ⚠️
          </motion.span>
        )}

        <span className="relative z-10">
          {formatTimeWithTenths(timeLeft)}
        </span>

        {isCriticalTime && isActive && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-yellow-400"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: timeLeft / 1000, ease: 'linear' }}
          />
        )}
      </motion.div>
    </div>
  );
}

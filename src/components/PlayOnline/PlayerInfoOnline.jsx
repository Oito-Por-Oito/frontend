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
  captured = [] 
}) {
  const isLowTime = timeLeft < 30000;
  const isCriticalTime = timeLeft < 10000;
  const isUrgentTime = timeLeft < 5000;

  // Tocar som de aviso quando o tempo está baixo (apenas para o jogador ativo)
  React.useEffect(() => {
    if (isActive && isCriticalTime && timeLeft > 0) {
      playLowTimeSound();
    }
  }, [isActive, isCriticalTime, Math.floor(timeLeft / 1000)]);

  return (
    <div className={`
      relative flex items-center justify-between p-3 rounded-xl transition-all
      ${isActive ? 'bg-[#2a2a2a] ring-2 ring-[#c29d5d]' : 'bg-[#1e1e1e]'}
      ${isMe ? 'border-l-4 border-[#c29d5d]' : ''}
      ${isCriticalTime && isActive ? 'ring-red-500' : ''}
    `}>
      {/* Efeito de pulso crítico no fundo */}
      <AnimatePresence>
        {isCriticalTime && isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: isUrgentTime ? 0.3 : 0.6, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-red-500 rounded-xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 relative z-10">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-[#333] overflow-hidden">
            {player?.avatar_url ? (
              <img 
                src={player.avatar_url} 
                alt={player.display_name || player.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[#c29d5d]">
                {(player?.display_name || player?.username || '?')[0]?.toUpperCase()}
              </div>
            )}
          </div>
          {isActive && (
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse ${
              isCriticalTime ? 'bg-red-500' : 'bg-green-500'
            }`} />
          )}
        </div>
        
        <div>
          <div className="font-semibold text-white">
            {player?.display_name || player?.username || 'Jogador'}
            {isMe && <span className="text-xs text-[#c29d5d] ml-2">(você)</span>}
          </div>
          <div className="text-sm text-gray-400">
            Rating: {rating || 800}
          </div>
        </div>
      </div>

      {/* Peças capturadas */}
      {captured.length > 0 && (
        <div className="flex gap-0.5 text-lg relative z-10">
          {captured.map((piece, i) => (
            <span key={i} className="opacity-70">{piece}</span>
          ))}
        </div>
      )}

      {/* Timer com indicador visual intenso */}
      <motion.div 
        className={`
          relative font-mono text-2xl font-bold px-4 py-2 rounded-lg transition-colors z-10 overflow-hidden
          ${isUrgentTime 
            ? 'bg-red-600 text-white' 
            : isCriticalTime 
              ? 'bg-red-700 text-white' 
              : isLowTime 
                ? 'bg-red-900/50 text-red-300' 
                : 'bg-[#333] text-white'
          }
        `}
        animate={isCriticalTime && isActive ? {
          scale: isUrgentTime ? [1, 1.08, 1] : [1, 1.04, 1],
        } : {}}
        transition={{
          duration: isUrgentTime ? 0.3 : 0.6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Efeito de brilho pulsante */}
        <AnimatePresence>
          {isCriticalTime && isActive && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                duration: isUrgentTime ? 0.5 : 1,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Ícone de alerta para tempo crítico */}
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

        {/* Barra de progresso crítico */}
        {isCriticalTime && isActive && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-yellow-400"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{
              duration: timeLeft / 1000,
              ease: "linear"
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
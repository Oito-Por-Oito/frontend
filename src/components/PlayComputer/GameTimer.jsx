import React from 'react';
import { motion } from 'framer-motion';

function formatTime(seconds) {
  if (seconds <= 0) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function GameTimer({ 
  time, 
  isActive = false, 
  isLow = false,
  variant = 'default' // 'default' | 'compact'
}) {
  const isWarning = time <= 30;
  const isCritical = time <= 10;

  return (
    <motion.div
      animate={isActive && isCritical ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 0.5 }}
      className={`
        font-mono font-bold rounded-lg px-3 py-2 text-center transition-all
        ${variant === 'compact' ? 'text-lg' : 'text-xl md:text-2xl'}
        ${isActive 
          ? isCritical 
            ? 'bg-red-500/30 text-red-400 border-2 border-red-500' 
            : isWarning 
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' 
              : 'bg-gold/20 text-gold-light border border-gold/50'
          : 'bg-surface-secondary text-muted-foreground border border-surface-tertiary'
        }
      `}
    >
      {formatTime(time)}
    </motion.div>
  );
}

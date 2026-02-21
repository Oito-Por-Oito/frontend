import React from 'react';
import { motion } from 'framer-motion';
import { TIME_CONTROLS } from '@/data/botData';

export default function TimeControlSelector({ selectedTimeControl, onSelectTimeControl }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {TIME_CONTROLS.map(control => (
        <motion.button
          key={control.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectTimeControl(control)}
          className={`
            flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all text-center
            ${selectedTimeControl?.id === control.id
              ? 'bg-gold text-background font-bold shadow-md' 
              : 'bg-surface-secondary/70 text-foreground hover:bg-surface-tertiary border border-surface-tertiary'
            }
          `}
        >
          <span className="text-xs leading-none">{control.icon}</span>
          <span className="text-[10px] font-medium leading-tight mt-0.5">{control.name}</span>
        </motion.button>
      ))}
    </div>
  );
}

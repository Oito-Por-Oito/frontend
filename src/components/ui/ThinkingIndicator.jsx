import React from 'react';
import { motion } from 'framer-motion';

export default function ThinkingIndicator({ isVisible, message = 'Engine pensando...' }) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl z-20"
    >
      <div className="bg-surface-secondary px-5 py-3 rounded-xl flex items-center gap-3 shadow-xl border border-gold/30">
        <div className="animate-spin h-5 w-5 border-2 border-gold border-t-transparent rounded-full" />
        <span className="text-gold font-medium">{message}</span>
      </div>
    </motion.div>
  );
}

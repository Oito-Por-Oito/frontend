import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChatMessage } from '@/data/chatMessages';

export default function ChatBubble({ chatMessage, opponentName }) {
  const message = chatMessage ? getChatMessage(chatMessage.message_key) : null;

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-50 pointer-events-none"
        >
          <div className="bg-gold text-surface-primary px-4 py-2 rounded-xl shadow-lg whitespace-nowrap">
            <div className="text-xs font-medium mb-0.5 opacity-70">
              {opponentName}
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-xl">{message.emoji}</span>
              <span>{message.text}</span>
            </div>
          </div>
          {/* Seta apontando para baixo */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gold" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

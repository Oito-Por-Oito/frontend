import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { QUICK_CHAT_MESSAGES } from '@/data/chatMessages';

export default function QuickChat({ onSendMessage, disabled }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const handleSend = (messageKey) => {
    if (cooldown || disabled) return;
    
    onSendMessage(messageKey);
    setCooldown(true);
    
    // Cooldown de 3 segundos entre mensagens
    setTimeout(() => setCooldown(false), 3000);
  };

  return (
    <div className="bg-surface-secondary rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-2">
          <MessageCircle size={18} />
          Chat Rápido
        </span>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4"
          >
            <div className="grid grid-cols-2 gap-2">
              {QUICK_CHAT_MESSAGES.map((msg) => (
                <button
                  key={msg.key}
                  onClick={() => handleSend(msg.key)}
                  disabled={cooldown || disabled}
                  className={`
                    px-3 py-2 rounded-lg text-sm
                    flex items-center justify-center gap-2
                    transition-all
                    ${cooldown || disabled
                      ? 'bg-surface-tertiary text-muted-foreground cursor-not-allowed opacity-50'
                      : 'bg-surface-tertiary text-muted-foreground hover:bg-gold/20 hover:text-gold'
                    }
                  `}
                >
                  <span>{msg.emoji}</span>
                  <span>{msg.text}</span>
                </button>
              ))}
            </div>
            {cooldown && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Aguarde para enviar outra mensagem...
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

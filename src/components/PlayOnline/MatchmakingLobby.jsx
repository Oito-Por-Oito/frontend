import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Timer, Hourglass, X } from 'lucide-react';
import { TIME_CONTROLS } from '@/lib/gameHelpers';
import { Card, Button } from '@/components/ui';

const CATEGORY_ICONS = {
  bullet: Zap,
  blitz: Clock,
  rapid: Timer,
  classical: Hourglass,
};

const CATEGORY_COLORS = {
  bullet: 'from-orange-600 to-red-600',
  blitz: 'from-yellow-600 to-orange-600',
  rapid: 'from-green-600 to-teal-600',
  classical: 'from-blue-600 to-indigo-600',
};

export default function MatchmakingLobby({
  onJoinQueue,
  onLeaveQueue,
  isSearching,
  error,
}) {
  const [selectedCategory, setSelectedCategory] = useState('blitz');

  const categories = ['bullet', 'blitz', 'rapid', 'classical'];
  const filteredControls = TIME_CONTROLS.filter(tc => tc.category === selectedCategory);

  if (isSearching) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card variant="gradient" className="p-6 sm:p-8 text-center border border-gold/30">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gold/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-gold rounded-full animate-spin" />
            <div className="absolute inset-4 bg-surface-primary rounded-full flex items-center justify-center">
              <span className="text-2xl sm:text-3xl">♟️</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gold mb-2">
            Procurando oponente...
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Aguarde enquanto encontramos um adversário à sua altura
          </p>

          <Button
            variant="destructive"
            size="md"
            onClick={onLeaveQueue}
            className="flex items-center gap-2 mx-auto"
          >
            <X size={16} />
            Cancelar busca
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card variant="gradient" className="p-5 sm:p-6 border border-gold/30">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3 text-gold">
          ⚔️ Jogar Online
        </h2>

        {error && (
          <div className="bg-red-900/30 border border-red-600/50 text-red-300 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Categorias */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat];
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-semibold text-sm transition-all
                  ${isSelected
                    ? `bg-gradient-to-r ${CATEGORY_COLORS[cat]} text-white shadow-lg`
                    : 'bg-surface-secondary text-muted-foreground hover:bg-surface-tertiary border border-gold/10'
                  }
                `}
              >
                <Icon size={16} />
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Controles de tempo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredControls.map(tc => {
            const Icon = CATEGORY_ICONS[tc.category];
            return (
              <button
                key={tc.name}
                onClick={() => onJoinQueue(tc.name)}
                className="flex items-center gap-4 p-4 rounded-xl border border-gold/10
                           bg-surface-secondary hover:border-gold hover:bg-surface-tertiary
                           transition-all group text-left"
              >
                <div className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0
                  bg-gradient-to-br ${CATEGORY_COLORS[tc.category]}
                `}>
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-foreground group-hover:text-gold transition-colors text-sm sm:text-base">
                    {tc.name}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {tc.time / 60} min {tc.increment > 0 ? `+ ${tc.increment}s` : ''}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-muted-foreground text-xs sm:text-sm mt-6">
          Selecione um controle de tempo para encontrar um oponente
        </p>
      </Card>
    </motion.div>
  );
}

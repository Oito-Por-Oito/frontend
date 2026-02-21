import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Timer, Hourglass, Loader2, X } from 'lucide-react';
import { TIME_CONTROLS } from '@/lib/gameHelpers';

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
  error 
}) {
  const [selectedCategory, setSelectedCategory] = useState('blitz');

  const categories = ['bullet', 'blitz', 'rapid', 'classical'];
  const filteredControls = TIME_CONTROLS.filter(tc => tc.category === selectedCategory);

  const handleSelectTimeControl = (timeControlName) => {
    onJoinQueue(timeControlName);
  };

  if (isSearching) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] p-8 rounded-2xl shadow-xl border border-[#c29d5d]/30 text-center"
      >
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-[#c29d5d]/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-[#c29d5d] rounded-full animate-spin" />
          <div className="absolute inset-4 bg-[#1e1e1e] rounded-full flex items-center justify-center">
            <span className="text-3xl">♟️</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-[#e7c27d] mb-2">
          Procurando oponente...
        </h2>
        <p className="text-gray-400 mb-6">
          Aguarde enquanto encontramos um adversário à sua altura
        </p>

        <button
          onClick={onLeaveQueue}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 text-red-400 rounded-xl transition-all"
        >
          <X size={18} />
          Cancelar busca
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] p-6 rounded-2xl shadow-xl border border-[#c29d5d]/30"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3 text-[#e7c27d]">
        ⚔️ Jogar Online
      </h2>

      {error && (
        <div className="bg-red-900/30 border border-red-600/50 text-red-300 p-3 rounded-lg mb-4">
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
                flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all
                ${isSelected 
                  ? `bg-gradient-to-r ${CATEGORY_COLORS[cat]} text-white shadow-lg` 
                  : 'bg-[#333] text-gray-300 hover:bg-[#444]'
                }
              `}
            >
              <Icon size={18} />
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
              onClick={() => handleSelectTimeControl(tc.name)}
              className={`
                flex items-center gap-4 p-4 rounded-xl border transition-all
                bg-[#1e1e1e] border-[#333] hover:border-[#c29d5d] hover:bg-[#2a2a2a]
                group
              `}
            >
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                bg-gradient-to-br ${CATEGORY_COLORS[tc.category]}
              `}>
                <Icon size={24} className="text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-white group-hover:text-[#c29d5d] transition-colors">
                  {tc.name}
                </div>
                <div className="text-sm text-gray-400">
                  {tc.time / 60} min {tc.increment > 0 ? `+ ${tc.increment}s` : ''}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-gray-500 text-sm mt-6">
        Selecione um controle de tempo para encontrar um oponente
      </p>
    </motion.div>
  );
}

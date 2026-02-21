import React from 'react';
import { motion } from 'framer-motion';
import { BOTS, BOT_CATEGORIES, getFlagUrl } from '@/data/botData';

const CategoryBadge = ({ category }) => {
  const colors = {
    [BOT_CATEGORIES.BEGINNER]: 'bg-green-500/20 text-green-400 border-green-500/30',
    [BOT_CATEGORIES.INTERMEDIATE]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    [BOT_CATEGORIES.ADVANCED]: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    [BOT_CATEGORIES.MASTER]: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    [BOT_CATEGORIES.GRANDMASTER]: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${colors[category] || 'bg-gray-500/20 text-gray-400'}`}>
      {category}
    </span>
  );
};

const BotItem = ({ bot, isSelected, onSelect }) => {
  const flagUrl = getFlagUrl(bot.country);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(bot)}
      className={`
        flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
        ${isSelected 
          ? 'bg-gold/20 border-2 border-gold shadow-md shadow-gold/10' 
          : 'bg-surface-secondary/50 border border-surface-tertiary hover:border-gold/30'
        }
      `}
    >
      <div className="text-2xl">{bot.avatar}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-foreground truncate">{bot.name}</span>
          {flagUrl && (
            <img 
              src={flagUrl} 
              alt={bot.country} 
              className="w-4 h-3 object-cover rounded-sm"
            />
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-gold font-bold">{bot.rating}</span>
          <span className="text-muted-foreground">• Lv {bot.stockfishLevel}</span>
        </div>
      </div>
      {isSelected && (
        <div className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
      )}
    </motion.div>
  );
};

export default function BotCatalog({ selectedBot, onSelectBot }) {
  const categories = Object.values(BOT_CATEGORIES);

  return (
    <div className="space-y-3">
      {categories.map(category => {
        const categoryBots = BOTS.filter(bot => bot.category === category);
        
        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-1.5">
              <CategoryBadge category={category} />
              <span className="text-[10px] text-muted-foreground">
                {categoryBots.length}
              </span>
            </div>
            <div className="grid gap-1.5">
              {categoryBots.map(bot => (
                <BotItem 
                  key={bot.id} 
                  bot={bot} 
                  isSelected={selectedBot?.id === bot.id}
                  onSelect={onSelectBot}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

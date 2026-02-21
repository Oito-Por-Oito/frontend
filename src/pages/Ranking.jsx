import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Trophy, Zap, Clock, Timer, Hourglass, Crown } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';

const CATEGORIES = [
  { id: 'blitz', label: 'Blitz', icon: Clock },
  { id: 'bullet', label: 'Bullet', icon: Zap },
  { id: 'rapid', label: 'Rápido', icon: Timer },
  { id: 'classical', label: 'Clássico', icon: Hourglass },
  { id: 'puzzle', label: 'Puzzles', icon: Trophy },
];

const MOCK_PLAYERS = Array.from({ length: 20 }, (_, i) => ({
  rank: i + 1,
  username: ['MagnusC', 'HikaruN', 'FabianoC', 'LevA', 'WesleyS', 'AnishG', 'IanN', 'DingL', 'AlirR', 'NodirY',
    'RichardR', 'MaximeV', 'SamuelS', 'DavidN', 'PentalaH', 'BoriG', 'AlexanderG', 'SergeyK', 'VladimirK', 'GarryK'][i],
  rating: 3200 - i * 35 + Math.floor(Math.random() * 20),
  country: ['🇳🇴', '🇺🇸', '🇺🇸', '🇷🇺', '🇧🇷', '🇳🇱', '🇬🇧', '🇨🇳', '🇺🇿', '🇺🇿',
    '🇺🇸', '🇫🇷', '🇺🇸', '🇺🇸', '🇮🇳', '🇷🇺', '🇷🇺', '🇷🇺', '🇷🇺', '🇷🇺'][i],
  trend: i % 3 === 0 ? 'up' : i % 3 === 1 ? 'down' : 'same',
  games: 1200 - i * 40,
}));

const RANK_MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Ranking() {
  const [activeCategory, setActiveCategory] = useState('blitz');

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <BarChart2 className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Tabela de Classificação</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Os melhores jogadores da plataforma OitoPorOito, classificados por rating em cada modalidade.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Top 3 destaque */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {MOCK_PLAYERS.slice(0, 3).map((p, i) => (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                variant="gradient"
                className={`text-center border ${
                  i === 0 ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 to-surface-secondary' :
                  i === 1 ? 'border-gray-400/50' : 'border-orange-700/50'
                }`}
              >
                <div className="text-4xl mb-2">{RANK_MEDALS[p.rank]}</div>
                <div className="w-14 h-14 rounded-full bg-surface-tertiary border-2 border-gold/30 flex items-center justify-center text-xl font-bold text-gold mx-auto mb-2">
                  {p.username[0]}
                </div>
                <div className="font-bold text-foreground">{p.username}</div>
                <div className="text-lg font-bold text-gold">{p.rating}</div>
                <div className="text-xs text-muted-foreground">{p.country} · {p.games} partidas</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filtros de categoria */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-gold text-surface-primary border-gold'
                    : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'
                }`}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Tabela */}
        <Card variant="gradient">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-gold/10 text-left">
                  <th className="pb-3 text-xs text-muted-foreground font-semibold w-12">#</th>
                  <th className="pb-3 text-xs text-muted-foreground font-semibold">Jogador</th>
                  <th className="pb-3 text-xs text-muted-foreground font-semibold text-right">Rating</th>
                  <th className="pb-3 text-xs text-muted-foreground font-semibold text-right hidden sm:table-cell">Partidas</th>
                  <th className="pb-3 text-xs text-muted-foreground font-semibold text-right hidden sm:table-cell">Tendência</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PLAYERS.map((p, i) => (
                  <motion.tr
                    key={p.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-gold/5 hover:bg-surface-tertiary/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 text-sm">
                      {RANK_MEDALS[p.rank] || (
                        <span className="text-muted-foreground font-mono">{p.rank}</span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-surface-tertiary border border-gold/20 flex items-center justify-center text-sm font-bold text-gold shrink-0">
                          {p.username[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{p.username}</div>
                          <div className="text-xs text-muted-foreground">{p.country}</div>
                        </div>
                        {p.rank <= 3 && <Crown size={12} className="text-gold ml-1" />}
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold text-gold font-mono text-sm">{p.rating}</td>
                    <td className="py-3 text-right text-muted-foreground text-sm hidden sm:table-cell">{p.games}</td>
                    <td className="py-3 text-right hidden sm:table-cell">
                      <span className={`text-xs font-semibold ${
                        p.trend === 'up' ? 'text-green-400' :
                        p.trend === 'down' ? 'text-red-400' : 'text-muted-foreground'
                      }`}>
                        {p.trend === 'up' ? '▲' : p.trend === 'down' ? '▼' : '—'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}

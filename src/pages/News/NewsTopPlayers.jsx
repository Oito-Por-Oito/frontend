import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, ChevronRight, Trophy, TrendingUp } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';

const PLAYERS = [
  { id: 1, name: 'Magnus Carlsen', country: '🇳🇴', rating: 2830, title: 'GM', age: 33, wins: 1847, winrate: 68, specialty: 'Posicional', emoji: '👑', featured: true },
  { id: 2, name: 'Fabiano Caruana', country: '🇺🇸', rating: 2805, title: 'GM', age: 31, wins: 1523, winrate: 62, specialty: 'Universal', emoji: '⚡', featured: true },
  { id: 3, name: 'Hikaru Nakamura', country: '🇺🇸', rating: 2794, title: 'GM', age: 36, wins: 1698, winrate: 65, specialty: 'Tático', emoji: '🔥', featured: false },
  { id: 4, name: 'Alireza Firouzja', country: '🇫🇷', rating: 2788, title: 'GM', age: 21, wins: 1102, winrate: 61, specialty: 'Agressivo', emoji: '🚀', featured: false },
  { id: 5, name: 'Ian Nepomniachtchi', country: '🇷🇺', rating: 2782, title: 'GM', age: 33, wins: 1456, winrate: 60, specialty: 'Criativo', emoji: '🎭', featured: false },
  { id: 6, name: 'Ding Liren', country: '🇨🇳', rating: 2762, title: 'GM', age: 31, wins: 1389, winrate: 59, specialty: 'Sólido', emoji: '🏆', featured: false },
];

export default function NewsTopPlayers() {
  const [search, setSearch] = useState('');

  const filtered = PLAYERS.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Star className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Top Jogadores</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Conheça os melhores jogadores de xadrez do mundo com perfis detalhados e estatísticas.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="relative mb-6">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar jogador..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-secondary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card
                variant="gradient"
                className={`h-full flex flex-col gap-3 hover:border-gold/40 transition-all cursor-pointer group ${p.featured ? 'border-gold/30 bg-gold/5' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-tertiary border border-gold/20 flex items-center justify-center text-2xl">
                      {p.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-gold transition-colors text-sm">{p.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs bg-gold/20 text-gold px-1.5 py-0.5 rounded font-bold border border-gold/30">{p.title}</span>
                        <span className="text-xs text-muted-foreground">{p.country} {p.age} anos</span>
                      </div>
                    </div>
                  </div>
                  {p.featured && <Star size={14} className="text-gold fill-gold shrink-0" />}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-surface-tertiary rounded-lg p-2">
                    <div className="text-sm font-bold text-gold">{p.rating}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="bg-surface-tertiary rounded-lg p-2">
                    <div className="text-sm font-bold text-foreground">{p.wins}</div>
                    <div className="text-xs text-muted-foreground">Vitórias</div>
                  </div>
                  <div className="bg-surface-tertiary rounded-lg p-2">
                    <div className="text-sm font-bold text-green-400">{p.winrate}%</div>
                    <div className="text-xs text-muted-foreground">Taxa</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Estilo: <span className="text-foreground font-medium">{p.specialty}</span></span>
                  <ChevronRight size={14} className="text-muted-foreground group-hover:text-gold transition-colors" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

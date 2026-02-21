import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookMarked, Search, ChevronRight, Star } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const OPENINGS = [
  { id: 1, name: 'Abertura Italiana', eco: 'C50', moves: '1.e4 e5 2.Cf3 Cc6 3.Bc4', popularity: 95, winrate: 52, emoji: '🇮🇹', category: 'Brancas' },
  { id: 2, name: 'Defesa Siciliana', eco: 'B20', moves: '1.e4 c5', popularity: 98, winrate: 49, emoji: '🛡️', category: 'Pretas' },
  { id: 3, name: 'Abertura Espanhola', eco: 'C60', moves: '1.e4 e5 2.Cf3 Cc6 3.Bb5', popularity: 90, winrate: 54, emoji: '🇪🇸', category: 'Brancas' },
  { id: 4, name: 'Defesa Francesa', eco: 'C00', moves: '1.e4 e6', popularity: 82, winrate: 47, emoji: '🇫🇷', category: 'Pretas' },
  { id: 5, name: 'Gambito da Rainha', eco: 'D06', moves: '1.d4 d5 2.c4', popularity: 88, winrate: 53, emoji: '👑', category: 'Brancas' },
  { id: 6, name: 'Defesa Indiana do Rei', eco: 'E60', moves: '1.d4 Cf6 2.c4 g6', popularity: 85, winrate: 48, emoji: '🏰', category: 'Pretas' },
  { id: 7, name: 'Abertura Inglesa', eco: 'A10', moves: '1.c4', popularity: 78, winrate: 51, emoji: '🇬🇧', category: 'Brancas' },
  { id: 8, name: 'Defesa Caro-Kann', eco: 'B10', moves: '1.e4 c6', popularity: 75, winrate: 48, emoji: '🔒', category: 'Pretas' },
];

const CATEGORIES = ['Todas', 'Brancas', 'Pretas'];

export default function LearnOpenings() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');

  const filtered = OPENINGS.filter(o => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.eco.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Todas' || o.category === category;
    return matchSearch && matchCat;
  });

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <BookMarked className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Aberturas</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Explore e aprenda as principais aberturas do xadrez com análises detalhadas e estatísticas.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Busca e filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar abertura ou código ECO..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-secondary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div className="flex gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                  category === c ? 'bg-gold text-surface-primary border-gold' : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((o, i) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card variant="gradient" className="cursor-pointer hover:border-gold/40 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-tertiary flex items-center justify-center text-2xl shrink-0 border border-gold/10">
                    {o.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-foreground group-hover:text-gold transition-colors truncate">{o.name}</h3>
                      <span className="text-xs text-muted-foreground bg-surface-tertiary px-2 py-0.5 rounded font-mono shrink-0">{o.eco}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-1 truncate">{o.moves}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-16 bg-surface-tertiary rounded-full overflow-hidden">
                          <div className="h-full bg-gold rounded-full" style={{ width: `${o.popularity}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{o.popularity}%</span>
                      </div>
                      <span className={`text-xs font-semibold ${o.winrate > 50 ? 'text-green-400' : 'text-red-400'}`}>
                        {o.winrate}% vitórias
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:text-gold transition-colors shrink-0 mt-1" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <BookMarked size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhuma abertura encontrada.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

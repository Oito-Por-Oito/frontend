import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';

const CATEGORIES = ['Clássico', 'Rápido', 'Blitz', 'Chess960'];

const RANKINGS = {
  Clássico: [
    { pos: 1, name: 'Magnus Carlsen', country: '🇳🇴', rating: 2830, change: 0 },
    { pos: 2, name: 'Fabiano Caruana', country: '🇺🇸', rating: 2805, change: +2 },
    { pos: 3, name: 'Hikaru Nakamura', country: '🇺🇸', rating: 2794, change: +1 },
    { pos: 4, name: 'Alireza Firouzja', country: '🇫🇷', rating: 2788, change: -1 },
    { pos: 5, name: 'Ian Nepomniachtchi', country: '🇷🇺', rating: 2782, change: -2 },
    { pos: 6, name: 'Ding Liren', country: '🇨🇳', rating: 2762, change: 0 },
    { pos: 7, name: 'Wesley So', country: '🇺🇸', rating: 2760, change: +3 },
    { pos: 8, name: 'Levon Aronian', country: '🇺🇸', rating: 2755, change: -1 },
    { pos: 9, name: 'Anish Giri', country: '🇳🇱', rating: 2752, change: +1 },
    { pos: 10, name: 'Richard Rapport', country: '🇷🇴', rating: 2748, change: -2 },
  ],
  Rápido: [
    { pos: 1, name: 'Magnus Carlsen', country: '🇳🇴', rating: 2886, change: 0 },
    { pos: 2, name: 'Hikaru Nakamura', country: '🇺🇸', rating: 2841, change: +1 },
    { pos: 3, name: 'Ian Nepomniachtchi', country: '🇷🇺', rating: 2826, change: -1 },
    { pos: 4, name: 'Fabiano Caruana', country: '🇺🇸', rating: 2818, change: +2 },
    { pos: 5, name: 'Alireza Firouzja', country: '🇫🇷', rating: 2810, change: 0 },
  ],
  Blitz: [
    { pos: 1, name: 'Magnus Carlsen', country: '🇳🇴', rating: 2886, change: 0 },
    { pos: 2, name: 'Hikaru Nakamura', country: '🇺🇸', rating: 2872, change: +2 },
    { pos: 3, name: 'Alireza Firouzja', country: '🇫🇷', rating: 2858, change: -1 },
    { pos: 4, name: 'Ian Nepomniachtchi', country: '🇷🇺', rating: 2844, change: +1 },
    { pos: 5, name: 'Fabiano Caruana', country: '🇺🇸', rating: 2836, change: -2 },
  ],
  Chess960: [
    { pos: 1, name: 'Hikaru Nakamura', country: '🇺🇸', rating: 2900, change: +5 },
    { pos: 2, name: 'Magnus Carlsen', country: '🇳🇴', rating: 2876, change: -1 },
    { pos: 3, name: 'Wesley So', country: '🇺🇸', rating: 2854, change: +2 },
    { pos: 4, name: 'Alireza Firouzja', country: '🇫🇷', rating: 2840, change: 0 },
    { pos: 5, name: 'Fabiano Caruana', country: '🇺🇸', rating: 2822, change: -1 },
  ],
};

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function NewsRankings() {
  const [category, setCategory] = useState('Clássico');
  const data = RANKINGS[category] || [];

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Rankings FIDE</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Classificação mundial atualizada dos melhores jogadores de xadrez do planeta.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filtro de categoria */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${category === c ? 'bg-gold text-surface-primary border-gold' : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Top 3 destaque */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {data.slice(0, 3).map((p, i) => (
            <motion.div key={p.pos} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card variant="gradient" className={`text-center py-6 border ${p.pos === 1 ? 'border-gold/50 bg-gold/5' : 'border-gold/20'}`}>
                <div className="text-3xl mb-2">{MEDAL[p.pos]}</div>
                <div className="text-2xl mb-1">{p.country}</div>
                <h3 className="font-bold text-foreground text-sm">{p.name}</h3>
                <div className="text-2xl font-bold text-gold mt-1">{p.rating}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabela completa */}
        <Card variant="gradient" className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="text-left py-3 px-3 text-xs text-muted-foreground font-semibold uppercase">#</th>
                <th className="text-left py-3 px-3 text-xs text-muted-foreground font-semibold uppercase">Jogador</th>
                <th className="text-right py-3 px-3 text-xs text-muted-foreground font-semibold uppercase">Rating</th>
                <th className="text-right py-3 px-3 text-xs text-muted-foreground font-semibold uppercase">Variação</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p, i) => (
                <motion.tr
                  key={p.pos}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  className="border-b border-gold/5 hover:bg-surface-tertiary transition-colors"
                >
                  <td className="py-3 px-3 text-sm font-bold text-muted-foreground">{MEDAL[p.pos] || p.pos}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span>{p.country}</span>
                      <span className="font-semibold text-sm text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-gold">{p.rating}</td>
                  <td className="py-3 px-3 text-right">
                    {p.change > 0 ? (
                      <span className="text-green-400 text-xs flex items-center justify-end gap-0.5"><TrendingUp size={11} /> +{p.change}</span>
                    ) : p.change < 0 ? (
                      <span className="text-red-400 text-xs flex items-center justify-end gap-0.5"><TrendingDown size={11} /> {p.change}</span>
                    ) : (
                      <span className="text-muted-foreground text-xs flex items-center justify-end gap-0.5"><Minus size={11} /> 0</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </PageLayout>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Search, Clock, ChevronRight, Tag } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const CATEGORIES = ['Todas', 'Torneios', 'FIDE', 'Recordes', 'Destaque', 'Análises'];

const NEWS = [
  { id: 1, title: 'Magnus Carlsen vence o Grand Chess Tour 2024 com rodada de sobra', category: 'Torneios', time: '2h atrás', read: '4 min', emoji: '♟️', featured: true, desc: 'O norueguês confirmou mais um título no circuito mais prestigioso do xadrez mundial, com uma performance dominante.' },
  { id: 2, title: 'FIDE anuncia novo formato para o Campeonato Mundial de 2026', category: 'FIDE', time: '5h atrás', read: '3 min', emoji: '🌍', featured: true, desc: 'A federação internacional aprovou mudanças significativas no formato do match pelo título mundial.' },
  { id: 3, title: 'Hikaru Nakamura bate recorde de rating no Chess960', category: 'Recordes', time: '1d atrás', read: '2 min', emoji: '⚡', featured: false, desc: 'O streamer americano alcançou 2900 de rating na variante Fischer Random, um feito histórico.' },
  { id: 4, title: 'Jovem prodígio de 14 anos se torna Mestre Internacional', category: 'Destaque', time: '2d atrás', read: '3 min', emoji: '🌟', featured: false, desc: 'O brasileiro João Silva se tornou o mais jovem Mestre Internacional da história do país.' },
  { id: 5, title: 'Análise: As melhores partidas do Torneio dos Candidatos', category: 'Análises', time: '3d atrás', read: '8 min', emoji: '🔍', featured: false, desc: 'GM Mendes analisa as 5 partidas mais brilhantes do torneio que definiu o desafiante ao título mundial.' },
  { id: 6, title: 'OitoPorOito lança nova funcionalidade de análise com IA', category: 'Destaque', time: '4d atrás', read: '2 min', emoji: '🚀', featured: false, desc: 'A plataforma brasileira de xadrez apresenta análise automática de partidas com inteligência artificial.' },
];

export default function NewsChessToday() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');

  const filtered = NEWS.filter(n => {
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Todas' || n.category === category;
    return matchSearch && matchCat;
  });

  const featured = filtered.filter(n => n.featured);
  const rest = filtered.filter(n => !n.featured);

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Newspaper className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Xadrez Hoje</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              As últimas notícias do mundo do xadrez, atualizadas diariamente.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Busca e filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar notícias..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-secondary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                category === c ? 'bg-gold text-surface-primary border-gold' : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'
              }`}
            >
              <Tag size={10} /> {c}
            </button>
          ))}
        </div>

        {/* Destaques */}
        {featured.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-foreground mb-4">Em Destaque</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {featured.map((n, i) => (
                <motion.div key={n.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Card variant="gradient" className="h-full flex flex-col gap-3 hover:border-gold/40 transition-all cursor-pointer group border border-gold/20">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-3xl">{n.emoji}</span>
                      <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/30 shrink-0">{n.category}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground group-hover:text-gold transition-colors">{n.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{n.desc}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock size={10} /> {n.time}</span>
                      <span>{n.read} de leitura</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Outras notícias */}
        {rest.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-foreground mb-4">Mais Notícias</h2>
            <div className="space-y-3">
              {rest.map((n, i) => (
                <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                  <Card variant="gradient" className="flex items-center gap-4 hover:border-gold/40 transition-all cursor-pointer group">
                    <span className="text-2xl shrink-0">{n.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-gold transition-colors truncate">{n.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs bg-surface-tertiary text-muted-foreground px-2 py-0.5 rounded-full border border-gold/10">{n.category}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={10} /> {n.time}</span>
                        <span className="text-xs text-muted-foreground">{n.read} de leitura</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-gold transition-colors shrink-0" />
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}

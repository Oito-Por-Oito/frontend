import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Library, Search, BookOpen, Video, FileText, Headphones } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';

const RESOURCE_TYPES = [
  { id: 'all', label: 'Todos', icon: Library },
  { id: 'article', label: 'Artigos', icon: FileText },
  { id: 'video', label: 'Vídeos', icon: Video },
  { id: 'book', label: 'Livros', icon: BookOpen },
  { id: 'podcast', label: 'Podcasts', icon: Headphones },
];

const RESOURCES = [
  { id: 1, title: 'Os 100 Finais que Você Deve Conhecer', type: 'book', author: 'Jesus de la Villa', level: 'Intermediário', emoji: '📚', free: false },
  { id: 2, title: 'Como Pensar em Xadrez', type: 'article', author: 'Equipe OitoPorOito', level: 'Iniciante', emoji: '📄', free: true },
  { id: 3, title: 'Análise da Partida do Século', type: 'video', author: 'GM Mendes', level: 'Avançado', emoji: '🎬', free: true },
  { id: 4, title: 'Meu Sistema', type: 'book', author: 'Nimzowitsch', level: 'Avançado', emoji: '📚', free: false },
  { id: 5, title: 'Podcast: Xadrez para Todos - Ep. 12', type: 'podcast', author: 'OitoPorOito', level: 'Todos', emoji: '🎙️', free: true },
  { id: 6, title: 'Guia Completo da Defesa Siciliana', type: 'article', author: 'IM Souza', level: 'Intermediário', emoji: '📄', free: false },
];

export default function LearnLibrary() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');

  const filtered = RESOURCES.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.author.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === 'all' || r.type === activeType;
    return matchSearch && matchType;
  });

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Library className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Biblioteca</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Artigos, vídeos, livros e podcasts sobre xadrez. Tudo em um só lugar.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Busca */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar recursos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-secondary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        {/* Filtros de tipo */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {RESOURCE_TYPES.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeType === t.id
                    ? 'bg-gold text-surface-primary border-gold'
                    : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'
                }`}
              >
                <Icon size={13} /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card variant="gradient" className="h-full flex flex-col gap-3 hover:border-gold/40 transition-all cursor-pointer group">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{r.emoji}</span>
                  <div className="flex items-center gap-2">
                    {r.free ? (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">Grátis</span>
                    ) : (
                      <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full border border-gold/30">PRO</span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-foreground group-hover:text-gold transition-colors">{r.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{r.author}</p>
                  <span className="text-xs text-muted-foreground bg-surface-tertiary px-2 py-0.5 rounded-full mt-2 inline-block border border-gold/10">
                    {r.level}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

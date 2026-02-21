import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Clock, BookOpen, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';

const LEVELS = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];

const ARTICLES = [
  { id: 1, title: 'Como melhorar seu jogo posicional em 30 dias', level: 'Intermediário', author: 'GM Mendes', time: '12 min', emoji: '📈', desc: 'Um guia prático com exercícios diários para desenvolver sua compreensão posicional.' },
  { id: 2, title: 'Os 10 erros mais comuns de iniciantes', level: 'Iniciante', author: 'IM Souza', time: '8 min', emoji: '❌', desc: 'Identifique e corrija os erros que impedem sua evolução no xadrez.' },
  { id: 3, title: 'A psicologia do xadrez competitivo', level: 'Avançado', author: 'Prof. Silva', time: '15 min', emoji: '🧠', desc: 'Como gerenciar a pressão, o tempo e as emoções durante partidas importantes.' },
  { id: 4, title: 'Guia completo da Defesa Siciliana para pretas', level: 'Intermediário', author: 'FM Costa', time: '20 min', emoji: '🛡️', desc: 'Todas as variantes principais da Siciliana com análises detalhadas e planos típicos.' },
  { id: 5, title: 'Finais de torre: o que todo jogador precisa saber', level: 'Intermediário', author: 'GM Mendes', time: '18 min', emoji: '🏰', desc: 'As posições fundamentais de finais de torre que aparecem em toda partida de xadrez.' },
  { id: 6, title: 'Introdução ao xadrez: primeiros passos', level: 'Iniciante', author: 'Equipe OPO', time: '5 min', emoji: '♟️', desc: 'Aprenda as regras básicas do xadrez e dê seus primeiros passos no jogo.' },
];

export default function NewsArticles() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('Todos');

  const filtered = ARTICLES.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.author.toLowerCase().includes(search.toLowerCase());
    const matchLevel = level === 'Todos' || a.level === level;
    return matchSearch && matchLevel;
  });

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <FileText className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Artigos</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Análises aprofundadas, guias estratégicos e conteúdo educativo sobre xadrez.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-secondary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {LEVELS.map(l => (
              <button key={l} onClick={() => setLevel(l)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${level === l ? 'bg-gold text-surface-primary border-gold' : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card variant="gradient" className="h-full flex flex-col gap-3 hover:border-gold/40 transition-all cursor-pointer group">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl">{a.emoji}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
                    a.level === 'Iniciante' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    a.level === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>{a.level}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground group-hover:text-gold transition-colors">{a.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><BookOpen size={10} /> {a.author}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {a.time}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Database, Filter, Play, User, Calendar, Clock } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const SAMPLE_GAMES = [
  { id: 1, white: 'Magnus Carlsen', black: 'Fabiano Caruana', result: '1-0', opening: 'Defesa Siciliana', date: '2024-11-14', moves: 42, event: 'World Championship' },
  { id: 2, white: 'Hikaru Nakamura', black: 'Ian Nepomniachtchi', result: '½-½', opening: 'Abertura Inglesa', date: '2024-10-22', moves: 67, event: 'Grand Chess Tour' },
  { id: 3, white: 'Alireza Firouzja', black: 'Ding Liren', result: '0-1', opening: 'Gambito da Rainha', date: '2024-09-08', moves: 55, event: 'Candidates Tournament' },
  { id: 4, white: 'Wesley So', black: 'Levon Aronian', result: '1-0', opening: 'Abertura Espanhola', date: '2024-08-17', moves: 38, event: 'US Championship' },
];

const RESULT_COLORS = { '1-0': 'text-green-400', '0-1': 'text-red-400', '½-½': 'text-yellow-400' };

export default function MaisExplorador() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState('all');

  const filtered = SAMPLE_GAMES.filter(g => {
    const matchSearch = !search ||
      g.white.toLowerCase().includes(search.toLowerCase()) ||
      g.black.toLowerCase().includes(search.toLowerCase()) ||
      g.opening.toLowerCase().includes(search.toLowerCase()) ||
      g.event.toLowerCase().includes(search.toLowerCase());
    const matchResult = result === 'all' || g.result === result;
    return matchSearch && matchResult;
  });

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Database className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Explorador de Partidas</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Pesquise e explore milhões de partidas de grandes mestres e jogadores da plataforma.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filtros */}
        <Card variant="gradient" className="mb-6 border border-gold/20">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por jogador, abertura ou evento..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface-tertiary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-muted-foreground shrink-0" />
              {['all', '1-0', '0-1', '½-½'].map(r => (
                <button
                  key={r}
                  onClick={() => setResult(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    result === r ? 'bg-gold text-surface-primary border-gold' : 'bg-surface-tertiary text-muted-foreground border-gold/10 hover:border-gold/30'
                  }`}
                >
                  {r === 'all' ? 'Todos' : r}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Lista de partidas */}
        <div className="space-y-3">
          {filtered.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card variant="gradient" className="hover:border-gold/40 transition-all group cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground group-hover:text-gold transition-colors text-sm">{g.white}</span>
                      <span className={`font-bold text-sm ${RESULT_COLORS[g.result]}`}>{g.result}</span>
                      <span className="font-bold text-foreground text-sm">{g.black}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <BookOpen size={11} /> {g.opening}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={11} /> {g.date}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={11} /> {g.moves} lances
                      </span>
                    </div>
                    <p className="text-xs text-gold mt-0.5">{g.event}</p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 flex items-center gap-1 self-start sm:self-auto">
                    <Play size={12} /> Ver partida
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Database size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhuma partida encontrada.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

// Componente auxiliar inline
function BookOpen({ size, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

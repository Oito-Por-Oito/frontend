import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Search, Zap, Clock, Users, Play } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const TIME_CONTROLS = ['Todos', 'Bullet', 'Blitz', 'Rápido', 'Clássico'];

const LIVE_GAMES = [
  { id: 1, white: 'Magnus Carlsen', whiteRating: 2830, black: 'Fabiano Caruana', blackRating: 2805, control: 'Blitz', move: 24, spectators: 4821, opening: 'Defesa Siciliana' },
  { id: 2, white: 'Hikaru Nakamura', whiteRating: 2794, black: 'Alireza Firouzja', blackRating: 2788, control: 'Bullet', move: 18, spectators: 3102, opening: 'Abertura Italiana' },
  { id: 3, white: 'Ian Nepomniachtchi', whiteRating: 2782, black: 'Ding Liren', blackRating: 2762, control: 'Rápido', move: 41, spectators: 2567, opening: 'Gambito da Rainha' },
  { id: 4, white: 'Wesley So', whiteRating: 2760, black: 'Levon Aronian', blackRating: 2755, control: 'Blitz', move: 33, spectators: 1893, opening: 'Abertura Espanhola' },
  { id: 5, white: 'Anish Giri', whiteRating: 2752, black: 'Richard Rapport', blackRating: 2748, control: 'Clássico', move: 52, spectators: 1204, opening: 'Defesa Francesa' },
  { id: 6, white: 'Viswanathan Anand', whiteRating: 2740, black: 'Boris Gelfand', blackRating: 2735, control: 'Rápido', move: 29, spectators: 987, opening: 'Defesa Indiana do Rei' },
];

const CONTROL_ICONS = { Bullet: '🔴', Blitz: '⚡', Rápido: '⏱️', Clássico: '🕐' };

export default function WatchPlayingNow() {
  const [search, setSearch] = useState('');
  const [control, setControl] = useState('Todos');

  const filtered = LIVE_GAMES.filter(g => {
    const matchSearch = !search ||
      g.white.toLowerCase().includes(search.toLowerCase()) ||
      g.black.toLowerCase().includes(search.toLowerCase());
    const matchControl = control === 'Todos' || g.control === control;
    return matchSearch && matchControl;
  });

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Eye className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Jogando Agora</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Assista partidas ao vivo dos melhores jogadores da plataforma e do mundo.
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
              placeholder="Buscar jogador..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-secondary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {TIME_CONTROLS.map(t => (
              <button key={t} onClick={() => setControl(t)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${control === t ? 'bg-gold text-surface-primary border-gold' : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'}`}>
                {CONTROL_ICONS[t] || ''} {t}
              </button>
            ))}
          </div>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Partidas ao vivo', value: filtered.length.toString(), icon: Play },
            { label: 'Espectadores', value: filtered.reduce((a, g) => a + g.spectators, 0).toLocaleString(), icon: Eye },
            { label: 'Jogadores online', value: '12.847', icon: Users },
            { label: 'Partidas hoje', value: '48.291', icon: Zap },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} variant="gradient" className="text-center py-3">
                <Icon size={16} className="text-gold mx-auto mb-1" />
                <div className="text-lg font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </Card>
            );
          })}
        </div>

        <div className="space-y-3">
          {filtered.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card variant="gradient" className="hover:border-gold/40 transition-all cursor-pointer group">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-foreground group-hover:text-gold transition-colors">{g.white}</span>
                      <span className="text-xs text-muted-foreground">({g.whiteRating})</span>
                      <span className="text-xs text-gold font-bold">vs</span>
                      <span className="font-bold text-sm text-foreground group-hover:text-gold transition-colors">{g.black}</span>
                      <span className="text-xs text-muted-foreground">({g.blackRating})</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-muted-foreground">
                      <span>{CONTROL_ICONS[g.control]} {g.control}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> Lance {g.move}</span>
                      <span className="flex items-center gap-1"><Eye size={10} /> {g.spectators.toLocaleString()} espectadores</span>
                      <span className="text-gold">{g.opening}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 flex items-center gap-1 self-start sm:self-auto">
                    <Play size={12} /> Assistir
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

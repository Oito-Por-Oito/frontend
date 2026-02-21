import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Trophy, ChevronRight, Filter } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const FILTERS = ['Todos', 'Ao Vivo', 'Esta Semana', 'Este Mês'];

const EVENTS = [
  { id: 1, name: 'Grand Chess Tour — São Paulo', date: 'Hoje – 14h', location: 'São Paulo, BR', players: 10, status: 'live', prize: 'R$ 500.000', emoji: '🏆', category: 'Super Torneio' },
  { id: 2, name: 'Campeonato Brasileiro de Xadrez', date: 'Amanhã – 9h', location: 'Rio de Janeiro, BR', players: 64, status: 'upcoming', prize: 'R$ 80.000', emoji: '🇧🇷', category: 'Nacional' },
  { id: 3, name: 'Torneio OitoPorOito Open', date: 'Sáb – 10h', location: 'Online', players: 256, status: 'upcoming', prize: 'R$ 20.000', emoji: '💻', category: 'Online' },
  { id: 4, name: 'Chess Olympiad 2024', date: '15 Nov – 9h', location: 'Budapest, HU', players: 180, status: 'upcoming', prize: 'Medalhas', emoji: '🌍', category: 'Internacional' },
  { id: 5, name: 'Speed Chess Championship', date: '22 Nov – 16h', location: 'Online', players: 16, status: 'upcoming', prize: '$100.000', emoji: '⚡', category: 'Online' },
];

const STATUS_STYLES = {
  live: 'bg-red-500/20 text-red-400 border-red-500/30',
  upcoming: 'bg-gold/20 text-gold border-gold/30',
};

export default function WatchEvents() {
  const [filter, setFilter] = useState('Todos');

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Eventos ao Vivo</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Acompanhe os principais torneios e eventos de xadrez ao redor do mundo.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter size={14} className="text-muted-foreground" />
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filter === f ? 'bg-gold text-surface-primary border-gold' : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {EVENTS.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card variant="gradient" className="hover:border-gold/40 transition-all cursor-pointer group">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-tertiary border border-gold/10 flex items-center justify-center text-2xl shrink-0">
                    {e.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-foreground group-hover:text-gold transition-colors text-sm">{e.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_STYLES[e.status]}`}>
                        {e.status === 'live' ? '🔴 Ao Vivo' : 'Em Breve'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {e.date}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} /> {e.location}</span>
                      <span className="flex items-center gap-1"><Users size={10} /> {e.players} jogadores</span>
                      <span className="flex items-center gap-1"><Trophy size={10} /> {e.prize}</span>
                    </div>
                  </div>
                  <Button variant={e.status === 'live' ? 'primary' : 'outline'} size="sm" className="shrink-0 self-start sm:self-auto">
                    {e.status === 'live' ? '▶ Assistir' : 'Ver detalhes'}
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

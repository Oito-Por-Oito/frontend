import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Users, Calendar, ChevronRight, Filter, Zap, Timer, Hourglass } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const TOURNAMENTS = [
  {
    id: 1,
    name: 'Arena Bullet Semanal',
    type: 'Arena',
    timeControl: '1+0',
    category: 'bullet',
    status: 'ao_vivo',
    players: 142,
    maxPlayers: 200,
    prize: null,
    startTime: 'Agora',
    duration: '1h',
    icon: '⚡',
  },
  {
    id: 2,
    name: 'Torneio Blitz Mensal',
    type: 'Suíço',
    timeControl: '3+2',
    category: 'blitz',
    status: 'inscricoes',
    players: 87,
    maxPlayers: 128,
    prize: null,
    startTime: 'Em 2h',
    duration: '2h',
    icon: '🔥',
  },
  {
    id: 3,
    name: 'Copa Rápida OitoPorOito',
    type: 'Eliminatória',
    timeControl: '10+0',
    category: 'rapid',
    status: 'inscricoes',
    players: 32,
    maxPlayers: 64,
    prize: 'Troféu Digital',
    startTime: 'Amanhã 19h',
    duration: '3h',
    icon: '🏆',
  },
  {
    id: 4,
    name: 'Clássico Dominical',
    type: 'Suíço',
    timeControl: '15+10',
    category: 'classical',
    status: 'inscricoes',
    players: 24,
    maxPlayers: 32,
    prize: null,
    startTime: 'Dom 15h',
    duration: '4h',
    icon: '♟️',
  },
  {
    id: 5,
    name: 'Arena Blitz Diária',
    type: 'Arena',
    timeControl: '5+3',
    category: 'blitz',
    status: 'encerrado',
    players: 98,
    maxPlayers: 100,
    prize: null,
    startTime: 'Ontem',
    duration: '1h',
    icon: '🎯',
  },
  {
    id: 6,
    name: 'Torneio Iniciantes',
    type: 'Suíço',
    timeControl: '10+5',
    category: 'rapid',
    status: 'inscricoes',
    players: 15,
    maxPlayers: 32,
    prize: null,
    startTime: 'Sáb 14h',
    duration: '2h',
    icon: '🌱',
  },
];

const STATUS_CONFIG = {
  ao_vivo: { label: 'Ao Vivo', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  inscricoes: { label: 'Inscrições Abertas', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  encerrado: { label: 'Encerrado', color: 'bg-surface-tertiary text-muted-foreground border-gold/10' },
};

const CATEGORY_ICONS = { bullet: Zap, blitz: Clock, rapid: Timer, classical: Hourglass };
const CATEGORY_COLORS = {
  bullet: 'text-orange-400',
  blitz: 'text-yellow-400',
  rapid: 'text-green-400',
  classical: 'text-blue-400',
};

const FILTERS = ['Todos', 'Ao Vivo', 'Inscrições', 'Bullet', 'Blitz', 'Rápido', 'Clássico'];

export default function Tournaments() {
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filtered = TOURNAMENTS.filter(t => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Ao Vivo') return t.status === 'ao_vivo';
    if (activeFilter === 'Inscrições') return t.status === 'inscricoes';
    if (activeFilter === 'Bullet') return t.category === 'bullet';
    if (activeFilter === 'Blitz') return t.category === 'blitz';
    if (activeFilter === 'Rápido') return t.category === 'rapid';
    if (activeFilter === 'Clássico') return t.category === 'classical';
    return true;
  });

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Torneios</h1>
            </div>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl">
              Participe de torneios ao vivo, arenas e competições. Teste suas habilidades contra jogadores do mundo todo.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { label: 'Torneios Hoje', value: '12', icon: '🏆' },
              { label: 'Jogadores Online', value: '1.4k', icon: '👥' },
              { label: 'Em Andamento', value: '3', icon: '⚡' },
              { label: 'Inscrições Abertas', value: '8', icon: '📋' },
            ].map(stat => (
              <Card key={stat.label} variant="gradient" className="p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-gold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter size={16} className="text-muted-foreground shrink-0" />
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                activeFilter === f
                  ? 'bg-gold text-surface-primary border-gold'
                  : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40 hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Lista de torneios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t, i) => {
            const CatIcon = CATEGORY_ICONS[t.category];
            const statusCfg = STATUS_CONFIG[t.status];
            const pct = Math.round((t.players / t.maxPlayers) * 100);

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card variant="gradient" className="h-full flex flex-col gap-4 hover:border-gold/40 transition-all cursor-pointer group">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{t.icon}</span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground group-hover:text-gold transition-colors truncate">{t.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <CatIcon size={12} className={CATEGORY_COLORS[t.category]} />
                          <span className="text-xs text-muted-foreground">{t.type} · {t.timeControl}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar size={13} />
                      <span>{t.startTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock size={13} />
                      <span>{t.duration}</span>
                    </div>
                  </div>

                  {/* Jogadores */}
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span className="flex items-center gap-1"><Users size={11} />{t.players}/{t.maxPlayers} jogadores</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Prize */}
                  {t.prize && (
                    <div className="text-xs text-gold flex items-center gap-1">
                      <Trophy size={12} />
                      <span>{t.prize}</span>
                    </div>
                  )}

                  {/* Ação */}
                  <div className="mt-auto">
                    {t.status === 'ao_vivo' && (
                      <Button variant="primary" size="sm" className="w-full">
                        Entrar Agora
                      </Button>
                    )}
                    {t.status === 'inscricoes' && (
                      <Button variant="outline" size="sm" className="w-full">
                        Inscrever-se
                      </Button>
                    )}
                    {t.status === 'encerrado' && (
                      <Button variant="ghost" size="sm" className="w-full flex items-center gap-1">
                        Ver Resultados <ChevronRight size={14} />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA criar torneio */}
        <Card variant="gradient" className="mt-8 p-6 sm:p-8 text-center border border-gold/30">
          <Trophy className="mx-auto text-gold mb-3" size={36} />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Crie seu próprio torneio</h2>
          <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
            Organize um torneio para seus amigos ou para a comunidade. Defina as regras, o tempo e convide jogadores.
          </p>
          <Button variant="primary" size="md">
            Criar Torneio
          </Button>
        </Card>
      </div>
    </PageLayout>
  );
}

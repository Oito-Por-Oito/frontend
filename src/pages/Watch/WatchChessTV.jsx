import React from 'react';
import { motion } from 'framer-motion';
import { Tv, Play, Users, Clock, Radio } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const LIVE_CHANNELS = [
  { id: 1, title: 'OitoPorOito TV — Ao Vivo', desc: 'Transmissão oficial da plataforma com análise de partidas ao vivo.', viewers: 1842, status: 'live', emoji: '📺' },
  { id: 2, title: 'Grand Chess Tour 2024', desc: 'Rodada 8 — Carlsen vs Caruana com comentários ao vivo.', viewers: 5621, status: 'live', emoji: '🏆' },
  { id: 3, title: 'Torneio Brasileiro de Xadrez', desc: 'Final do campeonato nacional com transmissão exclusiva.', viewers: 923, status: 'live', emoji: '🇧🇷' },
];

const UPCOMING = [
  { id: 4, title: 'World Chess Championship 2025', desc: 'Transmissão completa do match pelo título mundial.', time: 'Amanhã, 14h', emoji: '👑' },
  { id: 5, title: 'Speed Chess Championship', desc: 'Torneio de partidas rápidas com os melhores do mundo.', time: 'Sáb, 16h', emoji: '⚡' },
  { id: 6, title: 'Chess Olympiad 2024', desc: 'Olimpíada de Xadrez — Rodadas finais.', time: 'Dom, 10h', emoji: '🌍' },
];

export default function WatchChessTV() {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Tv className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Chess TV</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Assista transmissões ao vivo de torneios e partidas de grandes mestres com comentários especializados.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Player principal */}
        <Card variant="gradient" className="mb-8 border border-gold/20">
          <div className="aspect-video w-full bg-surface-tertiary rounded-xl flex items-center justify-center border border-gold/10 mb-4">
            <div className="text-center">
              <Tv size={48} className="mx-auto mb-3 text-gold opacity-50" />
              <p className="text-muted-foreground text-sm">Selecione um canal para assistir</p>
            </div>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-foreground">OitoPorOito TV</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Users size={11} /> 1.842 espectadores</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-red-400 font-semibold bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                <Radio size={10} className="animate-pulse" /> AO VIVO
              </span>
              <Button variant="primary" size="sm" className="flex items-center gap-1">
                <Play size={13} /> Assistir
              </Button>
            </div>
          </div>
        </Card>

        {/* Canais ao vivo */}
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Radio size={16} className="text-red-400 animate-pulse" /> Ao Vivo Agora
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {LIVE_CHANNELS.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card variant="gradient" className="h-full flex flex-col gap-3 hover:border-gold/40 transition-all cursor-pointer group">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{c.emoji}</span>
                  <span className="text-xs text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 flex items-center gap-1">
                    <Radio size={9} className="animate-pulse" /> LIVE
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-gold transition-colors">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Users size={10} /> {c.viewers.toLocaleString()}</span>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                    <Play size={11} /> Assistir
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Próximas transmissões */}
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock size={16} className="text-gold" /> Próximas Transmissões
        </h2>
        <div className="space-y-3">
          {UPCOMING.map((u, i) => (
            <motion.div key={u.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}>
              <Card variant="gradient" className="flex items-center gap-4 hover:border-gold/40 transition-all cursor-pointer group">
                <span className="text-2xl shrink-0">{u.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-gold transition-colors truncate">{u.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{u.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-gold font-semibold">{u.time}</div>
                  <Button variant="outline" size="sm" className="mt-1 text-xs">Lembrar</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

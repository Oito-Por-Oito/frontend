import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Search, Users, ExternalLink, Star } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const STREAMERS = [
  { id: 1, name: 'Hikaru Nakamura', handle: 'GMHikaru', viewers: 28420, followers: '1.2M', platform: 'Twitch', rating: 2794, title: 'GM', live: true, specialty: 'Bullet & Blitz', emoji: '⚡', verified: true },
  { id: 2, name: 'Magnus Carlsen', handle: 'MagnusCarlsen', viewers: 18650, followers: '890K', platform: 'YouTube', rating: 2830, title: 'GM', live: true, specialty: 'Clássico & Análise', emoji: '👑', verified: true },
  { id: 3, name: 'Daniel Naroditsky', handle: 'DanielNaroditsky', viewers: 12340, followers: '620K', platform: 'Twitch', rating: 2622, title: 'GM', live: true, specialty: 'Ensino & Speedrun', emoji: '🎓', verified: true },
  { id: 4, name: 'Levy Rozman', handle: 'GothamChess', viewers: 9870, followers: '2.1M', platform: 'YouTube', rating: 2421, title: 'IM', live: false, specialty: 'Entretenimento', emoji: '🎭', verified: true },
  { id: 5, name: 'Alexandra Botez', handle: 'BotezLive', viewers: 7230, followers: '980K', platform: 'Twitch', rating: 2124, title: 'WFM', live: true, specialty: 'Entretenimento & Blitz', emoji: '🌟', verified: true },
  { id: 6, name: 'Eric Rosen', handle: 'EricRosen', viewers: 5640, followers: '540K', platform: 'Twitch', rating: 2382, title: 'IM', live: false, specialty: 'Gambitos & Táticas', emoji: '🎯', verified: false },
  { id: 7, name: 'Anna Rudolf', handle: 'AnnaRudolf', viewers: 4120, followers: '310K', platform: 'YouTube', rating: 2300, title: 'IM', live: true, specialty: 'Análise & Ensino', emoji: '📚', verified: false },
  { id: 8, name: 'John Bartholomew', handle: 'Fins', viewers: 3890, followers: '420K', platform: 'Twitch', rating: 2471, title: 'IM', live: false, specialty: 'Fundamentos', emoji: '🏫', verified: false },
];

const PLATFORMS = ['Todos', 'Twitch', 'YouTube'];

export default function WatchStreamers() {
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('Todos');
  const [onlyLive, setOnlyLive] = useState(false);

  const filtered = STREAMERS.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.handle.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platform === 'Todos' || s.platform === platform;
    const matchLive = !onlyLive || s.live;
    return matchSearch && matchPlatform && matchLive;
  });

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Radio className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Streamers</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Acompanhe os melhores streamers de xadrez do mundo ao vivo e em replay.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar streamer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-secondary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${platform === p ? 'bg-gold text-surface-primary border-gold' : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'}`}>
                {p}
              </button>
            ))}
            <button
              onClick={() => setOnlyLive(!onlyLive)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${onlyLive ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'}`}>
              <Radio size={11} className={onlyLive ? 'animate-pulse' : ''} /> Só ao vivo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card variant="gradient" className="h-full flex flex-col gap-3 hover:border-gold/40 transition-all cursor-pointer group">
                {/* Avatar e status */}
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-surface-tertiary border border-gold/20 flex items-center justify-center text-3xl">
                      {s.emoji}
                    </div>
                    {s.live && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-surface-primary animate-pulse" />
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {s.verified && <Star size={12} className="text-gold fill-gold" />}
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold border ${s.platform === 'Twitch' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                      {s.platform}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-gold transition-colors">{s.name}</h3>
                    <span className="text-xs bg-gold/20 text-gold px-1.5 py-0.5 rounded border border-gold/30 font-bold">{s.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">@{s.handle}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.specialty}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-surface-tertiary rounded-lg p-1.5">
                    <div className="text-xs font-bold text-gold">{s.rating}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="bg-surface-tertiary rounded-lg p-1.5">
                    <div className="text-xs font-bold text-foreground">{s.followers}</div>
                    <div className="text-xs text-muted-foreground">Seguidores</div>
                  </div>
                </div>

                {/* Ação */}
                <div className="flex items-center justify-between gap-2">
                  {s.live ? (
                    <span className="text-xs text-red-400 flex items-center gap-1 font-semibold">
                      <Radio size={10} className="animate-pulse" /> {s.viewers.toLocaleString()} ao vivo
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Offline</span>
                  )}
                  <Button variant={s.live ? 'primary' : 'outline'} size="sm" className="flex items-center gap-1 text-xs">
                    <ExternalLink size={10} /> {s.live ? 'Assistir' : 'Seguir'}
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

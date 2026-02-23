import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart2, Trophy, Zap, Clock, Hourglass, Search, RefreshCw, Loader2, Crown } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import { useRanking, getTier } from '@/hooks/useRanking';
import { useAuth } from '@/hooks/useAuth';

const CATEGORIES = [
  { id: 'blitz', label: 'Blitz', icon: Zap },
  { id: 'rapid', label: 'Rápido', icon: Clock },
  { id: 'classical', label: 'Clássico', icon: Hourglass },
];

const RANK_MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

function PlayerRow({ player, index }) {
  const tier = getTier(player.rating);
  return (
    <Link to={`/player/${player.user_id}`}>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: Math.min(index * 0.03, 0.5) }}
        className="flex items-center gap-3 p-3 rounded-lg border border-gold/10 bg-surface-secondary hover:border-gold/30 hover:bg-surface-tertiary transition-all cursor-pointer"
      >
        <div className="w-8 text-center flex-shrink-0">
          {RANK_MEDALS[player.rank] ? (
            <span className="text-xl">{RANK_MEDALS[player.rank]}</span>
          ) : (
            <span className="text-sm font-bold text-muted-foreground">#{player.rank}</span>
          )}
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center text-sm font-bold text-gold flex-shrink-0 overflow-hidden">
          {player.avatar_url ? (
            <img src={player.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            (player.display_name || player.username || '?')[0].toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate">
              {player.display_name || player.username}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded-full border flex-shrink-0 hidden sm:inline" style={{ color: tier.color, borderColor: tier.color + '50', backgroundColor: tier.color + '15' }}>
              {tier.emoji} {tier.label}
            </span>
          </div>
          {player.username && player.display_name && player.username !== player.display_name && (
            <div className="text-xs text-muted-foreground">@{player.username}</div>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-base font-bold text-gold">{player.rating}</div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function Ranking() {
  const { user } = useAuth();
  const {
    players, myRank, loading, refreshing, loadingMore, hasMore,
    searchQuery, setSearchQuery, mode, setMode, error, refresh, loadMore,
  } = useRanking('blitz');

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 200 && !loadingMore && hasMore) {
      loadMore();
    }
  }, [loadMore, loadingMore, hasMore]);

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <BarChart2 className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Tabela de Classificação</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Os melhores jogadores da plataforma OitoPorOito, classificados por rating em cada modalidade.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {myRank && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Card variant="gradient" className="p-4 border border-gold/30 bg-gradient-to-r from-gold/10 to-transparent">
              <div className="flex items-center gap-4">
                <Crown className="text-gold flex-shrink-0" size={24} />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Sua posição ({CATEGORIES.find(c => c.id === mode)?.label})</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl font-bold text-gold">#{myRank.rank}</span>
                    <span className="text-lg font-semibold text-foreground">{myRank.rating} pts</span>
                    <span className="text-sm px-2 py-0.5 rounded-full border" style={{ color: myRank.tier.color, borderColor: myRank.tier.color + '50', backgroundColor: myRank.tier.color + '15' }}>
                      {myRank.tier.emoji} {myRank.tier.label}
                    </span>
                  </div>
                </div>
                <Link to={`/player/${user?.id}`} className="text-sm text-gold hover:text-gold-light transition-colors underline underline-offset-2">
                  Ver perfil
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setMode(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    mode === cat.id
                      ? 'bg-gold/20 border-gold text-gold'
                      : 'bg-surface-secondary border-gold/20 text-muted-foreground hover:border-gold/40 hover:text-foreground'
                  }`}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar jogador..."
                className="w-full bg-surface-secondary border border-gold/20 rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            <button
              onClick={refresh}
              disabled={refreshing}
              className="p-2 bg-surface-secondary border border-gold/20 rounded-lg text-muted-foreground hover:text-foreground hover:border-gold/40 transition-colors"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {!loading && !searchQuery && players.length >= 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[players[1], players[0], players[2]].filter(Boolean).map((p, i) => {
              const tier = getTier(p.rating);
              return (
                <Link key={p.id} to={`/player/${p.user_id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`text-center p-5 rounded-xl border cursor-pointer hover:scale-105 transition-transform ${
                      p.rank === 1 ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 to-surface-secondary' :
                      p.rank === 2 ? 'border-gray-400/50 bg-surface-secondary' : 'border-orange-700/50 bg-surface-secondary'
                    }`}
                  >
                    <div className="text-4xl mb-2">{RANK_MEDALS[p.rank]}</div>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/30 flex items-center justify-center text-xl font-bold text-gold mx-auto mb-2 overflow-hidden">
                      {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : (p.display_name || p.username || '?')[0].toUpperCase()}
                    </div>
                    <div className="font-bold text-foreground truncate">{p.display_name || p.username}</div>
                    <div className="text-lg font-bold text-gold">{p.rating}</div>
                    <div className="text-xs mt-1" style={{ color: tier.color }}>{tier.emoji} {tier.label}</div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}

        <Card variant="gradient" className="border border-gold/20">
          <div className="p-4 border-b border-gold/10 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">
              {CATEGORIES.find(c => c.id === mode)?.label} · {searchQuery ? `"${searchQuery}"` : 'Todos os jogadores'}
            </h2>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-gold" />}
          </div>
          {error && <div className="p-6 text-center text-error text-sm">{error}</div>}
          {!loading && players.length === 0 && (
            <div className="p-12 text-center">
              <Trophy className="mx-auto mb-3 text-muted-foreground" size={32} />
              <p className="text-muted-foreground text-sm">{searchQuery ? 'Nenhum jogador encontrado.' : 'Nenhum jogador cadastrado ainda.'}</p>
            </div>
          )}
          <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto" onScroll={handleScroll}>
            {players.map((player, index) => (
              <PlayerRow key={player.id} player={player} index={index} />
            ))}
            {loadingMore && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-gold" />
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}

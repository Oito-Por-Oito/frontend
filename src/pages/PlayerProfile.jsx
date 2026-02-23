import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Trophy, Clock, Zap, Target, Calendar, Star, UserPlus, UserCheck, UserX, Loader2, Play } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PageLayout } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { usePublicProfile, usePlayerGames } from '@/hooks/usePublicProfile';
import { useFriendship } from '@/hooks/useFriendship';
import { useAuth } from '@/hooks/useAuth';
import { getTier } from '@/hooks/useRanking';

const RATING_MODES = [
  { key: 'blitz', label: 'Blitz', icon: Zap, field: 'rating_blitz' },
  { key: 'rapid', label: 'Rápido', icon: Clock, field: 'rating_rapid' },
  { key: 'classical', label: 'Clássico', icon: Trophy, field: 'rating_classical' },
];

const RESULT_REASON_LABELS = {
  checkmate: 'Xeque-mate',
  resignation: 'Desistência',
  timeout: 'Tempo esgotado',
  stalemate: 'Afogamento',
  agreement: 'Acordo mútuo',
  insufficient: 'Material insuficiente',
  repetition: 'Repetição',
  fifty_moves: '50 movimentos',
};

function formatDuration(seconds) {
  if (!seconds) return '-';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function FriendshipButton({ targetUserId }) {
  const { status, loading, actionLoading, isOwnProfile, sendRequest, cancelRequest, acceptRequest, declineRequest, removeFriend } = useFriendship(targetUserId);

  if (isOwnProfile || loading) return null;

  if (status === 'none' || status === 'declined') {
    return (
      <Button onClick={sendRequest} disabled={actionLoading} className="flex items-center gap-2 bg-gold hover:bg-gold-light text-background font-semibold px-4 py-2 rounded-lg transition-colors">
        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
        Adicionar Amigo
      </Button>
    );
  }
  if (status === 'pending_sent') {
    return (
      <Button onClick={cancelRequest} disabled={actionLoading} className="flex items-center gap-2 bg-surface-secondary border border-gold/30 text-muted-foreground hover:text-error hover:border-error/50 px-4 py-2 rounded-lg transition-colors">
        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
        Pendente · Cancelar
      </Button>
    );
  }
  if (status === 'pending_received') {
    return (
      <div className="flex gap-2">
        <Button onClick={acceptRequest} disabled={actionLoading} className="flex items-center gap-2 bg-success/20 border border-success/40 text-success hover:bg-success/30 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
          {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
          Aceitar
        </Button>
        <Button onClick={declineRequest} disabled={actionLoading} className="flex items-center gap-2 bg-error/10 border border-error/30 text-error hover:bg-error/20 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
          <UserX className="w-4 h-4" />
          Recusar
        </Button>
      </div>
    );
  }
  if (status === 'accepted') {
    return (
      <Button onClick={removeFriend} disabled={actionLoading} className="flex items-center gap-2 bg-surface-secondary border border-gold/20 text-muted-foreground hover:text-error hover:border-error/40 px-4 py-2 rounded-lg transition-colors text-sm">
        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4 text-success" />}
        Amigos · Remover
      </Button>
    );
  }
  return null;
}

export default function PlayerProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading, error } = usePublicProfile(userId);
  const { games, loading: gamesLoading, loadingMore, hasMore, loadMore } = usePlayerGames(profile?.id);
  const [selectedMode, setSelectedMode] = useState('blitz');

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-gold" />
        </div>
      </PageLayout>
    );
  }

  if (error || !profile) {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <User className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h2 className="text-xl font-bold text-foreground mb-2">Jogador não encontrado</h2>
          <p className="text-muted-foreground mb-6">{error || 'Este perfil não existe ou foi removido.'}</p>
          <Button onClick={() => navigate(-1)} className="bg-gold text-background px-6 py-2 rounded-lg font-semibold">Voltar</Button>
        </div>
      </PageLayout>
    );
  }

  const isOwnProfile = user?.id === userId;
  const displayName = profile.display_name || profile.username || 'Jogador';
  const initial = displayName[0]?.toUpperCase() || '?';
  const totalGames = profile.total_games || 0;
  const wins = profile.wins || 0;
  const losses = profile.losses || 0;
  const draws = profile.draws || 0;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  const currentRating = profile[RATING_MODES.find(m => m.key === selectedMode)?.field] || 800;
  const tier = getTier(currentRating);

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm">
          <ArrowLeft size={16} />
          Voltar
        </button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="gradient" className="p-6 mb-6 border border-gold/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={displayName} className="w-20 h-20 rounded-full object-cover border-2 border-gold/40" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/40 flex items-center justify-center text-3xl font-bold text-gold">
                    {initial}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 text-lg">{tier.emoji}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground truncate">{displayName}</h1>
                  {profile.username && profile.username !== displayName && (
                    <span className="text-sm text-muted-foreground">@{profile.username}</span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold border" style={{ color: tier.color, borderColor: tier.color + '50', backgroundColor: tier.color + '15' }}>
                    {tier.label}
                  </span>
                </div>
                {profile.bio && <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{profile.bio}</p>}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  {profile.streak_days > 0 && (
                    <span className="flex items-center gap-1"><Star size={12} className="text-gold" />{profile.streak_days} dias seguidos</span>
                  )}
                  {profile.created_at && (
                    <span className="flex items-center gap-1"><Calendar size={12} />Membro desde {format(new Date(profile.created_at), 'MMM yyyy', { locale: ptBR })}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {isOwnProfile ? (
                  <Link to="/profile">
                    <Button className="flex items-center gap-2 bg-surface-secondary border border-gold/20 text-foreground hover:border-gold/50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Editar Perfil
                    </Button>
                  </Link>
                ) : (
                  <FriendshipButton targetUserId={userId} />
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-4">
            {/* Ratings */}
            <Card variant="gradient" className="p-4 border border-gold/20">
              <h3 className="text-sm font-semibold text-foreground mb-3">Ratings</h3>
              <div className="space-y-2">
                {RATING_MODES.map(mode => {
                  const rating = profile[mode.field] || 800;
                  const modeTier = getTier(rating);
                  const Icon = mode.icon;
                  const isSelected = selectedMode === mode.key;
                  return (
                    <button
                      key={mode.key}
                      onClick={() => setSelectedMode(mode.key)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${isSelected ? 'border-gold/60 bg-gold/10' : 'border-gold/10 bg-surface-secondary hover:border-gold/30'}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={isSelected ? 'text-gold' : 'text-muted-foreground'} />
                        <span className={`text-sm font-medium ${isSelected ? 'text-gold' : 'text-foreground'}`}>{mode.label}</span>
                      </div>
                      <div className="text-right">
                        <div className={`text-base font-bold ${isSelected ? 'text-gold' : 'text-foreground'}`}>{rating}</div>
                        <div className="text-xs text-muted-foreground">{modeTier.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Stats */}
            <Card variant="gradient" className="p-4 border border-gold/20">
              <h3 className="text-sm font-semibold text-foreground mb-3">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Partidas', value: totalGames, color: 'text-foreground' },
                  { label: 'Vitórias', value: wins, color: 'text-success' },
                  { label: 'Derrotas', value: losses, color: 'text-error' },
                  { label: 'Empates', value: draws, color: 'text-muted-foreground' },
                ].map(stat => (
                  <div key={stat.label} className="bg-surface-secondary rounded-lg p-3 text-center">
                    <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
              {/* Win rate bar */}
              {totalGames > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>V {wins}</span>
                    <span className="text-foreground font-medium">{winRate}% vitórias</span>
                    <span>D {losses}</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden">
                    <div className="bg-success transition-all" style={{ width: `${(wins / totalGames) * 100}%` }} />
                    <div className="bg-muted-foreground/30 transition-all" style={{ width: `${(draws / totalGames) * 100}%` }} />
                    <div className="bg-error transition-all" style={{ width: `${(losses / totalGames) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span className="text-success">Vitórias</span>
                    <span>Empates {draws}</span>
                    <span className="text-error">Derrotas</span>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right column — game history */}
          <div className="lg:col-span-2">
            <Card variant="gradient" className="p-4 border border-gold/20">
              <h3 className="text-sm font-semibold text-foreground mb-4">Histórico de Partidas</h3>
              {gamesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gold" />
                </div>
              ) : games.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="mx-auto mb-3 text-muted-foreground" size={32} />
                  <p className="text-muted-foreground text-sm">Nenhuma partida encontrada</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {games.map(game => {
                    const resultColor = game.playerResult === 'win' ? 'text-success border-success/30 bg-success/10' : game.playerResult === 'loss' ? 'text-error border-error/30 bg-error/10' : 'text-muted-foreground border-border bg-surface-secondary';
                    const resultLabel = game.playerResult === 'win' ? 'Vitória' : game.playerResult === 'loss' ? 'Derrota' : 'Empate';
                    const tcIcons = { blitz: '⚡', rapid: '🕐', classical: '♟', bullet: '🚀' };
                    return (
                      <Link key={game.id} to={`/history/${game.id}`} className="block">
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-gold/10 bg-surface-secondary hover:border-gold/30 hover:bg-surface-tertiary transition-all cursor-pointer">
                          {/* Result badge */}
                          <div className={`w-16 text-center px-2 py-1 rounded border text-xs font-bold flex-shrink-0 ${resultColor}`}>
                            {resultLabel}
                          </div>
                          {/* Opponent */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground truncate">
                                vs {game.opponent?.display_name || game.opponent?.username || 'Desconhecido'}
                              </span>
                              <span className="text-xs text-muted-foreground">({game.opponentRating})</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span>{tcIcons[game.time_control] || '♟'} {game.time_control}</span>
                              <span>·</span>
                              <span>{RESULT_REASON_LABELS[game.result_reason] || game.result_reason}</span>
                              <span>·</span>
                              <span>{formatDuration(game.durationSeconds)}</span>
                            </div>
                          </div>
                          {/* Date + replay icon */}
                          <div className="text-right flex-shrink-0">
                            {game.ended_at && (
                              <div className="text-xs text-muted-foreground mb-1">
                                {format(new Date(game.ended_at), 'dd/MM/yy', { locale: ptBR })}
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-xs text-gold">
                              <Play size={10} />
                              Replay
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  {hasMore && (
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="w-full py-3 text-sm text-gold hover:text-gold-light border border-gold/20 hover:border-gold/40 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Carregar mais partidas'}
                    </button>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

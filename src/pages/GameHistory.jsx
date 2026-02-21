import React from 'react';
import { motion } from 'framer-motion';
import { History, Filter, Trophy, X as XIcon, Clock, RefreshCw } from 'lucide-react';
import { PageLayout } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import GameHistoryCard from '@/components/GameHistory/GameHistoryCard';
import { useGameHistory } from '@/hooks/useGameHistory';
import { useAuth } from '@/hooks/useAuth';

export default function GameHistory() {
  const { user, loading: authLoading } = useAuth();
  const { 
    games, 
    loading, 
    error, 
    hasMore, 
    filters, 
    updateFilters, 
    loadMore,
    refresh,
    profileId 
  } = useGameHistory();

  // Require authentication
  if (!authLoading && !user) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center">
            <History className="mx-auto mb-4 text-gold" size={48} />
            <h1 className="text-2xl font-bold text-foreground mb-2">Histórico de Partidas</h1>
            <p className="text-muted-foreground mb-6">Faça login para ver suas partidas anteriores</p>
            <a
              href="/login"
              className="px-6 py-3 bg-gold text-background font-semibold rounded-lg hover:bg-gold-light transition-colors"
            >
              Fazer Login
            </a>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="flex-1 py-6 sm:py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <History className="text-gold" size={28} />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  Histórico de Partidas
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Reveja e analise suas partidas anteriores
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Atualizar
            </Button>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="gradient" className="p-3 sm:p-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <Filter size={16} className="text-muted-foreground shrink-0" />

                {/* Result filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Resultado:</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { value: 'all', label: 'Todos' },
                      { value: 'wins', label: 'Vitórias', icon: '🏆' },
                      { value: 'losses', label: 'Derrotas', icon: '😞' },
                      { value: 'draws', label: 'Empates', icon: '🤝' },
                    ].map(({ value, label, icon }) => (
                      <button
                        key={value}
                        onClick={() => updateFilters({ result: value })}
                        className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                          filters.result === value
                            ? 'bg-gold text-background font-semibold'
                            : 'bg-surface-primary text-muted-foreground hover:bg-surface-tertiary border border-gold/20'
                        }`}
                      >
                        {icon && <span className="mr-1">{icon}</span>}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time control filter */}
                <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
                  <Clock size={14} className="text-muted-foreground shrink-0" />
                  <select
                    value={filters.timeControl}
                    onChange={(e) => updateFilters({ timeControl: e.target.value })}
                    className="flex-1 sm:flex-none px-3 py-1.5 text-xs bg-surface-primary text-foreground rounded-lg
                               border border-gold/20 focus:border-gold focus:outline-none"
                  >
                    <option value="all">Todos os tempos</option>
                    <option value="bullet">Bullet</option>
                    <option value="blitz">Blitz</option>
                    <option value="rapid">Rapid</option>
                    <option value="classical">Classical</option>
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Error state */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Games list */}
          {loading && games.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">Carregando partidas...</p>
              </div>
            </div>
          ) : games.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <History className="mx-auto mb-4 text-muted-foreground/40" size={64} />
              <h2 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">
                Nenhuma partida encontrada
              </h2>
              <p className="text-muted-foreground/60 text-sm mb-6">
                {filters.result !== 'all' || filters.timeControl !== 'all'
                  ? 'Tente ajustar os filtros'
                  : 'Jogue algumas partidas online para vê-las aqui'}
              </p>
              {(filters.result !== 'all' || filters.timeControl !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ result: 'all', timeControl: 'all' })}
                >
                  Limpar filtros
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GameHistoryCard game={game} profileId={profileId} />
                  </motion.div>
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="text-center mt-8">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loading}
                    className="flex items-center gap-2 mx-auto"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      'Carregar mais'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </PageLayout>
  );
}

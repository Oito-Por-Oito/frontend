import React from 'react';
import { motion } from 'framer-motion';
import { Eye, RefreshCw } from 'lucide-react';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui';
import LiveGameCard from '@/components/PlayOnline/LiveGameCard';
import { useLiveGames } from '@/hooks/useLiveGames';

export default function WatchGames() {
  const { games, loading, error, refresh } = useLiveGames();

  return (
    <PageLayout>
      <main className="flex-1 py-6 sm:py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Eye size={28} className="text-red-500 shrink-0" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                Partidas ao Vivo
              </h1>
              {games.length > 0 && (
                <span className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-full animate-pulse font-semibold">
                  {games.length} AO VIVO
                </span>
              )}
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
          </div>

          {/* Conteúdo */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="w-14 h-14 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">Carregando partidas...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <p className="text-red-400 mb-4 text-sm">Erro ao carregar partidas: {error}</p>
                <Button variant="primary" size="sm" onClick={refresh}>
                  Tentar novamente
                </Button>
              </div>
            </div>
          ) : games.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[300px] text-center"
            >
              <div className="w-20 h-20 bg-surface-secondary rounded-full flex items-center justify-center mb-6 border border-gold/20">
                <Eye size={40} className="text-muted-foreground/40" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                Nenhuma partida ao vivo
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mb-6">
                Não há partidas acontecendo no momento. Volte mais tarde ou inicie uma nova partida!
              </p>
              <Button variant="primary" as="a" href="/play-online">
                Jogar Online
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <LiveGameCard game={game} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </PageLayout>
  );
}

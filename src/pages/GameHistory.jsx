import React from 'react';
import { motion } from 'framer-motion';
import { History, Filter, Trophy, X as XIcon, Clock, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
      <div className="min-h-screen bg-[#181818] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <History className="mx-auto mb-4 text-[#c29d5d]" size={48} />
            <h1 className="text-2xl font-bold text-white mb-2">Histórico de Partidas</h1>
            <p className="text-gray-400 mb-6">Faça login para ver suas partidas anteriores</p>
            <a href="/login" className="px-6 py-3 bg-[#c29d5d] text-black font-semibold rounded-lg hover:bg-[#d4af70] transition-colors">
              Fazer Login
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <History className="text-[#c29d5d]" size={32} />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Histórico de Partidas</h1>
                <p className="text-gray-400 text-sm">Reveja e analise suas partidas anteriores</p>
              </div>
            </div>
            
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] text-gray-300 
                         rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Atualizar
            </button>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-[#1e1e1e] rounded-xl"
          >
            <Filter size={18} className="text-gray-400" />
            
            {/* Result filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-400">Resultado:</span>
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
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      filters.result === value
                        ? 'bg-[#c29d5d] text-black font-semibold'
                        : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]'
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
              <Clock size={14} className="text-gray-400" />
              <select
                value={filters.timeControl}
                onChange={(e) => updateFilters({ timeControl: e.target.value })}
                className="px-3 py-1.5 text-xs bg-[#2a2a2a] text-gray-300 rounded-lg 
                           border border-gray-700 focus:border-[#c29d5d] focus:outline-none"
              >
                <option value="all">Todos os tempos</option>
                <option value="bullet">Bullet</option>
                <option value="blitz">Blitz</option>
                <option value="rapid">Rapid</option>
                <option value="classical">Classical</option>
              </select>
            </div>
          </motion.div>

          {/* Error state */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Games list */}
          {loading && games.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#c29d5d] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Carregando partidas...</p>
              </div>
            </div>
          ) : games.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <History className="mx-auto mb-4 text-gray-600" size={64} />
              <h2 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma partida encontrada</h2>
              <p className="text-gray-500 mb-6">
                {filters.result !== 'all' || filters.timeControl !== 'all'
                  ? 'Tente ajustar os filtros'
                  : 'Jogue algumas partidas online para vê-las aqui'}
              </p>
              {(filters.result !== 'all' || filters.timeControl !== 'all') && (
                <button
                  onClick={() => updateFilters({ result: 'all', timeControl: 'all' })}
                  className="px-4 py-2 text-sm text-[#c29d5d] border border-[#c29d5d] rounded-lg hover:bg-[#c29d5d]/10 transition-colors"
                >
                  Limpar filtros
                </button>
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
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-3 bg-[#2a2a2a] text-gray-300 rounded-lg hover:bg-[#333] 
                               transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      'Carregar mais'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

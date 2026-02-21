import React from 'react';
import { motion } from 'framer-motion';
import { Eye, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveGameCard from '@/components/PlayOnline/LiveGameCard';
import { useLiveGames } from '@/hooks/useLiveGames';

export default function WatchGames() {
  const { games, loading, error, refresh } = useLiveGames();

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Eye size={32} className="text-red-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Partidas ao Vivo
              </h1>
              {games.length > 0 && (
                <span className="text-xs sm:text-sm bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full animate-pulse font-semibold">
                  {games.length} AO VIVO
                </span>
              )}
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 hover:text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Atualizar
            </button>
          </div>

          {/* Conteúdo */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#c29d5d] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Carregando partidas...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <p className="text-red-400 mb-4">Erro ao carregar partidas: {error}</p>
                <button
                  onClick={refresh}
                  className="px-4 py-2 bg-[#c29d5d] hover:bg-[#d4af6d] text-black font-semibold rounded-lg"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : games.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[300px] text-center"
            >
              <div className="w-24 h-24 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-6">
                <Eye size={48} className="text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-300 mb-2">
                Nenhuma partida ao vivo
              </h2>
              <p className="text-gray-500 max-w-md">
                Não há partidas acontecendo no momento. Volte mais tarde ou inicie uma nova partida!
              </p>
              <a
                href="/play-online"
                className="mt-6 px-6 py-3 bg-[#c29d5d] hover:bg-[#d4af6d] text-black font-semibold rounded-lg transition-colors"
              >
                Jogar Online
              </a>
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

      <Footer />
    </div>
  );
}

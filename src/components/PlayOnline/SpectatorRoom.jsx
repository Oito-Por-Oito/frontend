import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Users } from 'lucide-react';
import OnlineChessBoard from './OnlineChessBoard';
import PlayerInfoOnline from './PlayerInfoOnline';
import MoveHistory from './MoveHistory';
import { useSpectator } from '@/hooks/useSpectator';
import { getRatingForTimeControl, getResultText } from '@/lib/gameHelpers';

export default function SpectatorRoom({ gameId }) {
  const navigate = useNavigate();
  const { 
    game, 
    chess, 
    moves, 
    timeLeft, 
    spectatorCount, 
    loading, 
    error,
    lastMove,
    isGameOver 
  } = useSpectator(gameId);

  // Ratings dos jogadores
  const whiteRating = game ? getRatingForTimeControl(game.white_player, game.time_control) : 800;
  const blackRating = game ? getRatingForTimeControl(game.black_player, game.time_control) : 800;

  // Texto do resultado
  const resultText = useMemo(() => {
    if (!game || !isGameOver) return null;
    
    if (game.result === '1-0') return 'Brancas vencem!';
    if (game.result === '0-1') return 'Pretas vencem!';
    if (game.result === '1/2-1/2') return 'Empate!';
    return 'Fim de jogo';
  }, [game, isGameOver]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c29d5d] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando partida...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Partida não encontrada'}</p>
          <button
            onClick={() => navigate('/watch')}
            className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg"
          >
            Voltar às partidas
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <button
          onClick={() => navigate('/watch')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Badge Espectador */}
          <span className="px-3 py-1.5 bg-purple-600/80 text-white text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Eye size={14} />
            ESPECTADOR
          </span>
          
          {/* Contagem de espectadores */}
          <span className="flex items-center gap-1.5 text-sm text-gray-400 bg-[#2a2a2a] px-3 py-1.5 rounded-full">
            <Users size={14} />
            {spectatorCount} assistindo
          </span>
          
          {/* Controle de tempo */}
          <span className="text-sm text-gray-400 bg-[#2a2a2a] px-3 py-1.5 rounded-full">
            {game.time_control}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coluna do tabuleiro */}
        <div className="lg:col-span-2 space-y-3">
          {/* Pretas (em cima - sempre perspectiva brancas) */}
          <PlayerInfoOnline
            player={game.black_player}
            rating={blackRating}
            timeLeft={timeLeft.black}
            isActive={game.current_turn === 'black' && !isGameOver}
            isMe={false}
          />

          {/* Tabuleiro (somente leitura) */}
          <OnlineChessBoard
            chess={chess}
            myColor="white"
            isMyTurn={false}
            onMove={() => {}}
            lastMove={lastMove}
            disabled={true}
          />

          {/* Brancas (embaixo) */}
          <PlayerInfoOnline
            player={game.white_player}
            rating={whiteRating}
            timeLeft={timeLeft.white}
            isActive={game.current_turn === 'white' && !isGameOver}
            isMe={false}
          />
        </div>

        {/* Coluna lateral */}
        <div className="space-y-4">
          {/* Resultado do jogo */}
          {isGameOver && resultText && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 rounded-xl text-center bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] border border-[#c29d5d]/50"
            >
              <div className="text-4xl mb-2">
                {game.result === '1/2-1/2' ? '🤝' : '🏆'}
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{resultText}</h3>
              <p className="text-gray-400 text-sm">{game.result}</p>
              {game.result_reason && (
                <p className="text-gray-500 text-xs mt-1 capitalize">
                  {game.result_reason.replace(/_/g, ' ')}
                </p>
              )}
              
              <button
                onClick={() => navigate('/watch')}
                className="mt-4 px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg transition-colors"
              >
                Ver outras partidas
              </button>
            </motion.div>
          )}

          {/* Info do espectador */}
          <div className="bg-[#1e1e1e] rounded-xl p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <Eye size={18} />
              <span className="font-semibold">Modo Espectador</span>
            </div>
            <p className="text-gray-400 text-sm">
              Você está assistindo esta partida ao vivo. O tabuleiro é atualizado em tempo real conforme os jogadores fazem seus lances.
            </p>
          </div>

          {/* Histórico de lances */}
          <MoveHistory moves={moves} />

          {/* Status da partida */}
          {!isGameOver && (
            <div className="bg-[#1e1e1e] rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-gray-300">
                  Vez das {game.current_turn === 'white' ? 'brancas' : 'pretas'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

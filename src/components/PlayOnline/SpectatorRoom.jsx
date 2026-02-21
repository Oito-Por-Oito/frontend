import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Users } from 'lucide-react';
import OnlineChessBoard from './OnlineChessBoard';
import PlayerInfoOnline from './PlayerInfoOnline';
import MoveHistory from './MoveHistory';
import { useSpectator } from '@/hooks/useSpectator';
import { getRatingForTimeControl } from '@/lib/gameHelpers';
import { Card, Button } from '@/components/ui';

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
    isGameOver,
  } = useSpectator(gameId);

  const whiteRating = game ? getRatingForTimeControl(game.white_player, game.time_control) : 800;
  const blackRating = game ? getRatingForTimeControl(game.black_player, game.time_control) : 800;

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
          <div className="w-14 h-14 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Carregando partida...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4 text-sm">{error || 'Partida não encontrada'}</p>
          <Button variant="outline" size="sm" onClick={() => navigate('/watch')}>
            Voltar às partidas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl mx-auto overflow-x-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <button
          onClick={() => navigate('/watch')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 bg-purple-600/80 text-white text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Eye size={12} />
            ESPECTADOR
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-surface-secondary px-2.5 py-1 rounded-full border border-gold/10">
            <Users size={12} />
            {spectatorCount} assistindo
          </span>
          <span className="text-xs text-muted-foreground bg-surface-secondary px-2.5 py-1 rounded-full border border-gold/10">
            {game.time_control}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coluna do tabuleiro */}
        <div className="lg:col-span-2 space-y-3">
          <PlayerInfoOnline
            player={game.black_player}
            rating={blackRating}
            timeLeft={timeLeft.black}
            isActive={game.current_turn === 'black' && !isGameOver}
            isMe={false}
          />
          <OnlineChessBoard
            chess={chess}
            myColor="white"
            isMyTurn={false}
            onMove={() => {}}
            lastMove={lastMove}
            disabled={true}
          />
          <PlayerInfoOnline
            player={game.white_player}
            rating={whiteRating}
            timeLeft={timeLeft.white}
            isActive={game.current_turn === 'white' && !isGameOver}
            isMe={false}
          />
        </div>

        {/* Coluna lateral */}
        <div className="space-y-3">
          {/* Resultado */}
          {isGameOver && resultText && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Card variant="gradient" className="p-5 text-center border border-gold/30">
                <div className="text-3xl mb-2">
                  {game.result === '1/2-1/2' ? '🤝' : '🏆'}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">{resultText}</h3>
                <p className="text-muted-foreground text-xs">{game.result}</p>
                {game.result_reason && (
                  <p className="text-muted-foreground/60 text-xs mt-1 capitalize">
                    {game.result_reason.replace(/_/g, ' ')}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/watch')}
                  className="mt-4"
                >
                  Ver outras partidas
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Info do espectador */}
          <Card variant="gradient" className="p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Eye size={16} />
              <span className="font-semibold text-sm">Modo Espectador</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Você está assistindo esta partida ao vivo. O tabuleiro é atualizado em tempo real conforme os jogadores fazem seus lances.
            </p>
          </Card>

          {/* Histórico de lances */}
          <MoveHistory moves={moves} />

          {/* Status da partida */}
          {!isGameOver && (
            <Card variant="gradient" className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-muted-foreground text-sm">
                  Vez das {game.current_turn === 'white' ? 'brancas' : 'pretas'}
                </span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}

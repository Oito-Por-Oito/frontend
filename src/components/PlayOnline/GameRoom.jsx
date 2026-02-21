import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Palette, RefreshCw, Play, Eye, X } from 'lucide-react';
import OnlineChessBoard from './OnlineChessBoard';
import PlayerInfoOnline from './PlayerInfoOnline';
import GameControls from './GameControls';
import MoveHistory from './MoveHistory';
import QuickChat from './QuickChat';
import ChatBubble from './ChatBubble';
import { useOnlineGame } from '@/hooks/useOnlineGame';
import { getRatingForTimeControl, getResultText } from '@/lib/gameHelpers';
import { useAuth } from '@/hooks/useAuth';
import { PieceThemeSelector, Button, Card } from '@/components/ui';

export default function GameRoom({ gameId, onLeaveGame, onRematchAccepted }) {
  const { profile } = useAuth();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const {
    game,
    chess,
    myColor,
    opponent,
    timeLeft,
    loading,
    error,
    moves,
    drawOffer,
    rematchOffer,
    rematchGameId,
    makeMove,
    resign,
    offerDraw,
    acceptDraw,
    declineDraw,
    cancelDraw,
    offerRematch,
    acceptRematch,
    declineRematch,
    cancelRematch,
    chatMessage,
    sendChatMessage,
    spectatorCount,
    isMyTurn,
    isGameOver,
  } = useOnlineGame(gameId);

  const lastMove = useMemo(() => {
    if (moves.length === 0) return null;
    const last = moves[moves.length - 1];
    return { from: last.from_square, to: last.to_square };
  }, [moves]);

  const myRating = game ? getRatingForTimeControl(profile, game.time_control) : 800;
  const opponentRating = game ? getRatingForTimeControl(opponent, game.time_control) : 800;
  const resultText = game && isGameOver
    ? getResultText(game.result, game.result_reason, myColor, game.winner_id, profile?.id)
    : null;

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
          <Button variant="outline" size="sm" onClick={onLeaveGame}>Voltar</Button>
        </div>
      </div>
    );
  }

  const isWin = game.winner_id === profile?.id;
  const isDraw = game.result === '1/2-1/2';

  const resultCardClass = isWin
    ? 'bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-600/50'
    : isDraw
    ? 'bg-surface-secondary border-surface-tertiary'
    : 'bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-600/50';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl mx-auto overflow-x-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onLeaveGame}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </button>
        <div className="flex items-center gap-3">
          {spectatorCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-surface-secondary px-2.5 py-1 rounded-full border border-gold/10">
              <Eye size={12} className="text-purple-400" />
              {spectatorCount}
            </span>
          )}
          <button
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="text-muted-foreground hover:text-gold transition-colors"
            title="Tema das peças"
          >
            <Palette size={18} />
          </button>
          <span className="text-xs text-muted-foreground bg-surface-secondary px-2.5 py-1 rounded-full border border-gold/10">
            {game.time_control}
          </span>
        </div>
      </div>

      {/* Seletor de tema */}
      {showThemeSelector && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card variant="gradient" className="mb-4 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-foreground font-semibold text-sm">Tema das Peças</h4>
              <button onClick={() => setShowThemeSelector(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <PieceThemeSelector compact />
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coluna do tabuleiro */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative">
            <ChatBubble
              chatMessage={chatMessage}
              opponentName={opponent?.display_name || opponent?.username || 'Oponente'}
            />
            <PlayerInfoOnline
              player={opponent}
              rating={opponentRating}
              timeLeft={myColor === 'white' ? timeLeft.black : timeLeft.white}
              isActive={!isMyTurn && !isGameOver}
              isMe={false}
            />
          </div>

          <OnlineChessBoard
            chess={chess}
            myColor={myColor}
            isMyTurn={isMyTurn}
            onMove={makeMove}
            lastMove={lastMove}
            disabled={isGameOver}
          />

          <PlayerInfoOnline
            player={profile}
            rating={myRating}
            timeLeft={myColor === 'white' ? timeLeft.white : timeLeft.black}
            isActive={isMyTurn && !isGameOver}
            isMe={true}
          />
        </div>

        {/* Coluna lateral */}
        <div className="space-y-3">
          {/* Resultado do jogo */}
          {isGameOver && resultText && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-5 rounded-2xl text-center border ${resultCardClass}`}
            >
              <div className="text-3xl sm:text-4xl mb-2">
                {isWin ? '🏆' : isDraw ? '🤝' : '😔'}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">{resultText}</h3>
              <p className="text-muted-foreground text-xs">{game.result}</p>

              {/* Oferta de rematch recebida */}
              {rematchOffer === 'received' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-surface-secondary rounded-xl border border-gold/40"
                >
                  <p className="text-foreground text-sm mb-2">
                    {opponent?.display_name || opponent?.username} quer revanche!
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="primary" size="sm" onClick={acceptRematch}>Aceitar</Button>
                    <Button variant="destructive" size="sm" onClick={declineRematch}>Recusar</Button>
                  </div>
                </motion.div>
              )}

              {/* Oferta de rematch enviada */}
              {rematchOffer === 'pending' && !rematchGameId && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-surface-secondary rounded-xl"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-2">
                    <div className="w-3.5 h-3.5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    Aguardando resposta...
                  </div>
                  <button
                    onClick={cancelRematch}
                    className="text-red-400 text-xs hover:text-red-300 transition-colors"
                  >
                    Cancelar oferta
                  </button>
                </motion.div>
              )}

              {/* Botões de ação */}
              <div className="flex gap-2 justify-center mt-4 flex-wrap">
                {rematchGameId && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onRematchAccepted?.(rematchGameId)}
                    className="flex items-center gap-2"
                  >
                    <Play size={16} />
                    Ir para Revanche
                  </Button>
                )}
                {!rematchOffer && !rematchGameId && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={offerRematch}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw size={16} />
                    Revanche
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={onLeaveGame}>
                  Nova partida
                </Button>
              </div>
            </motion.div>
          )}

          {/* Histórico de lances */}
          <MoveHistory moves={moves} />

          {/* Controles do jogo */}
          <GameControls
            onResign={resign}
            onOfferDraw={offerDraw}
            onAcceptDraw={acceptDraw}
            onDeclineDraw={declineDraw}
            onCancelDraw={cancelDraw}
            drawOffer={drawOffer}
            isGameOver={isGameOver}
          />

          {/* Chat rápido */}
          <QuickChat onSendMessage={sendChatMessage} disabled={false} />

          {/* Status da partida */}
          {!isGameOver && (
            <Card variant="gradient" className="p-4 space-y-3">
              <div className="text-center">
                {isMyTurn ? (
                  <p className="text-gold font-semibold text-sm">Sua vez de jogar</p>
                ) : (
                  <p className="text-muted-foreground text-sm">Aguardando lance do oponente...</p>
                )}
              </div>
              <div className="border-t border-gold/10 pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Palette size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Tema das Peças</span>
                </div>
                <PieceThemeSelector compact />
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, X, Minus, Palette, RefreshCw, Play, Eye, Users } from 'lucide-react';
import OnlineChessBoard from './OnlineChessBoard';
import PlayerInfoOnline from './PlayerInfoOnline';
import GameControls from './GameControls';
import MoveHistory from './MoveHistory';
import QuickChat from './QuickChat';
import ChatBubble from './ChatBubble';
import { useOnlineGame } from '@/hooks/useOnlineGame';
import { getRatingForTimeControl, getResultText } from '@/lib/gameHelpers';
import { useAuth } from '@/hooks/useAuth';
import { PieceThemeSelector } from '@/components/ui';


export default function GameRoom({ gameId, onLeaveGame, onRematchAccepted }) {
  const navigate = useNavigate();
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


  // Último lance para highlight
  const lastMove = useMemo(() => {
    if (moves.length === 0) return null;
    const last = moves[moves.length - 1];
    return { from: last.from_square, to: last.to_square };
  }, [moves]);

  // Ratings dos jogadores
  const myRating = game ? getRatingForTimeControl(profile, game.time_control) : 800;
  const opponentRating = game ? getRatingForTimeControl(opponent, game.time_control) : 800;

  // Texto do resultado
  const resultText = game && isGameOver ? 
    getResultText(game.result, game.result_reason, myColor, game.winner_id, profile?.id) : null;

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
            onClick={onLeaveGame}
            className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg"
          >
            Voltar
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
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onLeaveGame}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <div className="flex items-center gap-4">
          {/* Contagem de espectadores */}
          {spectatorCount > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-gray-400 bg-[#2a2a2a] px-2.5 py-1 rounded-full">
              <Eye size={14} className="text-purple-400" />
              {spectatorCount}
            </span>
          )}
          <button
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="flex items-center gap-2 text-gray-400 hover:text-[#c29d5d] transition-colors"
            title="Tema das peças"
          >
            <Palette size={20} />
          </button>
          <span className="text-sm text-gray-400">
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
          className="mb-4 p-4 bg-[#1e1e1e] rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold">Tema das Peças</h4>
            <button 
              onClick={() => setShowThemeSelector(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          <PieceThemeSelector compact />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coluna do tabuleiro */}
        <div className="lg:col-span-2 space-y-3">
          {/* Oponente (em cima) - com bubble de chat */}
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

          {/* Tabuleiro */}
          <OnlineChessBoard
            chess={chess}
            myColor={myColor}
            isMyTurn={isMyTurn}
            onMove={makeMove}
            lastMove={lastMove}
            disabled={isGameOver}
          />

          {/* Eu (embaixo) */}
          <PlayerInfoOnline
            player={profile}
            rating={myRating}
            timeLeft={myColor === 'white' ? timeLeft.white : timeLeft.black}
            isActive={isMyTurn && !isGameOver}
            isMe={true}
          />
        </div>

        {/* Coluna lateral */}
        <div className="space-y-4">
          {/* Resultado do jogo */}
          {isGameOver && resultText && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`
                p-6 rounded-xl text-center
                ${game.winner_id === profile?.id 
                  ? 'bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-600/50' 
                  : game.result === '1/2-1/2'
                    ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/50'
                    : 'bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-600/50'
                }
              `}
            >
              <div className="text-2xl sm:text-4xl mb-2">
                {game.winner_id === profile?.id ? '🏆' : game.result === '1/2-1/2' ? '🤝' : '😔'}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{resultText}</h3>
              <p className="text-gray-400 text-sm">{game.result}</p>
              
              {/* Oferta de rematch recebida */}
              {rematchOffer === 'received' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-[#2a2a2a] rounded-lg border border-[#c29d5d]"
                >
                  <p className="text-white text-sm mb-2">
                    {opponent?.display_name || opponent?.username} quer revanche!
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={acceptRematch} 
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Aceitar
                    </button>
                    <button 
                      onClick={declineRematch} 
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Recusar
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Oferta de rematch enviada (aguardando) */}
              {rematchOffer === 'pending' && !rematchGameId && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-[#2a2a2a] rounded-lg"
                >
                  <div className="flex items-center justify-center gap-2 text-gray-300 text-sm mb-2">
                    <div className="w-4 h-4 border-2 border-[#c29d5d] border-t-transparent rounded-full animate-spin" />
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
                {/* Botão de ir para rematch (quando aceito) */}
                {rematchGameId && (
                  <button
                    onClick={() => onRematchAccepted?.(rematchGameId)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Play size={18} />
                    Ir para Revanche
                  </button>
                )}
                
                {/* Botão de oferecer rematch (se não há oferta ainda) */}
                {!rematchOffer && !rematchGameId && (
                  <button
                    onClick={offerRematch}
                    className="px-4 py-2 bg-[#c29d5d] hover:bg-[#d4af6d] text-black font-semibold rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <RefreshCw size={18} />
                    Revanche
                  </button>
                )}
                
                <button
                  onClick={onLeaveGame}
                  className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg transition-colors"
                >
                  Nova partida
                </button>
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
          <QuickChat 
            onSendMessage={sendChatMessage} 
            disabled={false} 
          />

          {/* Status da partida com seletor de tema */}
          {!isGameOver && (
            <div className="bg-[#1e1e1e] rounded-xl p-4 space-y-4">
              <div className="text-center">
                {isMyTurn ? (
                  <p className="text-[#c29d5d] font-semibold">Sua vez de jogar</p>
                ) : (
                  <p className="text-gray-400">Aguardando lance do oponente...</p>
                )}
              </div>
              
              {/* Seletor de tema compacto */}
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <Palette size={16} />
                    Tema das Peças
                  </span>
                </div>
                <PieceThemeSelector compact />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trophy, Clock, Play, Eye } from 'lucide-react';
import { getRatingForTimeControl } from '@/lib/gameHelpers';

export default function GameHistoryCard({ game, profileId }) {
  const navigate = useNavigate();
  
  const isWhite = game.white_player_id === profileId;
  const myPlayer = isWhite ? game.white_player : game.black_player;
  const opponent = isWhite ? game.black_player : game.white_player;
  
  const isWinner = game.winner_id === profileId;
  const isDraw = game.result === '1/2-1/2';
  const isLoss = !isDraw && !isWinner;
  
  const myRating = getRatingForTimeControl(myPlayer, game.time_control);
  const opponentRating = getRatingForTimeControl(opponent, game.time_control);
  
  const resultText = isDraw ? 'Empate' : isWinner ? 'Vitória' : 'Derrota';
  const resultColor = isDraw ? 'text-muted-foreground' : isWinner ? 'text-green-400' : 'text-red-400';
  const resultBg = isDraw ? 'bg-gray-500/20' : isWinner ? 'bg-green-500/20' : 'bg-red-500/20';
  
  const formattedDate = game.ended_at 
    ? format(new Date(game.ended_at), "d 'de' MMM, HH:mm", { locale: ptBR })
    : 'Data desconhecida';

  const getResultReason = () => {
    switch (game.result_reason) {
      case 'checkmate': return 'Xeque-mate';
      case 'timeout': return 'Tempo';
      case 'resignation': return 'Desistência';
      case 'draw_agreement': return 'Acordo';
      case 'stalemate': return 'Afogamento';
      case 'insufficient_material': return 'Material insuficiente';
      case 'threefold_repetition': return 'Repetição tripla';
      case 'fifty_moves': return 'Regra 50 lances';
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-surface-secondary rounded-xl border border-gold/10 hover:border-gold/50 
                 transition-all duration-200 overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/history/${game.id}`)}
    >
      <div className="p-4">
        {/* Header: Result + Time Control */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${resultBg} ${resultColor}`}>
              {resultText}
            </span>
            {getResultReason() && (
              <span className="text-xs text-muted-foreground/60">
                ({getResultReason()})
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <Clock size={12} />
            {game.time_control}
          </div>
        </div>

        {/* Players */}
        <div className="space-y-2">
          {/* Opponent */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-tertiary border border-gold/10">
                {opponent?.avatar_url ? (
                  <img src={opponent.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm">👤</div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {opponent?.display_name || opponent?.username || 'Oponente'}
                </p>
                <p className="text-xs text-muted-foreground/60">
                  {isWhite ? '♜ Pretas' : '♔ Brancas'}
                </p>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{opponentRating}</span>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="flex-1 h-px bg-gray-700" />
            <span>vs</span>
            <span className="flex-1 h-px bg-gray-700" />
          </div>

          {/* Me */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-tertiary border-2 border-gold">
                {myPlayer?.avatar_url ? (
                  <img src={myPlayer.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm">👤</div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gold">
                  {myPlayer?.display_name || myPlayer?.username || 'Você'}
                </p>
                <p className="text-xs text-muted-foreground/60">
                  {isWhite ? '♔ Brancas' : '♜ Pretas'}
                </p>
              </div>
            </div>
            <span className="text-sm text-gold">{myRating}</span>
          </div>
        </div>

        {/* Footer: Date + Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gold/10/50">
          <span className="text-xs text-muted-foreground/60">{formattedDate}</span>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground 
                         bg-surface-tertiary rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/history/${game.id}`);
              }}
            >
              <Play size={12} />
              Replay
            </button>
            <button 
              className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-gold 
                         bg-surface-tertiary rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/history/${game.id}?analyze=true`);
              }}
            >
              <Eye size={12} />
              Analisar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

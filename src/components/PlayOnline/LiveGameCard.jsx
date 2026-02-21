import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Clock } from 'lucide-react';
import { getRatingForTimeControl } from '@/lib/gameHelpers';

function PlayerRow({ player, color }) {
  const displayName = player?.display_name || player?.username || 'Jogador';
  const avatarUrl = player?.avatar_url;

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className={`w-3.5 h-3.5 rounded-sm border shrink-0 ${
          color === 'white'
            ? 'bg-white border-gray-300'
            : 'bg-gray-900 border-gray-600'
        }`}
      />
      <div className="w-7 h-7 rounded-full overflow-hidden bg-surface-tertiary shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            👤
          </div>
        )}
      </div>
      <span className="text-foreground font-medium text-sm truncate">{displayName}</span>
    </div>
  );
}

export default function LiveGameCard({ game }) {
  const navigate = useNavigate();

  const whiteRating = getRatingForTimeControl(game.white_player, game.time_control);
  const blackRating = getRatingForTimeControl(game.black_player, game.time_control);

  const startedAt = game.started_at ? new Date(game.started_at) : null;
  const elapsedMinutes = startedAt ? Math.floor((Date.now() - startedAt.getTime()) / 60000) : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/watch/${game.id}`)}
      className="bg-surface-secondary rounded-xl p-4 cursor-pointer border border-gold/10
                 hover:border-gold/50 transition-all duration-200 shadow-lg hover:shadow-gold/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-xs text-red-400 font-semibold uppercase">Ao Vivo</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={11} />
          <span>{game.time_control}</span>
        </div>
      </div>

      {/* Jogadores */}
      <div className="space-y-2.5 mb-4">
        <div className="flex items-center justify-between gap-2">
          <PlayerRow player={game.white_player} color="white" />
          <span className="text-muted-foreground text-xs font-mono shrink-0">{whiteRating}</span>
        </div>
        <div className="text-center text-muted-foreground/40 text-xs">vs</div>
        <div className="flex items-center justify-between gap-2">
          <PlayerRow player={game.black_player} color="black" />
          <span className="text-muted-foreground text-xs font-mono shrink-0">{blackRating}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gold/10">
        <span className="text-xs text-muted-foreground">
          {elapsedMinutes > 0 ? `${elapsedMinutes} min` : 'Agora'}
        </span>
        <div className="flex items-center gap-1 text-gold text-sm font-medium">
          <Eye size={13} />
          <span>Assistir</span>
        </div>
      </div>
    </motion.div>
  );
}

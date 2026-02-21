import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Clock } from 'lucide-react';
import { getRatingForTimeControl } from '@/lib/gameHelpers';

function PlayerRow({ player, color }) {
  const displayName = player?.display_name || player?.username || 'Jogador';
  const avatarUrl = player?.avatar_url;

  return (
    <div className="flex items-center gap-3">
      {/* Indicador de cor */}
      <div 
        className={`w-4 h-4 rounded-sm border ${
          color === 'white' 
            ? 'bg-white border-gray-300' 
            : 'bg-gray-900 border-gray-600'
        }`} 
      />
      
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#333] flex-shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            👤
          </div>
        )}
      </div>

      {/* Nome e rating */}
      <div className="flex-1 min-w-0">
        <span className="text-white font-medium truncate block">{displayName}</span>
      </div>
    </div>
  );
}

export default function LiveGameCard({ game }) {
  const navigate = useNavigate();

  const whiteRating = getRatingForTimeControl(game.white_player, game.time_control);
  const blackRating = getRatingForTimeControl(game.black_player, game.time_control);

  // Calcular tempo decorrido
  const startedAt = game.started_at ? new Date(game.started_at) : null;
  const elapsedMinutes = startedAt ? Math.floor((Date.now() - startedAt.getTime()) / 60000) : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/watch/${game.id}`)}
      className="bg-[#1e1e1e] rounded-xl p-4 cursor-pointer border border-gray-700 hover:border-[#c29d5d] transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      {/* Header com indicador ao vivo */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-xs text-red-400 font-semibold uppercase">Ao Vivo</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={12} />
          <span>{game.time_control}</span>
        </div>
      </div>

      {/* Jogadores */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <PlayerRow player={game.white_player} color="white" />
          <span className="text-gray-400 text-sm font-mono">{whiteRating}</span>
        </div>
        
        <div className="text-center text-gray-600 text-xs">vs</div>
        
        <div className="flex items-center justify-between">
          <PlayerRow player={game.black_player} color="black" />
          <span className="text-gray-400 text-sm font-mono">{blackRating}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <span className="text-xs text-gray-500">
          {elapsedMinutes > 0 ? `${elapsedMinutes} min` : 'Agora'}
        </span>
        <div className="flex items-center gap-1 text-[#c29d5d] text-sm font-medium">
          <Eye size={14} />
          <span>Assistir</span>
        </div>
      </div>
    </motion.div>
  );
}

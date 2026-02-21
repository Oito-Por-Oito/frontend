import React from "react";
import GameTimer from "./GameTimer";

export default function PlayerInfo({ 
  avatar, 
  name, 
  rating, 
  flagUrl, 
  isBot = false,
  time,
  isActive = false
}) {
  const isEmoji = typeof avatar === 'string' && avatar.length <= 2;

  return (
    <div
      className={`
        flex items-center justify-between w-full 
        bg-surface-secondary/80 border rounded-xl px-4 py-3 shadow-md
        ${isActive ? 'border-gold' : 'border-surface-tertiary'}
        ${isBot ? "mb-2" : "mt-2"}
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        {isEmoji ? (
          <div className="w-10 h-10 rounded-full bg-surface-tertiary flex items-center justify-center text-2xl border border-gold/30">
            {avatar}
          </div>
        ) : (
          <img
            src={avatar}
            alt={isBot ? "Bot avatar" : "User avatar"}
            className="w-10 h-10 rounded-full object-cover border-2 border-gold/40"
            draggable={false}
          />
        )}
        
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground truncate text-base">
              {name}
            </span>
            {flagUrl && (
              <img
                src={flagUrl}
                alt="flag"
                className="w-5 h-3 object-cover rounded-sm border border-surface-tertiary"
                draggable={false}
              />
            )}
            {isBot && (
              <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">
                Bot
              </span>
            )}
          </div>
          {rating > 0 && (
            <span className="text-gold font-bold text-sm">{rating}</span>
          )}
        </div>
      </div>

      {time !== undefined && (
        <GameTimer 
          time={time} 
          isActive={isActive}
          variant="compact"
        />
      )}
    </div>
  );
}

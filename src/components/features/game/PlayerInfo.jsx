import React from "react";
import { Avatar } from "@/components/ui";

/**
 * PlayerInfo - Exibe informações do jogador (avatar, nome, rating, bandeira)
 * Componente unificado para todos os contextos de jogo
 */
export default function PlayerInfo({ 
  avatar, 
  name, 
  rating, 
  flagUrl, 
  flagAlt = "", 
  isBot = false,
  position = "bottom" // "top" | "bottom"
}) {
  return (
    <div
      className={`flex items-center justify-between w-full border border-gold bg-surface-secondary/70 rounded-xl px-3 py-2 shadow-md ${
        position === "top" ? "mb-1" : "mt-4"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Avatar 
          src={avatar} 
          alt={isBot ? "Bot avatar" : "User avatar"} 
          size="md"
        />
        <span className="flex items-center gap-1 font-semibold text-foreground truncate text-base md:text-lg">
          {name}
          {flagUrl ? (
            <img
              src={flagUrl}
              alt={flagAlt}
              className="w-5 h-4 object-cover rounded-sm border border-surface-tertiary bg-surface-secondary align-middle"
              title={flagAlt}
              draggable={false}
            />
          ) : (
            <span className="w-5 h-4 ml-1 bg-muted rounded-sm border border-surface-tertiary align-middle text-[10px] flex items-center justify-center text-muted-foreground px-1">
              --
            </span>
          )}
        </span>
      </div>
      <span className="font-bold text-gold text-base md:text-lg ml-2">
        {rating}
      </span>
    </div>
  );
}

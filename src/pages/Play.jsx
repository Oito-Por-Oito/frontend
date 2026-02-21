import React from "react";
import { PageLayout } from "@/components/layout";
import ChessBoardStatic from "@/components/PlayGame/ChessBoardStatic";
import PlaySidebarMenu from "@/components/PlayGame/PlaySidebarMenu";

const TOP_PLAYER = {
  name: "Gust",
  rating: 2200,
  avatar: "🤖",
  flag: "https://flagcdn.com/w20/us.png",
  isBot: true,
};

const BOTTOM_PLAYER = {
  name: "Você",
  rating: null,
  avatar: "👤",
  flag: null,
  isBot: false,
};

// Mesma largura do tabuleiro para os PlayerInfo ficarem alinhados
const BOARD_WIDTH_CLASSES =
  "w-[280px] sm:w-[340px] md:w-[400px] lg:w-[min(500px,calc(100vh-140px))]";

function StaticPlayerInfo({ player, position }) {
  const isTop = position === "top";
  return (
    <div
      className={`
        flex items-center justify-between
        ${BOARD_WIDTH_CLASSES}
        bg-surface-secondary/80 border border-surface-tertiary rounded-xl px-4 py-3 shadow-md
        ${isTop ? "mb-2" : "mt-2"}
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-surface-tertiary flex items-center justify-center text-2xl border border-gold/30 shrink-0">
          {player.avatar}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground truncate text-base">
              {player.name}
            </span>
            {player.flag && (
              <img
                src={player.flag}
                alt="flag"
                className="w-5 h-3 object-cover rounded-sm border border-surface-tertiary"
                draggable={false}
              />
            )}
            {player.isBot && (
              <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full shrink-0">
                Bot
              </span>
            )}
          </div>
          {player.rating && (
            <span className="text-gold font-bold text-sm">{player.rating}</span>
          )}
        </div>
      </div>
      <div className="w-2.5 h-2.5 rounded-full bg-surface-tertiary shrink-0" />
    </div>
  );
}

export default function Play() {
  return (
    <PageLayout showFooter={false}>
      {/* Desktop: viewport-locked, sem scroll. Mobile: scroll natural */}
      <div className="flex-1 lg:h-[calc(100vh-64px)] lg:overflow-hidden">
        <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-6 p-3 lg:p-4">

          {/* Coluna do Tabuleiro */}
          <div className="flex flex-col items-start shrink-0">
            <StaticPlayerInfo player={TOP_PLAYER} position="top" />
            <ChessBoardStatic />
            <StaticPlayerInfo player={BOTTOM_PLAYER} position="bottom" />
          </div>

          {/* Sidebar — Menu de modos de jogo */}
          <div className="w-full lg:w-auto shrink-0">
            <PlaySidebarMenu />
          </div>

        </div>
      </div>
    </PageLayout>
  );
}

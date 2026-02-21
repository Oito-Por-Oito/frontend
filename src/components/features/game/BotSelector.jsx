import React from "react";
import { Card, Button, Avatar } from "@/components/ui";

// Função para converter emoji de bandeira para código de país
function flagEmojiToCode(flag) {
  if (!flag) return '';
  const codePoints = Array.from(flag, c => c.codePointAt(0) - 0x1F1E6 + 0x61);
  return String.fromCharCode(...codePoints);
}

const getFlagUrl = (flag) => {
  const code = flagEmojiToCode(flag);
  return code ? `https://flagcdn.com/w40/${code}.png` : '';
};

const BOTS = [
  { name: "Jimmy", rating: 600, flag: "🇺🇸", message: "Thanks for playing chess with me. Good luck!" },
  { name: "Adaptive", bots: ["Bot 1", "Bot 2", "Bot 3"] },
  { name: "Beginner", count: 15 },
  { name: "Intermediate", count: 15 },
  { name: "Advanced", count: 20 },
  { name: "Master", count: 10 },
  { name: "Athletes", count: 12 },
];

/**
 * BotSelector - Sidebar para seleção de bot e nível
 */
export default function BotSelector({ 
  stockfishLevel, 
  setStockfishLevel, 
  onPlayClick, 
  gameStarted,
  bots = BOTS
}) {
  const handleRestart = () => window.location.reload();
  const featuredBot = bots[0];

  return (
    <Card variant="gradient" className="space-y-4 p-4" style={{ width: 335 }}>
      {/* Bot em destaque */}
      <div className="flex items-center gap-4 bg-surface-secondary/80 rounded-xl p-3 border border-gold/30 shadow">
        <Avatar 
          src={null} 
          fallback="🧑" 
          size="lg"
          className="border-2 border-gold/40"
        />
        <div>
          <div className="font-bold text-base text-gold-light">{featuredBot.name}</div>
          <div className="text-sm text-muted-foreground font-semibold flex items-center gap-1">
            {featuredBot.rating}
            {featuredBot.flag && (
              <img
                src={getFlagUrl(featuredBot.flag)}
                alt={featuredBot.flag}
                className="w-5 h-3 object-cover rounded-sm border border-surface-tertiary"
                draggable={false}
              />
            )}
          </div>
        </div>
      </div>

      {/* Nível do Stockfish */}
      <div className="flex flex-col gap-3 bg-surface-secondary/70 border border-gold/20 p-3 rounded-xl">
        <label className="text-gold-light font-semibold text-sm">Nível do Robô</label>
        <div className="flex items-center gap-2">
          <select
            className="rounded-lg p-2 bg-surface-primary text-foreground border border-gold/40 focus:ring-2 focus:ring-gold text-sm flex-1"
            value={stockfishLevel}
            onChange={(e) => setStockfishLevel(Number(e.target.value))}
            disabled={gameStarted}
          >
            {[...Array(21).keys()].map((n) => (
              <option key={n} value={n}>Nível {n}</option>
            ))}
          </select>
          <Button variant="destructive" size="sm" onClick={handleRestart}>
            Reiniciar
          </Button>
        </div>
      </div>

      {/* Lista de categorias de bots */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {bots.slice(1).map((bot, idx) => (
          <div 
            key={idx} 
            className="bg-surface-secondary/70 border border-gold/20 p-3 rounded-xl flex flex-col gap-1"
          >
            <div className="font-semibold text-foreground text-sm">{bot.name}</div>
            {bot.bots && (
              <div className="flex gap-2 mt-1">
                {bot.bots.map((b, i) => (
                  <span 
                    key={i} 
                    className="bg-surface-tertiary px-2 py-1 rounded text-xs text-muted-foreground"
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
            {bot.count && (
              <div className="text-muted-foreground text-xs">{bot.count} bots</div>
            )}
          </div>
        ))}
      </div>

      {/* Botão Play */}
      <Button 
        variant="primary" 
        size="lg" 
        className="w-full"
        onClick={onPlayClick}
        disabled={gameStarted}
      >
        ▶ Play
      </Button>
    </Card>
  );
}

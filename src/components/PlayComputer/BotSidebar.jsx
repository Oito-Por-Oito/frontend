import React from "react";
import BotCard from "./BotCard";
import { PieceThemeSelector } from "@/components/ui";
// Função para converter emoji de bandeira para código de país (ex: 🇺🇸 -> us)
function flagEmojiToCode(flag) {
  if (!flag) return '';
  // Unicode offset for regional indicator symbols
  const codePoints = Array.from(flag, c => c.codePointAt(0) - 0x1F1E6 + 0x61);
  return String.fromCharCode(...codePoints);
}

const getFlagUrl = (flag) => {
  const code = flagEmojiToCode(flag);
  return code ? `https://flagcdn.com/w40/${code}.png` : '';
};

const bots = [
  { name: "Jimmy", rating: 600, flag: "🇺🇸", message: "Thanks for playing chess with me. Good luck!" },
  { name: "Adaptive", bots: ["Bot 1", "Bot 2", "Bot 3"] },
  { name: "Beginner", count: 15 },
  { name: "Intermediate", count: 15 },
  { name: "Advanced", count: 20 },
  { name: "Master", count: 10 },
  { name: "Athletes", count: 12 },
];

export default function BotSidebar({ stockfishLevel, setStockfishLevel, onPlayClick, gameStarted }) {
  // Função para reiniciar a página
  const handleRestart = () => window.location.reload();

  return (
    <div className="space-y-6 text-sm bg-surface-secondary rounded-2xl border border-gold/30 p-4 shadow-xl -mt-8" style={{ maxWidth: 335, minWidth: 335, width: 335, maxHeight: 824, minHeight: 824, height: 824 }}>
      {/* Destaque principal */}
      <div className="flex items-center gap-4 bg-surface-secondary/80 rounded-xl p-3 border border-gold/30 shadow">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-gold/40 overflow-hidden">
          <span className="text-black text-2xl font-bold">🧑</span>
        </div>
        <div>
          <div className="font-bold text-base text-gold">{bots[0].name}</div>
          <div className="text-sm text-gray-300 font-semibold">{bots[0].rating} {bots[0].flag && (
            <img
              src={getFlagUrl(bots[0].flag)}
              alt={bots[0].flag}
              className="inline-block w-5 h-3 ml-1 object-cover rounded-sm border border-surface-tertiary bg-surface-secondary align-middle"
              title={bots[0].flag}
              draggable={false}
            />
          )}</div>
        </div>
      </div>

      {/* Nível do Stockfish e Reiniciar */}
      <div className="flex flex-col gap-3 bg-surface-secondary/70 border border-gold/20 p-3 rounded-xl shadow">
        <label className="text-gold font-semibold text-sm">Nível do Robô</label>
        <div className="flex items-center gap-2">
          <select
            className="rounded p-1 bg-surface-primary text-foreground border border-gold/40 focus:ring-2 focus:ring-gold text-sm"
            value={stockfishLevel}
            onChange={(e) => setStockfishLevel(Number(e.target.value))}
            disabled={gameStarted}
          >
            {[...Array(21).keys()].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button
            onClick={handleRestart}
            className="px-3 py-1.5 bg-red-500 text-foreground rounded font-semibold text-sm hover:bg-red-600 transition-all duration-150 ml-2"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* Seletor de Tema das Peças */}
      <div className="bg-surface-secondary/70 border border-gold/20 p-3 rounded-xl shadow">
        <label className="text-gold font-semibold text-sm block mb-2">Tema das Peças</label>
        <PieceThemeSelector compact />
      </div>

      {/* Lista de categorias */}
      <div className="space-y-3">
        {bots.slice(1).map((bot, idx) => (
          <div key={idx} className="bg-surface-secondary/70 border border-gold/20 p-3 rounded-xl shadow flex flex-col gap-2">
            <div className="font-semibold text-foreground text-sm">{bot.name}</div>
            {bot.bots && (
              <div className="flex gap-2 mt-1">
                {bot.bots.map((b, i) => (
                  <BotCard key={i} name={b} />
                ))}
              </div>
            )}
            {bot.count && (
              <div className="text-gray-400 text-xs font-semibold">{bot.count} bots</div>
            )}
          </div>
        ))}
      </div>

      <button
        className="w-full mt-2 bg-gradient-to-r from-gold to-gold-dark text-black py-2 rounded-xl text-lg font-bold shadow-lg hover:from-gold-light hover:to-gold hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold"
        onClick={onPlayClick}
        disabled={gameStarted}
      >
        ▶ Play
      </button>
    </div>
  );
}

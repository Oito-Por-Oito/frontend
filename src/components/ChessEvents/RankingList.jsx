import React, { useState } from "react";
import chessData from "../../data/chessData";

const MODES = ["Standard", "Rapid", "Blitz"];
const CATEGORIES = ["Open", "Women", "Juniors"];

const getFlagUrl = (countryCode) =>
  `https://flagcdn.com/w40/${countryCode?.toLowerCase()}.png`;

export default function RankingList() {
  const [mode, setMode] = useState(MODES[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);

  const players =
    Array.isArray(chessData?.[mode]?.[category]) && chessData[mode][category].length > 0
      ? chessData[mode][category]
      : [];

  return (
    <div className="bg-[#181818]/90 border border-[#c29d5d]/20 shadow-lg p-4 sm:p-6 rounded-2xl">
      <h2 className="text-xl font-bold mb-4 text-[#c29d5d]">Top Chess Players</h2>

      {/* Filtros de modalidade */}
      <div className="flex flex-wrap gap-2 mb-4">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={
              mode === m
                ? "bg-[#d4af37] text-black px-3 py-1 rounded-full text-sm"
                : "bg-[#2c2c2c] border border-[#444] px-3 py-1 rounded-full text-sm"
            }
          >
            {m}
          </button>
        ))}
      </div>

      {/* Filtros de categoria */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={
              category === cat
                ? "bg-[#444] text-sm px-3 py-1 rounded-full border border-[#d4af37] text-[#d4af37]"
                : "bg-[#444] text-sm px-3 py-1 rounded-full"
            }
          >
            Top {cat}
          </button>
        ))}
      </div>

      {/* Lista de jogadores */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[200px]">
          <thead>
            <tr className="text-left text-[#d4af37]">
              <th className="py-1 px-1">#</th>
              <th className="py-1 px-1">Jogador</th>
              <th className="py-1 px-1 text-right">Rating</th>
            </tr>
          </thead>
          <tbody>
            {players.length > 0 ? (
              players.slice(0, 10).map((player, idx) => (
                <tr key={player.name}>
                  <td className="py-1 px-1 font-bold text-[#d4af37]">{idx + 1}</td>
                  <td className="py-1 px-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={getFlagUrl(player.country)}
                        alt={player.country}
                        className="w-5 h-3 object-cover rounded-sm border border-[#444] bg-[#232526] flex-shrink-0"
                      />
                      <span className="text-white font-semibold truncate">{player.name}</span>
                    </div>
                  </td>
                  <td className="py-1 px-1 text-right font-bold text-[#d4af37]">
                    {player.rating}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-400">
                  Sem dados para esta modalidade/categoria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

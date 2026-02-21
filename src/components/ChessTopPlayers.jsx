import React, { useState, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import chessData from "../data/chessData";
import { Button } from '@/components/ui';

const MODES = ["Standard", "Rapid", "Blitz"];
const CATEGORIES = ["Open", "Women", "Juniors"];

const getFlagUrl = (countryCode) =>
  `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

const ChessTopPlayers = memo(() => {
  const [mode, setMode] = useState("Standard");
  const [category, setCategory] = useState("Open");
  const navigate = useNavigate();

  // Memoize filtered players to prevent recalculation on re-renders
  const filteredPlayers = useMemo(() => {
    return chessData?.[mode]?.[category]?.slice(0, 10) || [];
  }, [mode, category]);

  // Stable callbacks for button handlers
  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
  }, []);

  const handleCategoryChange = useCallback((newCategory) => {
    setCategory(newCategory);
  }, []);

  const handleSeeMore = useCallback(() => {
    navigate("/ratings-players");
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="text-white"
    >
      <h2 className="text-xl font-bold mb-4">Top Chess Players</h2>

      {/* Mode Buttons */}
      <div className="flex gap-2 mb-4">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={
              mode === m
                ? "bg-gold text-black px-4 py-1 rounded-full text-sm font-medium"
                : "bg-surface-tertiary border border-surface-tertiary px-4 py-1 rounded-full text-sm hover:border-gold/50 transition-colors"
            }
          >
            {m}
          </button>
        ))}
      </div>

      {/* Category Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={
              category === cat
                ? "bg-surface-tertiary text-sm px-3 py-1 rounded-full border border-gold text-gold font-medium"
                : "bg-surface-tertiary text-sm px-3 py-1 rounded-full hover:border-gold/50 border border-transparent transition-colors"
            }
          >
            Top {cat}
          </button>
        ))}
      </div>

      {/* Players Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gold">
            <th>#</th>
            <th>Jogador</th>
            <th className="text-right">Rating</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player, idx) => (
              <tr key={player.name}>
                <td className="py-1 px-2 font-bold text-gold">{idx + 1}</td>
                <td className="py-1 px-2 flex items-center gap-2">
                  <img
                    src={getFlagUrl(player.country)}
                    alt={player.country}
                    loading="lazy"
                    className="w-6 h-4 object-cover rounded-sm border border-surface-tertiary bg-surface-secondary"
                  />
                  <span className="text-white font-semibold">{player.name}</span>
                </td>
                <td className="py-1 px-2 text-right font-bold text-gold">
                  {player.rating}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-6 text-center text-text-muted">
                Sem dados para esta modalidade/categoria.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* See More */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSeeMore}
          className="text-gold font-semibold px-4 rounded hover:underline focus:outline-none bg-transparent border-none"
        >
          See more
        </button>
      </div>
    </motion.div>
  );
});

ChessTopPlayers.displayName = 'ChessTopPlayers';

export default ChessTopPlayers;

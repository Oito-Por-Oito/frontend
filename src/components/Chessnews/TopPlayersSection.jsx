import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "@/components/ui";
import chessData from "../../data/chessData";

const MODES = ["Standard", "Rapid", "Blitz"];
const CATEGORIES = ["Open", "Women", "Juniors"];
const getFlagUrl = (countryCode) =>
  `https://flagcdn.com/w40/${countryCode?.toLowerCase()}.png`;

export default function TopPlayersSection() {
  const [mode, setMode] = useState("Standard");
  const [category, setCategory] = useState("Open");
  const navigate = useNavigate();

  return (
    <Card variant="gradient">
      <h4 className="text-lg font-bold mb-4 text-gold">Top Players</h4>

      <div className="flex gap-2 mb-4 flex-wrap">
        {MODES.map((m) => (
          <Button
            key={m}
            variant={mode === m ? "primary" : "secondary"}
            size="sm"
            onClick={() => setMode(m)}
          >
            {m}
          </Button>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? "outline" : "ghost"}
            size="sm"
            onClick={() => setCategory(cat)}
          >
            Top {cat}
          </Button>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gold">
            <th>#</th>
            <th>Jogador</th>
            <th className="text-right">Rating</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(chessData?.[mode]?.[category]) && chessData[mode][category].length > 0 ? (
            chessData[mode][category].slice(0, 10).map((player, idx) => (
              <tr key={player.name} className="hover:bg-surface-secondary/50">
                <td className="py-1 px-2 font-bold text-gold">{idx + 1}</td>
                <td className="py-1 px-2 flex items-center gap-2">
                  <img
                    src={getFlagUrl(player.country)}
                    alt={player.country}
                    className="w-6 h-4 object-cover rounded-sm border border-surface-tertiary bg-surface-secondary"
                  />
                  <span className="text-foreground font-semibold">{player.name}</span>
                </td>
                <td className="py-1 px-2 text-right font-bold text-gold">
                  {player.rating}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-6 text-center text-muted-foreground">
                Sem dados para esta modalidade/categoria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <Button variant="ghost" onClick={() => navigate("/ratings-players")}>
          See more
        </Button>
      </div>
    </Card>
  );
}

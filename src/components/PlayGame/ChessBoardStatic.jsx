import React from "react";
import { useSettings } from "@/contexts/SettingsContext";

const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const PIECE_EMOJI = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

function parseFen(fen) {
  const rows = fen.split("/");
  return rows.map((row) => {
    const cells = [];
    for (const char of row) {
      if (/\d/.test(char)) {
        for (let i = 0; i < parseInt(char); i++) cells.push(null);
      } else {
        cells.push(char);
      }
    }
    return cells;
  });
}

export default function ChessBoardStatic() {
  const { boardThemeConfig } = useSettings?.() || {};
  const lightColor = boardThemeConfig?.light || "#f0d9b5";
  const darkColor  = boardThemeConfig?.dark  || "#b58863";
  const board = parseFen(INITIAL_FEN);

  return (
    <div className="flex items-start">
      {/* Notação vertical (ranks) — à esquerda */}
      <div className="flex flex-col justify-around h-[280px] sm:h-[340px] md:h-[400px] lg:h-[min(500px,calc(100vh-140px))] mr-1">
        {RANKS.map((rank) => (
          <div
            key={rank}
            className="flex items-center justify-center text-[10px] text-muted-foreground font-medium w-3"
          >
            {rank}
          </div>
        ))}
      </div>

      {/* Tabuleiro + notação horizontal */}
      <div className="flex flex-col">
        {/* Tabuleiro — mesmo tamanho exato do ChessBoardGame */}
        <div
          className="
            grid grid-cols-8
            w-[280px] sm:w-[340px] md:w-[400px] lg:w-[min(500px,calc(100vh-140px))]
            aspect-square
            border-4 border-gold rounded-2xl shadow-2xl overflow-hidden
          "
        >
          {board.map((row, rankIdx) =>
            row.map((piece, fileIdx) => {
              const isLight = (fileIdx + rankIdx) % 2 === 0;
              return (
                <div
                  key={`${rankIdx}-${fileIdx}`}
                  style={{ backgroundColor: isLight ? lightColor : darkColor }}
                  className="aspect-square flex items-center justify-center select-none"
                >
                  {piece && (
                    <span
                      className="text-base sm:text-xl md:text-2xl drop-shadow-md leading-none"
                      style={{
                        color: piece === piece.toUpperCase() ? "#fff" : "#1a1a1a",
                        textShadow: piece === piece.toUpperCase()
                          ? "0 1px 3px rgba(0,0,0,0.9)"
                          : "0 1px 2px rgba(255,255,255,0.5)",
                      }}
                    >
                      {PIECE_EMOJI[piece] || piece}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Notação horizontal (files) — abaixo */}
        <div className="grid grid-cols-8 mt-1 w-[280px] sm:w-[340px] md:w-[400px] lg:w-[min(500px,calc(100vh-140px))]">
          {FILES.map((file) => (
            <div
              key={file}
              className="text-center text-[10px] text-muted-foreground font-medium"
            >
              {file}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

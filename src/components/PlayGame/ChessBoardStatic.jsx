import React from "react";
import { useSettings } from "@/contexts/SettingsContext";

// Posição inicial padrão do xadrez em FEN
const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

// Mapa de peças FEN para emoji
const PIECE_EMOJI = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

function parseFen(fen) {
  const rows = fen.split("/");
  const board = [];
  for (const row of rows) {
    const cells = [];
    for (const char of row) {
      if (/\d/.test(char)) {
        for (let i = 0; i < parseInt(char); i++) cells.push(null);
      } else {
        cells.push(char);
      }
    }
    board.push(cells);
  }
  return board;
}

export default function ChessBoardStatic() {
  const { boardThemeConfig } = useSettings?.() || {};
  const lightColor = boardThemeConfig?.light || "#f0d9b5";
  const darkColor = boardThemeConfig?.dark || "#b58863";

  const board = parseFen(INITIAL_FEN);

  return (
    <div className="relative my-2">
      <div className="grid grid-cols-8 w-full max-w-[300px] sm:max-w-[380px] md:max-w-[480px] lg:max-w-[min(480px,calc(100vh-220px))] aspect-square border-4 border-gold rounded-2xl shadow-2xl overflow-hidden">
        {board.map((row, rankIdx) =>
          row.map((piece, fileIdx) => {
            const isLight = (fileIdx + rankIdx) % 2 === 0;
            return (
              <div
                key={`${rankIdx}-${fileIdx}`}
                style={{ backgroundColor: isLight ? lightColor : darkColor }}
                className="aspect-square flex items-center justify-center select-none text-lg sm:text-xl md:text-2xl"
              >
                {piece && (
                  <span
                    className="drop-shadow-md"
                    style={{
                      color: piece === piece.toUpperCase() ? "#fff" : "#1a1a1a",
                      textShadow: piece === piece.toUpperCase()
                        ? "0 1px 2px rgba(0,0,0,0.8)"
                        : "0 1px 2px rgba(255,255,255,0.4)",
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

      {/* Notação horizontal A-H */}
      <div className="absolute bottom-[-22px] left-0 w-full grid grid-cols-8 text-center text-xs text-muted-foreground font-medium">
        {"abcdefgh".split("").map((letter) => (
          <div key={letter}>{letter.toUpperCase()}</div>
        ))}
      </div>

      {/* Notação vertical 8-1 */}
      <div className="absolute top-0 left-[-18px] h-full grid grid-rows-8 text-xs text-muted-foreground font-medium">
        {[8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
          <div key={num} className="flex items-center justify-center h-full">
            {num}
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { Chess } from "chess.js";

function DailyPuzzleBoard({ fen = "r1bqkbnr/ppp2ppp/2np4/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4" }) {
  // Criar instância do jogo a partir do FEN fornecido
  const game = new Chess(fen);
  const board = game.board();

  // Mapeia as peças para suas imagens
  const pieceMap = {
    bK: "bK.png",
    bQ: "bQ.png",
    bR: "bR.png",
    bN: "bN.png",
    bB: "bB.png",
    bP: "bP.png",
    wK: "wK.png",
    wQ: "wQ.png",
    wR: "wR.png",
    wN: "wN.png",
    wB: "wB.png",
    wP: "wP.png",
  };

  // Função para obter a imagem da peça
  const getPieceImage = (piece, coord) => {
    if (!piece) return null;
    const key = (piece.color === "w" ? "w" : "b") + piece.type.toUpperCase();
    const img = pieceMap[key];
    if (!img) return null;
    return (
      <img
        key={coord + "-" + key}
        src={`/assets/pieces/${img}`}
        alt={key}
        className="w-4 h-4 md:w-6 md:h-6 pointer-events-none select-none"
        draggable={false}
      />
    );
  };

  // Renderiza o tabuleiro
  const renderBoard = () => {
    return (
      <div className="grid grid-cols-8 w-full border-2 border-[#c29d5d] rounded-lg shadow-md overflow-hidden">
        {board.flat().map((square, idx) => {
          const x = idx % 8;
          const y = Math.floor(idx / 8);
          const isLight = (x + (8 - y)) % 2 === 0;
          const coord = "abcdefgh"[x] + (8 - y);

          return (
            <div
              key={coord}
              className={`aspect-square relative flex items-center justify-center
                ${isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]"}
              `}
            >
              {getPieceImage(square, coord)}
            </div>
          );
        })}
      </div>
    );
  };

  return <div className="w-full">{renderBoard()}</div>;
}

export default DailyPuzzleBoard;

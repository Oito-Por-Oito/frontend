import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ChessBoardWithCTA() {
  const pieceMap = {
    bK: "bK.png", bQ: "bQ.png", bR: "bR.png", bN: "bN.png", bB: "bB.png", bP: "bP.png",
    wK: "wK.png", wQ: "wQ.png", wR: "wR.png", wN: "wN.png", wB: "wB.png", wP: "wP.png",
  };

  // Simulações de jogadas (estado do tabuleiro em diferentes momentos)
  const moves = [
    {
      0: ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
      1: ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
      6: ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
      7: ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
    },
    {
      0: ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
      1: ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
      4: [null, null, null, null, "wP"],
      6: ["wP", "wP", "wP", "wP", null, "wP", "wP", "wP"],
      7: ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
    },
    {
      0: ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
      2: [null, null, null, null, "bP"],
      1: ["bP", "bP", "bP", "bP", null, "bP", "bP", "bP"],
      4: [null, null, null, null, "wP"],
      6: ["wP", "wP", "wP", "wP", null, "wP", "wP", "wP"],
      7: ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
    }
  ];

  const [boardIndex, setBoardIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBoardIndex((prev) => (prev + 1) % moves.length);
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  const piecePositions = moves[boardIndex];

  return (
    <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-8">
      {/* TABULEIRO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="grid grid-cols-8 grid-rows-8 w-full max-w-[480px] aspect-square border-2 border-white rounded overflow-hidden"
      >
        {Array.from({ length: 64 }, (_, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const isLight = (row + col) % 2 === 0;
          const piece = piecePositions[row]?.[col] || "";

          return (
            <div
              key={i}
              className={`w-full h-full flex items-center justify-center ${isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]"}`}
            >
              <AnimatePresence>
                {piece && (
                  <motion.img
                    key={piece + i}
                    src={`/assets/pieces/${pieceMap[piece]}`}
                    alt={piece}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 pointer-events-none"
                    draggable={false}
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-[380px] bg-[#1e1e1e] p-6 md:p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Play Chess Online</h1>
        <h2 className="text-2xl font-semibold mb-4">on the #1 Site!</h2>
        <div className="text-sm mb-6 text-gray-400">
          <span className="font-bold text-white">18,867,311</span> Games Today <br />
          <span className="font-bold text-white">136,285</span> Playing Now
        </div>
        <Link
          to="/play"
          className="w-full bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black py-2.5 rounded-xl text-lg font-bold mb-3 shadow-lg hover:from-[#ffe7b3] hover:to-[#e7c27d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d] flex items-center justify-center text-center"
        >
          ▶ Play Online
        </Link>
        <Link
          to="/play-computer"
          className="w-full bg-gradient-to-r from-[#232526] to-[#2d2d2d] text-white py-2.5 rounded-xl text-lg font-bold shadow-lg border-2 border-[#c29d5d]/50 hover:from-[#444] hover:to-[#232526] hover:text-[#c29d5d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d] flex items-center justify-center text-center"
        >
          🤖 Play Computer
        </Link>
      </motion.section>
    </div>
  );
}

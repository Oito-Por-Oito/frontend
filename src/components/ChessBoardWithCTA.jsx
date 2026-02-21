import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card } from '@/components/ui';

// Move static data outside component to prevent recreation
const pieceMap = {
  bK: "bK.png", bQ: "bQ.png", bR: "bR.png", bN: "bN.png", bB: "bB.png", bP: "bP.png",
  wK: "wK.png", wQ: "wQ.png", wR: "wR.png", wN: "wN.png", wB: "wB.png", wP: "wP.png",
};

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

const ChessBoardWithCTA = memo(() => {
  const [boardIndex, setBoardIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBoardIndex((prev) => (prev + 1) % moves.length);
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  // Preload Stockfish worker on hover for faster game start
  const preloadStockfish = useCallback(() => {
    try {
      const worker = new Worker('/stockfish/stockfishWorker.js');
      worker.postMessage('uci');
      // Terminate after warmup
      setTimeout(() => worker.terminate(), 2000);
    } catch (e) {
      // Silently fail if worker can't be created
    }
  }, []);

  const piecePositions = moves[boardIndex];

  // Memoize board squares to prevent recalculation
  const boardSquares = useMemo(() => {
    return Array.from({ length: 64 }, (_, i) => {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const isLight = (row + col) % 2 === 0;
      const piece = piecePositions[row]?.[col] || "";
      return { i, row, col, isLight, piece };
    });
  }, [piecePositions]);

  return (
    <div className="w-full max-w-[900px] flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-0">
      {/* Chess Board - Responsivo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="grid grid-cols-8 grid-rows-8 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] 
                   aspect-square border-2 border-gold/50 rounded-lg overflow-hidden shadow-lg"
      >
        {boardSquares.map(({ i, isLight, piece }) => (
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
                  initial={{ y: -15, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 15, opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    opacity: { duration: 0.25 }
                  }}
                  className="w-[75%] h-[75%] sm:w-[80%] sm:h-[80%] object-contain pointer-events-none
                             drop-shadow-[2px_3px_3px_rgba(0,0,0,0.4)]"
                  draggable={false}
                  loading="lazy"
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>

      {/* CTA Section - Responsivo */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] 
                   bg-surface-card p-5 sm:p-6 md:p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Play Chess Online</h1>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-gold-light">on the #1 Site!</h2>
        <div className="text-xs sm:text-sm mb-4 sm:mb-6 text-text-muted">
          <span className="font-bold text-white">18,867,311</span> Games Today <br />
          <span className="font-bold text-white">136,285</span> Playing Now
        </div>
        <div className="flex flex-col gap-2 sm:gap-3">
          <Link to="/play">
            <Button variant="primary" size="lg" className="w-full text-sm sm:text-base">
              ▶ Play Online
            </Button>
          </Link>
          <Link to="/play-computer" onMouseEnter={preloadStockfish}>
            <Button variant="secondary" size="lg" className="w-full text-sm sm:text-base">
              🤖 Play Computer
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
});

ChessBoardWithCTA.displayName = 'ChessBoardWithCTA';

export default ChessBoardWithCTA;

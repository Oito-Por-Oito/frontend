import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/contexts/SettingsContext';
import ThemedChessPiece from '@/components/ui/ThemedChessPiece';

// Default board colors
const LIGHT_SQUARE = '#f0d9b5';
const DARK_SQUARE = '#b58863';
const HIGHLIGHT_FROM = 'rgba(255, 255, 100, 0.5)';
const HIGHLIGHT_TO = 'rgba(255, 255, 100, 0.7)';

// Converte caractere FEN ('K', 'p', etc.) para objeto { type, color }
const charToPieceObject = (char) => {
  if (!char) return null;
  const isWhite = char === char.toUpperCase();
  return {
    type: char.toLowerCase(),
    color: isWhite ? 'w' : 'b'
  };
};

export default function ReplayBoard({ 
  fen, 
  lastMoveSquares, 
  orientation = 'white',
  size = 'auto'
}) {
  const { boardTheme } = useSettings();

  // Parse FEN to get piece positions
  const board = useMemo(() => {
    const rows = fen.split(' ')[0].split('/');
    const result = [];
    
    for (let row = 0; row < 8; row++) {
      result[row] = [];
      let col = 0;
      
      for (const char of rows[row]) {
        if (/\d/.test(char)) {
          const emptyCount = parseInt(char);
          for (let i = 0; i < emptyCount; i++) {
            result[row][col++] = null;
          }
        } else {
          result[row][col++] = char;
        }
      }
    }
    
    return result;
  }, [fen]);

  const getSquareColor = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    
    if (boardTheme === 'green') {
      return isLight ? '#EEEED2' : '#769656';
    }
    if (boardTheme === 'blue') {
      return isLight ? '#DEE3E6' : '#8CA2AD';
    }
    if (boardTheme === 'purple') {
      return isLight ? '#E8E0F0' : '#9070A0';
    }
    
    return isLight ? LIGHT_SQUARE : DARK_SQUARE;
  };

  const getSquareName = (row, col) => {
    const file = String.fromCharCode(97 + col); // a-h
    const rank = 8 - row; // 1-8
    return `${file}${rank}`;
  };

  const isHighlighted = (row, col) => {
    if (!lastMoveSquares) return false;
    const square = getSquareName(row, col);
    return lastMoveSquares.includes(square);
  };

  // Flip board for black orientation
  const displayBoard = orientation === 'black' 
    ? board.map(row => [...row].reverse()).reverse()
    : board;

  const getDisplayCoords = (row, col) => {
    if (orientation === 'black') {
      return { row: 7 - row, col: 7 - col };
    }
    return { row, col };
  };

  return (
    <div className="relative aspect-square w-full max-w-lg mx-auto select-none">
      <div className="grid grid-cols-8 w-full h-full rounded-lg overflow-hidden shadow-xl border-2 border-gold/30">
        {displayBoard.map((row, rowIdx) =>
          row.map((piece, colIdx) => {
            const { row: actualRow, col: actualCol } = getDisplayCoords(rowIdx, colIdx);
            const squareColor = getSquareColor(actualRow, actualCol);
            const highlighted = isHighlighted(actualRow, actualCol);
            const squareName = getSquareName(actualRow, actualCol);

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className="relative aspect-square flex items-center justify-center"
                style={{
                  backgroundColor: highlighted 
                    ? (lastMoveSquares?.[0] === squareName ? HIGHLIGHT_FROM : HIGHLIGHT_TO)
                    : squareColor,
                }}
              >
                {/* Coordinate labels */}
                {colIdx === 0 && (
                  <span
                    className="absolute top-0.5 left-0.5 text-[10px] font-semibold pointer-events-none opacity-60"
                    style={{ color: (actualRow + actualCol) % 2 === 0 ? DARK_SQUARE : LIGHT_SQUARE }}
                  >
                    {orientation === 'black' ? actualRow + 1 : 8 - rowIdx}
                  </span>
                )}
                {rowIdx === 7 && (
                  <span
                    className="absolute bottom-0.5 right-0.5 text-[10px] font-semibold pointer-events-none opacity-60"
                    style={{ color: (actualRow + actualCol) % 2 === 0 ? DARK_SQUARE : LIGHT_SQUARE }}
                  >
                    {String.fromCharCode(97 + (orientation === 'black' ? 7 - colIdx : colIdx))}
                  </span>
                )}

                {/* Piece */}
                {piece && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="w-[85%] h-[85%] flex items-center justify-center"
                  >
                    <ThemedChessPiece 
                      piece={charToPieceObject(piece)} 
                      className="w-full h-full drop-shadow-md"
                    />
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

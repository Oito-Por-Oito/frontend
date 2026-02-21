import React, { useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemedChessPiece } from '@/components/ui';
import ThemedPromotionPicker from './ThemedPromotionPicker';
import { useSettings } from '@/contexts/SettingsContext';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export default function OnlineChessBoard({ 
  chess, 
  myColor, 
  isMyTurn, 
  onMove, 
  lastMove,
  disabled = false 
}) {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [promotionPending, setPromotionPending] = useState(null);

  // Obter cores do tabuleiro do contexto
  const { boardThemeConfig } = useSettings();

  // Orientação do tabuleiro
  const isFlipped = myColor === 'black';
  const displayFiles = isFlipped ? [...FILES].reverse() : FILES;
  const displayRanks = isFlipped ? [...RANKS].reverse() : RANKS;

  // Obter peça em uma casa
  const getPiece = useCallback((square) => {
    const piece = chess.get(square);
    return piece ? { type: piece.type, color: piece.color } : null;
  }, [chess]);

  // Obter lances válidos para uma casa
  const getValidMovesForSquare = useCallback((square) => {
    if (!chess || disabled || !isMyTurn) return [];
    const moves = chess.moves({ square, verbose: true });
    return moves.map(m => m.to);
  }, [chess, disabled, isMyTurn]);

  // Verificar se está em xeque
  const inCheck = useMemo(() => {
    if (!chess) return null;
    if (!chess.inCheck()) return null;
    
    // Encontrar posição do rei
    const board = chess.board();
    const turn = chess.turn();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece && piece.type === 'k' && piece.color === turn) {
          return FILES[j] + RANKS[i];
        }
      }
    }
    return null;
  }, [chess]);

  // Clicar em uma casa
  const handleSquareClick = (square) => {
    if (disabled || !isMyTurn) return;

    const piece = getPiece(square);

    // Se já tem uma peça selecionada
    if (selectedSquare) {
      // Clicou na mesma casa - desselecionar
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      // Clicou em uma casa válida - fazer o lance
      if (validMoves.includes(square)) {
        // Verificar se é promoção
        const movingPiece = getPiece(selectedSquare);
        if (
          movingPiece?.type === 'p' &&
          ((movingPiece.color === 'w' && square[1] === '8') ||
           (movingPiece.color === 'b' && square[1] === '1'))
        ) {
          setPromotionPending({ from: selectedSquare, to: square });
          return;
        }

        onMove(selectedSquare, square);
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      // Clicou em outra peça própria - selecionar ela
      if (piece && piece.color === myColor[0]) {
        setSelectedSquare(square);
        setValidMoves(getValidMovesForSquare(square));
        return;
      }

      // Clicou em casa inválida - desselecionar
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // Nenhuma peça selecionada - selecionar se for minha
    if (piece && piece.color === myColor[0]) {
      setSelectedSquare(square);
      setValidMoves(getValidMovesForSquare(square));
    }
  };

  // Promoção
  const handlePromotion = (promotionPiece) => {
    if (promotionPending) {
      onMove(promotionPending.from, promotionPending.to, promotionPiece);
      setPromotionPending(null);
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-8 border-2 border-[#c29d5d] rounded-lg overflow-hidden shadow-2xl">
        {displayRanks.map((rank, rankIdx) => (
          displayFiles.map((file, fileIdx) => {
            const square = file + rank;
            const piece = getPiece(square);
            const isLight = (FILES.indexOf(file) + RANKS.indexOf(rank)) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isValidMove = validMoves.includes(square);
            const isLastMove = lastMove && (square === lastMove.from || square === lastMove.to);
            const isInCheck = inCheck === square;

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                style={{ 
                  backgroundColor: isInCheck 
                    ? 'rgba(239, 68, 68, 0.7)' 
                    : isLight 
                      ? boardThemeConfig.light 
                      : boardThemeConfig.dark 
                }}
                className={`
                  relative aspect-square flex items-center justify-center
                  cursor-pointer transition-all select-none
                  ${isSelected ? 'ring-4 ring-[#c29d5d] ring-inset z-10' : ''}
                  ${isLastMove ? 'ring-2 ring-yellow-400/50' : ''}
                  ${disabled || !isMyTurn ? 'cursor-default' : 'hover:brightness-110'}
                `}
              >
                {/* Indicador de lance válido */}
                {isValidMove && !piece && (
                  <div className="absolute w-3 h-3 bg-[#333]/40 rounded-full" />
                )}
                {isValidMove && piece && (
                  <div className="absolute inset-0 ring-4 ring-[#333]/40 ring-inset rounded-sm" />
                )}

                {/* Peça */}
                {piece && (
                  <div className={`transition-transform ${isSelected ? 'scale-110' : ''}`}>
                    <ThemedChessPiece piece={piece} size="md" shadow={true} />
                  </div>
                )}

                {/* Coordenadas */}
                {fileIdx === 0 && (
                  <span 
                    className="absolute left-1 top-0.5 text-xs font-bold"
                    style={{ color: isLight ? boardThemeConfig.dark : boardThemeConfig.light }}
                  >
                    {rank}
                  </span>
                )}
                {rankIdx === 7 && (
                  <span 
                    className="absolute right-1 bottom-0.5 text-xs font-bold"
                    style={{ color: isLight ? boardThemeConfig.dark : boardThemeConfig.light }}
                  >
                    {file}
                  </span>
                )}
              </div>
            );
          })
        ))}
      </div>

      {/* Modal de promoção */}
      <AnimatePresence>
        {promotionPending && (
          <ThemedPromotionPicker
            color={myColor}
            onSelect={handlePromotion}
            onCancel={() => {
              setPromotionPending(null);
              setSelectedSquare(null);
              setValidMoves([]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
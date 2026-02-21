import React, { useMemo } from 'react';
import { ThemedChessPiece } from '@/components/ui';

const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0
};

const PIECE_ORDER = ['q', 'r', 'b', 'n', 'p'];

function parseFenForMaterial(fen) {
  const position = fen.split(' ')[0];
  const whitePieces = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
  const blackPieces = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };

  for (const char of position) {
    if (/[a-z]/.test(char)) {
      blackPieces[char] = (blackPieces[char] || 0) + 1;
    } else if (/[A-Z]/.test(char)) {
      whitePieces[char.toLowerCase()] = (whitePieces[char.toLowerCase()] || 0) + 1;
    }
  }

  return { whitePieces, blackPieces };
}

function calculateMaterialDifference(whitePieces, blackPieces) {
  let whiteValue = 0;
  let blackValue = 0;

  for (const piece of Object.keys(PIECE_VALUES)) {
    whiteValue += (whitePieces[piece] || 0) * PIECE_VALUES[piece];
    blackValue += (blackPieces[piece] || 0) * PIECE_VALUES[piece];
  }

  return whiteValue - blackValue;
}

function getCapturedPieces(whitePieces, blackPieces) {
  // Peças iniciais
  const initialPieces = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
  
  const whiteCaptured = {}; // Peças brancas capturadas (pretas possuem)
  const blackCaptured = {}; // Peças pretas capturadas (brancas possuem)

  for (const piece of PIECE_ORDER) {
    const whiteLost = initialPieces[piece] - (whitePieces[piece] || 0);
    const blackLost = initialPieces[piece] - (blackPieces[piece] || 0);
    
    if (whiteLost > 0) whiteCaptured[piece] = whiteLost;
    if (blackLost > 0) blackCaptured[piece] = blackLost;
  }

  return { whiteCaptured, blackCaptured };
}

export default function MaterialAdvantage({ fen, playerColor = 'w' }) {
  const { material, advantage, capturedByWhite, capturedByBlack } = useMemo(() => {
    if (!fen) return { material: 0, advantage: 0, capturedByWhite: {}, capturedByBlack: {} };

    const { whitePieces, blackPieces } = parseFenForMaterial(fen);
    const diff = calculateMaterialDifference(whitePieces, blackPieces);
    const { whiteCaptured, blackCaptured } = getCapturedPieces(whitePieces, blackPieces);

    return {
      material: Math.abs(diff),
      advantage: diff,
      capturedByWhite: blackCaptured, // Brancas capturaram peças pretas
      capturedByBlack: whiteCaptured  // Pretas capturaram peças brancas
    };
  }, [fen]);

  const renderCapturedPieces = (captured, color) => {
    const pieces = [];
    for (const piece of PIECE_ORDER) {
      const count = captured[piece] || 0;
      for (let i = 0; i < count; i++) {
        pieces.push(
          <div key={`${piece}-${i}`} className="w-4 h-4 -ml-1 first:ml-0">
            <ThemedChessPiece 
              piece={{ type: piece, color }} 
              size="sm" 
            />
          </div>
        );
      }
    }
    return pieces;
  };

  const showAdvantage = (forColor) => {
    if (advantage === 0) return null;
    const hasAdvantage = (forColor === 'w' && advantage > 0) || (forColor === 'b' && advantage < 0);
    if (!hasAdvantage) return null;
    
    return (
      <span className="text-gold font-bold text-xs ml-1">
        +{material}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Material capturado pelas pretas (mostrar no topo se jogador é branco) */}
      <div className="flex items-center h-5">
        <div className="flex items-center">
          {renderCapturedPieces(capturedByBlack, 'w')}
        </div>
        {showAdvantage('b')}
      </div>
      
      {/* Material capturado pelas brancas (mostrar embaixo) */}
      <div className="flex items-center h-5">
        <div className="flex items-center">
          {renderCapturedPieces(capturedByWhite, 'b')}
        </div>
        {showAdvantage('w')}
      </div>
    </div>
  );
}

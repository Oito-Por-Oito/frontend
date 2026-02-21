// Move classification thresholds (in centipawns)
export const MOVE_CLASSIFICATIONS = {
  BRILLIANT: { symbol: '!!', label: 'Brilhante', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  GREAT: { symbol: '!', label: 'Ótimo', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  BEST: { symbol: '★', label: 'Melhor', color: 'text-green-400', bg: 'bg-green-500/20' },
  GOOD: { symbol: '', label: 'Bom', color: 'text-gray-300', bg: 'bg-gray-500/10' },
  INACCURACY: { symbol: '?!', label: 'Imprecisão', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  MISTAKE: { symbol: '?', label: 'Erro', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  BLUNDER: { symbol: '??', label: 'Erro Grave', color: 'text-red-400', bg: 'bg-red-500/20' },
  BOOK: { symbol: '📖', label: 'Teoria', color: 'text-purple-400', bg: 'bg-purple-500/20' },
};

// CP loss thresholds for classification
const THRESHOLDS = {
  BRILLIANT: -50, // Actually improved position beyond best move (rare)
  BEST: 10,
  GOOD: 25,
  INACCURACY: 50,
  MISTAKE: 100,
  BLUNDER: 200,
};

/**
 * Classify a move based on centipawn loss
 * @param {number} cpLoss - Centipawn loss from the move
 * @param {boolean} isBestMove - Whether this was the engine's best move
 * @param {boolean} foundTactic - Whether the move found a winning tactic
 * @returns {object} Classification object
 */
export function classifyMove(cpLoss, isBestMove, foundTactic = false) {
  // If move found a significant tactic others missed
  if (foundTactic && cpLoss <= 0) {
    return MOVE_CLASSIFICATIONS.BRILLIANT;
  }
  
  // Best move
  if (isBestMove || cpLoss <= THRESHOLDS.BEST) {
    return MOVE_CLASSIFICATIONS.BEST;
  }
  
  // Good move
  if (cpLoss <= THRESHOLDS.GOOD) {
    return MOVE_CLASSIFICATIONS.GOOD;
  }
  
  // Inaccuracy
  if (cpLoss <= THRESHOLDS.INACCURACY) {
    return MOVE_CLASSIFICATIONS.INACCURACY;
  }
  
  // Mistake
  if (cpLoss <= THRESHOLDS.MISTAKE) {
    return MOVE_CLASSIFICATIONS.MISTAKE;
  }
  
  // Blunder
  return MOVE_CLASSIFICATIONS.BLUNDER;
}

/**
 * Calculate accuracy percentage from average centipawn loss
 * Formula based on lichess accuracy calculation
 * @param {number} avgCpLoss - Average centipawn loss
 * @returns {number} Accuracy percentage 0-100
 */
export function calculateAccuracy(avgCpLoss) {
  if (avgCpLoss <= 0) return 100;
  // Formula: accuracy = 103.1668 * exp(-0.04354 * avgCpLoss) - 3.1669
  const accuracy = 103.1668 * Math.exp(-0.04354 * avgCpLoss) - 3.1669;
  return Math.max(0, Math.min(100, Math.round(accuracy * 10) / 10));
}

/**
 * Parse Stockfish evaluation output
 * @param {string} line - Stockfish output line
 * @returns {object|null} Parsed evaluation { cp, mate, bestMove, pv }
 */
export function parseStockfishEval(line) {
  const result = {
    cp: null,
    mate: null,
    bestMove: null,
    pv: null,
    depth: null,
  };

  // Parse depth
  const depthMatch = line.match(/depth (\d+)/);
  if (depthMatch) {
    result.depth = parseInt(depthMatch[1]);
  }

  // Parse centipawn score
  const cpMatch = line.match(/score cp (-?\d+)/);
  if (cpMatch) {
    result.cp = parseInt(cpMatch[1]);
  }

  // Parse mate score
  const mateMatch = line.match(/score mate (-?\d+)/);
  if (mateMatch) {
    result.mate = parseInt(mateMatch[1]);
  }

  // Parse principal variation (best line)
  const pvMatch = line.match(/pv (.+)$/);
  if (pvMatch) {
    result.pv = pvMatch[1].trim().split(' ');
    result.bestMove = result.pv[0];
  }

  return result.cp !== null || result.mate !== null ? result : null;
}

/**
 * Convert mate score to centipawns for comparison
 * @param {number} mate - Mate in N moves (positive = white winning)
 * @returns {number} Centipawn equivalent
 */
export function mateToCP(mate) {
  if (mate === null || mate === undefined) return 0;
  // Use a large value, decreasing as mate gets further
  const sign = mate > 0 ? 1 : -1;
  return sign * (10000 - Math.abs(mate) * 10);
}

/**
 * Get evaluation in centipawns (handles both cp and mate)
 * @param {object} evalResult - Parsed evaluation result
 * @returns {number} Evaluation in centipawns
 */
export function getEvalInCP(evalResult) {
  if (!evalResult) return 0;
  if (evalResult.mate !== null) {
    return mateToCP(evalResult.mate);
  }
  return evalResult.cp || 0;
}

/**
 * Format evaluation for display
 * @param {object} evalResult - Parsed evaluation
 * @param {boolean} isWhitePerspective - Show from white's perspective
 * @returns {string} Formatted evaluation string
 */
export function formatEvaluation(evalResult, isWhitePerspective = true) {
  if (!evalResult) return '0.0';
  
  if (evalResult.mate !== null) {
    const mate = isWhitePerspective ? evalResult.mate : -evalResult.mate;
    return `M${Math.abs(mate)}`;
  }
  
  const cp = isWhitePerspective ? evalResult.cp : -evalResult.cp;
  const pawns = cp / 100;
  const sign = pawns >= 0 ? '+' : '';
  return `${sign}${pawns.toFixed(1)}`;
}

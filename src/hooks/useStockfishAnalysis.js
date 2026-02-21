import { useState, useCallback, useRef, useEffect } from 'react';
import { Chess } from 'chess.js';
import createStockfish from '@/utils/stockfishLoader';
import { 
  parseStockfishEval, 
  getEvalInCP, 
  classifyMove, 
  calculateAccuracy,
  MOVE_CLASSIFICATIONS 
} from '@/lib/stockfishAnalyzer';
import { INITIAL_FEN } from '@/lib/gameHelpers';

const ANALYSIS_DEPTH = 18;

export function useStockfishAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  
  const workerRef = useRef(null);
  const abortRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current = true;
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const analyzeGame = useCallback(async (moves, positions) => {
    if (moves.length === 0) {
      setError('Nenhum lance para analisar');
      return null;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setError(null);
    abortRef.current = false;

    try {
      // Initialize Stockfish
      const worker = createStockfish();
      if (!worker) {
        throw new Error('Falha ao carregar Stockfish');
      }
      workerRef.current = worker;

      // Wait for Stockfish ready
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Stockfish timeout')), 10000);
        
        worker.onmessage = (e) => {
          if (e.data.includes('uciok')) {
            clearTimeout(timeout);
            resolve();
          }
        };
        
        worker.postMessage('uci');
      });

      worker.postMessage('isready');
      await new Promise((resolve) => {
        const handler = (e) => {
          if (e.data.includes('readyok')) {
            worker.removeEventListener('message', handler);
            resolve();
          }
        };
        worker.addEventListener('message', handler);
      });

      // Analyze each position
      const moveAnalysis = [];
      let whiteTotalCpLoss = 0;
      let blackTotalCpLoss = 0;
      let whiteMoves = 0;
      let blackMoves = 0;
      
      // We need positions BEFORE each move to analyze
      for (let i = 0; i < moves.length; i++) {
        if (abortRef.current) break;
        
        const positionBefore = positions[i]; // Position before move i
        const move = moves[i];
        const isWhiteMove = i % 2 === 0;

        // Get evaluation for position before move (what was best)
        const beforeEval = await analyzePosition(worker, positionBefore, ANALYSIS_DEPTH);
        
        // Get evaluation after the move was played
        const positionAfter = positions[i + 1];
        const afterEval = await analyzePosition(worker, positionAfter, ANALYSIS_DEPTH);

        // Calculate centipawn loss
        const evalBefore = getEvalInCP(beforeEval);
        const evalAfter = getEvalInCP(afterEval);
        
        // From the moving side's perspective
        let cpLoss;
        if (isWhiteMove) {
          cpLoss = evalBefore - evalAfter;
          if (cpLoss > 0) {
            whiteTotalCpLoss += cpLoss;
          }
          whiteMoves++;
        } else {
          cpLoss = (-evalBefore) - (-evalAfter); // Black perspective
          if (cpLoss > 0) {
            blackTotalCpLoss += cpLoss;
          }
          blackMoves++;
        }

        // Check if this was the best move
        const isBestMove = beforeEval?.bestMove === `${move.from_square}${move.to_square}`;
        
        // Classify the move
        const classification = classifyMove(Math.max(0, cpLoss), isBestMove);

        moveAnalysis.push({
          moveIndex: i,
          move,
          san: move.san,
          evalBefore: beforeEval,
          evalAfter: afterEval,
          cpLoss: Math.max(0, cpLoss),
          bestMove: beforeEval?.bestMove,
          isBestMove,
          classification,
          isWhiteMove,
        });

        setProgress(Math.round(((i + 1) / moves.length) * 100));
      }

      // Calculate accuracies
      const whiteAccuracy = calculateAccuracy(whiteMoves > 0 ? whiteTotalCpLoss / whiteMoves : 0);
      const blackAccuracy = calculateAccuracy(blackMoves > 0 ? blackTotalCpLoss / blackMoves : 0);

      // Count move types
      const moveTypeCounts = {
        white: { brilliant: 0, great: 0, best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 },
        black: { brilliant: 0, great: 0, best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 },
      };

      moveAnalysis.forEach((m) => {
        const side = m.isWhiteMove ? 'white' : 'black';
        const type = m.classification.label.toLowerCase().replace(' ', '');
        
        if (m.classification === MOVE_CLASSIFICATIONS.BRILLIANT) moveTypeCounts[side].brilliant++;
        else if (m.classification === MOVE_CLASSIFICATIONS.GREAT) moveTypeCounts[side].great++;
        else if (m.classification === MOVE_CLASSIFICATIONS.BEST) moveTypeCounts[side].best++;
        else if (m.classification === MOVE_CLASSIFICATIONS.GOOD) moveTypeCounts[side].good++;
        else if (m.classification === MOVE_CLASSIFICATIONS.INACCURACY) moveTypeCounts[side].inaccuracy++;
        else if (m.classification === MOVE_CLASSIFICATIONS.MISTAKE) moveTypeCounts[side].mistake++;
        else if (m.classification === MOVE_CLASSIFICATIONS.BLUNDER) moveTypeCounts[side].blunder++;
      });

      const results = {
        moves: moveAnalysis,
        whiteAccuracy,
        blackAccuracy,
        whiteTotalCpLoss,
        blackTotalCpLoss,
        moveTypeCounts,
      };

      setAnalysisResults(results);
      return results;
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message);
      return null;
    } finally {
      setIsAnalyzing(false);
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    }
  }, []);

  const stopAnalysis = useCallback(() => {
    abortRef.current = true;
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setIsAnalyzing(false);
  }, []);

  const resetAnalysis = useCallback(() => {
    setAnalysisResults(null);
    setProgress(0);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    progress,
    analysisResults,
    error,
    analyzeGame,
    stopAnalysis,
    resetAnalysis,
  };
}

// Helper to analyze a single position
async function analyzePosition(worker, fen, depth) {
  return new Promise((resolve) => {
    let bestResult = null;
    
    const handler = (e) => {
      const line = e.data;
      
      // Parse info lines for best move and evaluation
      if (line.startsWith('info') && line.includes('pv')) {
        const parsed = parseStockfishEval(line);
        if (parsed && (parsed.depth || 0) >= (bestResult?.depth || 0)) {
          bestResult = parsed;
        }
      }
      
      // When analysis is done
      if (line.startsWith('bestmove')) {
        worker.removeEventListener('message', handler);
        resolve(bestResult);
      }
    };
    
    worker.addEventListener('message', handler);
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${depth}`);
  });
}

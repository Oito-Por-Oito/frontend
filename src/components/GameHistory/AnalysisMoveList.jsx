import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatEvaluation } from '@/lib/stockfishAnalyzer';

export default function AnalysisMoveList({ 
  moves, 
  analysisResults, 
  currentMoveIndex, 
  onMoveClick 
}) {
  const listRef = useRef(null);
  const activeMoveRef = useRef(null);

  // Auto-scroll to active move (apenas dentro do container, sem afetar a página)
  useEffect(() => {
    if (activeMoveRef.current && listRef.current) {
      const container = listRef.current;
      const element = activeMoveRef.current;
      
      // Calcular posição relativa ao container
      const elementTop = element.offsetTop;
      const containerHeight = container.clientHeight;
      const elementHeight = element.offsetHeight;
      
      // Centralizar o elemento no container
      const scrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);
      container.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
    }
  }, [currentMoveIndex]);

  // Group moves into pairs (white + black)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: { move: moves[i], index: i },
      black: moves[i + 1] ? { move: moves[i + 1], index: i + 1 } : null,
    });
  }

  const getMoveClassification = (index) => {
    if (!analysisResults?.moves) return null;
    return analysisResults.moves[index]?.classification;
  };

  const getMoveEval = (index) => {
    if (!analysisResults?.moves) return null;
    return analysisResults.moves[index]?.evalAfter;
  };

  return (
    <div 
      ref={listRef}
      className="bg-[#1e1e1e] rounded-xl p-3 max-h-80 overflow-y-auto scrollbar-thin 
                 scrollbar-track-transparent scrollbar-thumb-gray-700"
    >
      <h4 className="text-sm font-semibold text-gray-300 mb-2 sticky top-0 bg-[#1e1e1e] pb-2">
        Lances
      </h4>
      
      <div className="space-y-1">
        {movePairs.map((pair) => (
          <div key={pair.number} className="flex items-center gap-1 text-sm">
            {/* Move number */}
            <span className="w-8 text-gray-500 text-right pr-1 flex-shrink-0">
              {pair.number}.
            </span>
            
            {/* White move */}
            <MoveCell
              move={pair.white.move}
              index={pair.white.index}
              isActive={currentMoveIndex === pair.white.index}
              classification={getMoveClassification(pair.white.index)}
              evaluation={getMoveEval(pair.white.index)}
              onClick={() => onMoveClick(pair.white.index)}
              ref={currentMoveIndex === pair.white.index ? activeMoveRef : null}
            />
            
            {/* Black move */}
            {pair.black ? (
              <MoveCell
                move={pair.black.move}
                index={pair.black.index}
                isActive={currentMoveIndex === pair.black.index}
                classification={getMoveClassification(pair.black.index)}
                evaluation={getMoveEval(pair.black.index)}
                onClick={() => onMoveClick(pair.black.index)}
                ref={currentMoveIndex === pair.black.index ? activeMoveRef : null}
              />
            ) : (
              <span className="flex-1" />
            )}
          </div>
        ))}
      </div>
      
      {moves.length === 0 && (
        <p className="text-gray-500 text-center py-4 text-sm">Nenhum lance</p>
      )}
    </div>
  );
}

const MoveCell = React.forwardRef(({ move, index, isActive, classification, evaluation, onClick }, ref) => {
  const bgClass = isActive 
    ? 'bg-[#c29d5d]/30 border-[#c29d5d]' 
    : classification?.bg || 'bg-transparent border-transparent';
  
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex-1 px-2 py-1 rounded border transition-colors text-left
                  hover:bg-[#2a2a2a] ${bgClass}`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className={`font-mono ${classification?.color || 'text-gray-200'}`}>
          {move.san}
          {classification?.symbol && (
            <span className="ml-0.5 text-xs">{classification.symbol}</span>
          )}
        </span>
        {evaluation && (
          <span className="text-[10px] text-gray-500 font-mono">
            {formatEvaluation(evaluation)}
          </span>
        )}
      </div>
    </motion.button>
  );
});

MoveCell.displayName = 'MoveCell';

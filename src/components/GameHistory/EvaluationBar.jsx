import React from 'react';
import { motion } from 'framer-motion';

export default function EvaluationBar({ evaluation, isWhitePerspective = true }) {
  // Convert evaluation to a percentage for the bar
  // Evaluation in centipawns, cap at ±10 pawns for visual
  const getBarPercentage = () => {
    if (!evaluation) return 50;
    
    if (evaluation.mate !== null) {
      // Mate: show full advantage
      return evaluation.mate > 0 ? 100 : 0;
    }
    
    const cp = evaluation.cp || 0;
    // Map -1000 to +1000 cp to 0-100%
    const percentage = 50 + (cp / 20); // Each pawn (100cp) = 5%
    return Math.max(0, Math.min(100, percentage));
  };

  const formatEval = () => {
    if (!evaluation) return '0.0';
    
    if (evaluation.mate !== null) {
      return `M${Math.abs(evaluation.mate)}`;
    }
    
    const cp = evaluation.cp || 0;
    const pawns = cp / 100;
    const sign = pawns >= 0 ? '+' : '';
    return `${sign}${pawns.toFixed(1)}`;
  };

  const whitePercentage = getBarPercentage();
  const isWhiteWinning = whitePercentage >= 50;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Evaluation text */}
      <div className={`text-xs font-mono font-bold ${isWhiteWinning ? 'text-white' : 'text-gray-800'}`}>
        {formatEval()}
      </div>
      
      {/* Vertical bar */}
      <div className="relative w-6 h-64 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
        {/* White portion (from bottom) */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-white"
          initial={{ height: '50%' }}
          animate={{ height: `${whitePercentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-600" />
      </div>
    </div>
  );
}

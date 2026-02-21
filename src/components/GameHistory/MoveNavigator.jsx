import React from 'react';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';

export default function MoveNavigator({ 
  currentIndex, 
  totalMoves, 
  onGoToStart, 
  onGoToEnd, 
  onPrevious, 
  onNext 
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center gap-1 p-2 bg-[#1e1e1e] rounded-xl">
        <button
          onClick={onGoToStart}
          disabled={currentIndex < 0}
          className="p-2 rounded-lg hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Início (Home)"
        >
          <ChevronFirst size={20} className="text-gray-300" />
        </button>
        
        <button
          onClick={onPrevious}
          disabled={currentIndex < 0}
          className="p-2 rounded-lg hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Anterior (←)"
        >
          <ChevronLeft size={20} className="text-gray-300" />
        </button>
        
        <div className="px-3 py-1 text-sm text-gray-400 min-w-[60px] text-center">
          {currentIndex + 1} / {totalMoves}
        </div>
        
        <button
          onClick={onNext}
          disabled={currentIndex >= totalMoves - 1}
          className="p-2 rounded-lg hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Próximo (→)"
        >
          <ChevronRight size={20} className="text-gray-300" />
        </button>
        
        <button
          onClick={onGoToEnd}
          disabled={currentIndex >= totalMoves - 1}
          className="p-2 rounded-lg hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Fim (End)"
        >
          <ChevronLast size={20} className="text-gray-300" />
        </button>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-1">
        Use as setas ← → para navegar | Home/End para início/fim
      </div>
    </div>
  );
}

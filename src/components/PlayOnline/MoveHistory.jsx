import React, { useRef, useEffect } from 'react';

export default function MoveHistory({ moves }) {
  const containerRef = useRef(null);

  // Auto-scroll para o último lance
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [moves]);

  if (!moves || moves.length === 0) {
    return (
      <div className="bg-[#1e1e1e] rounded-xl p-4 h-48 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Nenhum lance ainda</p>
      </div>
    );
  }

  // Agrupar lances em pares (brancas + pretas)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i]?.san,
      black: moves[i + 1]?.san,
    });
  }

  return (
    <div 
      ref={containerRef}
      className="bg-[#1e1e1e] rounded-xl p-3 h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent"
    >
      <h3 className="text-sm font-semibold text-gray-400 mb-2 sticky top-0 bg-[#1e1e1e] pb-1">
        Lances
      </h3>
      <div className="space-y-1">
        {movePairs.map((pair, idx) => (
          <div 
            key={idx} 
            className={`
              flex items-center text-sm font-mono rounded px-2 py-1
              ${idx === movePairs.length - 1 ? 'bg-[#c29d5d]/20' : ''}
            `}
          >
            <span className="w-8 text-gray-500">{pair.number}.</span>
            <span className="w-16 text-white">{pair.white || ''}</span>
            <span className="w-16 text-gray-300">{pair.black || ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

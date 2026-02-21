import React, { useRef, useEffect } from 'react';

export default function MoveHistory({ moves = [], currentMoveIndex = -1 }) {
  const containerRef = useRef(null);

  // Auto-scroll to latest move
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [moves]);

  if (moves.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Os lances aparecerão aqui
      </div>
    );
  }

  // Group moves in pairs (white, black)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || null,
      whiteIndex: i,
      blackIndex: i + 1
    });
  }

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent"
    >
      <div className="space-y-1 p-2">
        {movePairs.map((pair) => (
          <div 
            key={pair.number}
            className="flex items-center gap-2 text-sm"
          >
            <span className="text-muted-foreground w-6 text-right">{pair.number}.</span>
            <span 
              className={`
                flex-1 px-2 py-1 rounded cursor-pointer transition-colors
                ${currentMoveIndex === pair.whiteIndex 
                  ? 'bg-gold/30 text-gold-light font-bold' 
                  : 'hover:bg-surface-tertiary text-foreground'
                }
              `}
            >
              {pair.white}
            </span>
            {pair.black && (
              <span 
                className={`
                  flex-1 px-2 py-1 rounded cursor-pointer transition-colors
                  ${currentMoveIndex === pair.blackIndex 
                    ? 'bg-gold/30 text-gold-light font-bold' 
                    : 'hover:bg-surface-tertiary text-foreground'
                  }
                `}
              >
                {pair.black}
              </span>
            )}
            {!pair.black && <span className="flex-1" />}
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";

/**
 * GameStatusLog - Exibe log de jogadas e status do jogo
 */
export default function GameStatusLog({ gameStarted, game, log }) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {!gameStarted && (
        <div className="text-lg text-gold-light font-semibold">
          Clique em ▶ Play para começar!
        </div>
      )}
      
      {gameStarted && game?.isGameOver() && (
        <div className="text-lg text-foreground font-semibold">
          {game.isCheckmate()
            ? `Xeque-mate! ${game.turn() === "w" ? "Preto" : "Branco"} venceu.`
            : "Empate!"}
        </div>
      )}
      
      {/* Log de mensagens */}
      <div className="w-full bg-black/60 rounded-lg p-3 text-xs text-gold-lighter font-mono h-32 overflow-y-auto">
        {log.length === 0 ? (
          <div className="text-muted-foreground">Aguardando jogadas...</div>
        ) : (
          log.map((l, i) => (
            <div key={i} className="py-0.5">{l}</div>
          ))
        )}
      </div>
    </div>
  );
}

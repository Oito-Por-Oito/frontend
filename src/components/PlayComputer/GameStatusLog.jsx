import React from "react";

function GameStatusLog({ renderBoard, gameStarted, game, log }) {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {renderBoard()}
      {!gameStarted && (
        <div className="mt-4 text-lg text-yellow-300 font-semibold">
          Clique em ▶ Play para começar!
        </div>
      )}
      {gameStarted && game.isGameOver() && (
        <div className="mt-2 text-lg text-white font-semibold">
          {game.isCheckmate()
            ? `Xeque-mate! ${game.turn() === "w" ? "Preto" : "Branco"} venceu.`
            : "Empate!"}
        </div>
      )}
      {/* Log de mensagens */}
      <div className="w-full max-w-lg mt-4 bg-black/60 rounded p-2 text-xs text-yellow-100 font-mono h-32 overflow-y-auto">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}

export default GameStatusLog;

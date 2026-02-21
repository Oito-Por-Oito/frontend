
import React, { useState } from "react";
import ChessBoard from "../components/PlayComputer/ChessBoard";
import BotSidebar from "../components/PlayComputer/BotSidebar";
import PlayerInfo from "../components/PlayComputer/PlayerInfo";
import GameStatusLog from "../components/PlayComputer/GameStatusLog";
import Navbar from "../components/Navbar";

export default function PlayComputer() {
  const [stockfishLevel, setStockfishLevel] = useState(5);
  const [gameStarted, setGameStarted] = useState(false);
  const [game, setGame] = useState(null);
  const [log, setLog] = useState([]);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] text-white overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center w-full py-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-0 lg:gap-12 px-2 md:px-8">
          {/* Coluna do tabuleiro e infos */}
          <div className="flex flex-col items-center w-full lg:w-auto">
            {/* Header do bot */}
            <PlayerInfo
              avatar="/assets/img/anna-rudolf.jpg"
              name="Jimmy"
              rating={600}
              flagUrl="https://flagcdn.com/w40/us.png"
              flagAlt="USA"
              isBot={true}
            />
            {/* Tabuleiro */}
            <ChessBoard 
              stockfishLevel={stockfishLevel} 
              gameStarted={gameStarted} 
              setParentGame={setGame} 
              setParentLog={setLog}
            />
            {/* Footer do usuário */}
            <PlayerInfo
              avatar="/assets/img/puzzle1.png"
              name="Guest"
              rating={0}
              flagUrl={null}
              flagAlt="Indefinida"
              isBot={false}
            />
          </div>
          {/* Sidebar dos bots ou GameStatusLog */}
          <div className="mt-8 lg:mt-0 lg:ml-8 flex-shrink-0 w-full lg:w-auto">
            {!gameStarted ? (
              <BotSidebar stockfishLevel={stockfishLevel} setStockfishLevel={setStockfishLevel} onPlayClick={() => setGameStarted(true)} gameStarted={gameStarted} />
            ) : (
              <div className="flex flex-col items-center gap-4 p-4 bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] rounded-2xl border border-[#c29d5d]/30 shadow-xl">
                <GameStatusLog
                  renderBoard={() => null}
                  gameStarted={gameStarted}
                  game={game}
                  log={log}
                />
                <button
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition-all duration-150"
                  onClick={() => window.location.reload()}
                >
                  Reiniciar Jogo
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

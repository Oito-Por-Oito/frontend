import React from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ChessPuzzleCard from './components/ChessPuzzle/ChessPuzzleCard';
import PuzzleChessCard from './components/ChessPuzzle/PuzzleChessCard';
import ChessNewsGrid from "./components/ChessNewsGrid";
import DownloadAppScreen from "./components/DownloadAppScreen";
import ChessTopPlayers from './components/ChessTopPlayers';
import ChessBoardWithCTA from './components/ChessBoardWithCTA';
import PlayerStatsCard from './components/PlayerStatsCard';

function App() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white">
      <Navbar />

      <main className="flex flex-col items-center bg-[#2c2c2c] px-4 sm:px-6 md:px-8 pt-8">
        {/* CONTAINER PRINCIPAL */}
        <div className="flex flex-col xl:flex-row w-full max-w-[1650px] items-start gap-6 xl:gap-[60px]">

          {/* LADO ESQUERDO: Top Players — oculto em mobile/tablet, visível em xl+ */}
          <div className="hidden xl:block w-[280px] flex-shrink-0">
            <ChessTopPlayers />
          </div>

          {/* CENTRO: Tabuleiro + Cards */}
          <div className="flex flex-col w-full xl:flex-1 items-center gap-8">
            {/* TABULEIRO */}
            <ChessBoardWithCTA />

            {/* CARDS ABAIXO */}
            <div className="w-full">
              <ChessPuzzleCard />
            </div>
            <div className="w-full">
              <PuzzleChessCard />
            </div>
            <div className="w-full">
              <ChessNewsGrid />
            </div>
            <div className="mt-4 w-full">
              <DownloadAppScreen />
            </div>
          </div>

          {/* LADO DIREITO: Player Stats — oculto em mobile/tablet, visível em xl+ */}
          <div className="hidden xl:block w-[280px] flex-shrink-0">
            <PlayerStatsCard />
          </div>
        </div>

        {/* Top Players e Player Stats em linha para tablet (lg), oculto em xl+ */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-[1650px] mt-6 xl:hidden pb-8">
          <div className="flex-1">
            <ChessTopPlayers />
          </div>
          <div className="flex-1">
            <PlayerStatsCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;

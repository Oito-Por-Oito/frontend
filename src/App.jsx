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
import { useAuth } from "./hooks/useAuth";
import { DashboardContainer } from "./components/Dashboard";
import LoadingFallback from "./components/ui/LoadingFallback";

// Componente para visitantes (conteúdo original da home)
function HomeContent() {
  return (
    <main className="flex flex-col items-center bg-[#2c2c2c] px-4 md:px-8 pt-8">
      {/* CONTAINER PRINCIPAL - Grid responsivo */}
      <div className="grid grid-cols-1 sidebar:grid-cols-[280px_1fr_280px] w-full max-w-[1650px] gap-6 sidebar:gap-12 xl:gap-[90px]">
        {/* LADO ESQUERDO: Top Players - oculto em telas < 1315px */}
        <div className="hidden sidebar:block">
          <ChessTopPlayers />
        </div>

        {/* CENTRO: Tabuleiro + Cards */}
        <div className="flex flex-col w-full max-w-[900px] mx-auto items-center gap-8">
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

        {/* LADO DIREITO: Player Stats - oculto em telas < 1315px */}
        <div className="hidden sidebar:block">
          <PlayerStatsCard />
        </div>
      </div>
    </main>
  );
}

function App() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white">
      <Navbar />

      {loading ? (
        <main className="flex items-center justify-center min-h-[60vh] bg-[#2c2c2c]">
          <LoadingFallback />
        </main>
      ) : user ? (
        <main className="bg-[#2c2c2c]">
          <DashboardContainer />
        </main>
      ) : (
        <HomeContent />
      )}

      <Footer />
    </div>
  );
}

export default App;

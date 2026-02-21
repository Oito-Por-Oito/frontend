import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Clock, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReplayBoard from '@/components/GameHistory/ReplayBoard';
import MoveNavigator from '@/components/GameHistory/MoveNavigator';
import AnalysisMoveList from '@/components/GameHistory/AnalysisMoveList';
import AnalysisPanel from '@/components/GameHistory/AnalysisPanel';
import EvaluationBar from '@/components/GameHistory/EvaluationBar';
import { useGameReplay } from '@/hooks/useGameReplay';
import { useStockfishAnalysis } from '@/hooks/useStockfishAnalysis';
import { useAuth } from '@/hooks/useAuth';
import { getRatingForTimeControl } from '@/lib/gameHelpers';

export default function GameReplay() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();

  const {
    game,
    moves,
    chess,
    currentFen,
    currentMoveIndex,
    lastMoveSquares,
    positions,
    loading,
    error,
    goToStart,
    goToEnd,
    goToPrevious,
    goToNext,
    goToMove,
    totalMoves,
  } = useGameReplay(gameId);

  const {
    isAnalyzing,
    progress,
    analysisResults,
    error: analysisError,
    analyzeGame,
    stopAnalysis,
    resetAnalysis,
  } = useStockfishAnalysis();

  // Auto-start analysis if ?analyze=true
  useEffect(() => {
    if (searchParams.get('analyze') === 'true' && moves.length > 0 && !analysisResults && !isAnalyzing) {
      analyzeGame(moves, positions);
    }
  }, [searchParams, moves.length, positions, analysisResults, isAnalyzing]);

  const handleStartAnalysis = () => {
    if (moves.length > 0) {
      analyzeGame(moves, positions);
    }
  };

  // Determine player info
  const isWhite = game?.white_player_id === profile?.id;
  const myPlayer = isWhite ? game?.white_player : game?.black_player;
  const opponent = isWhite ? game?.black_player : game?.white_player;

  // Get current evaluation for the bar
  const currentEval = analysisResults?.moves?.[currentMoveIndex]?.evalAfter;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#181818] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#c29d5d] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Carregando partida...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-[#181818] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || 'Partida não encontrada'}</p>
            <button
              onClick={() => navigate('/history')}
              className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg"
            >
              Voltar ao histórico
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const whiteRating = getRatingForTimeControl(game.white_player, game.time_control);
  const blackRating = getRatingForTimeControl(game.black_player, game.time_control);

  const getResultBadge = () => {
    const isWinner = game.winner_id === profile?.id;
    const isDraw = game.result === '1/2-1/2';
    
    if (isDraw) return { text: 'Empate', color: 'bg-gray-500/20 text-gray-400' };
    if (isWinner) return { text: 'Vitória', color: 'bg-green-500/20 text-green-400' };
    return { text: 'Derrota', color: 'bg-red-500/20 text-red-400' };
  };

  const result = getResultBadge();

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
          >
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Voltar ao histórico</span>
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${result.color}`}>
                {result.text}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-400 bg-[#2a2a2a] px-3 py-1.5 rounded-full">
                <Clock size={14} />
                {game.time_control}
              </span>
              {game.ended_at && (
                <span className="flex items-center gap-1.5 text-sm text-gray-400 bg-[#2a2a2a] px-3 py-1.5 rounded-full">
                  <Calendar size={14} />
                  {format(new Date(game.ended_at), "d MMM yyyy, HH:mm", { locale: ptBR })}
                </span>
              )}
            </div>
          </motion.div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Evaluation bar (desktop only) */}
            {analysisResults && (
              <div className="hidden lg:block lg:col-span-1">
                <EvaluationBar evaluation={currentEval} />
              </div>
            )}

            {/* Board and controls */}
            <div className={`${analysisResults ? 'lg:col-span-6' : 'lg:col-span-7'} space-y-4`}>
              {/* Player info - Black (top) */}
              <PlayerBar 
                player={game.black_player} 
                rating={blackRating}
                color="black"
                isMe={game.black_player_id === profile?.id}
              />

              {/* Chess board */}
              <ReplayBoard 
                fen={currentFen} 
                lastMoveSquares={lastMoveSquares}
                orientation={isWhite ? 'white' : 'black'}
              />

              {/* Player info - White (bottom) */}
              <PlayerBar 
                player={game.white_player} 
                rating={whiteRating}
                color="white"
                isMe={game.white_player_id === profile?.id}
              />

              {/* Move navigator */}
              <MoveNavigator
                currentIndex={currentMoveIndex}
                totalMoves={totalMoves}
                onGoToStart={goToStart}
                onGoToEnd={goToEnd}
                onPrevious={goToPrevious}
                onNext={goToNext}
              />
            </div>

            {/* Sidebar */}
            <div className={`${analysisResults ? 'lg:col-span-5' : 'lg:col-span-5'} space-y-4`}>
              {/* Analysis panel */}
              <AnalysisPanel
                isAnalyzing={isAnalyzing}
                progress={progress}
                analysisResults={analysisResults}
                error={analysisError}
                onStartAnalysis={handleStartAnalysis}
                onStopAnalysis={stopAnalysis}
              />

              {/* Move list with analysis */}
              <AnalysisMoveList
                moves={moves}
                analysisResults={analysisResults}
                currentMoveIndex={currentMoveIndex}
                onMoveClick={goToMove}
              />

              {/* Game info */}
              <div className="bg-[#1e1e1e] rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Informações da Partida</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Resultado</span>
                    <span className="text-gray-300">{game.result}</span>
                  </div>
                  {game.result_reason && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Motivo</span>
                      <span className="text-gray-300 capitalize">{game.result_reason.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total de lances</span>
                    <span className="text-gray-300">{totalMoves}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function PlayerBar({ player, rating, color, isMe }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl ${
      isMe ? 'bg-[#c29d5d]/10 border border-[#c29d5d]/30' : 'bg-[#1e1e1e]'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full overflow-hidden bg-[#2a2a2a] border-2 ${
          isMe ? 'border-[#c29d5d]' : 'border-gray-600'
        }`}>
          {player?.avatar_url ? (
            <img src={player.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg">
              {color === 'white' ? '♔' : '♚'}
            </div>
          )}
        </div>
        <div>
          <p className={`font-medium ${isMe ? 'text-[#c29d5d]' : 'text-white'}`}>
            {player?.display_name || player?.username || 'Jogador'}
            {isMe && <span className="text-xs ml-2 text-gray-400">(você)</span>}
          </p>
          <p className="text-xs text-gray-500">
            {color === 'white' ? '♔ Brancas' : '♚ Pretas'}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-300">{rating}</p>
        <p className="text-xs text-gray-500">rating</p>
      </div>
    </div>
  );
}

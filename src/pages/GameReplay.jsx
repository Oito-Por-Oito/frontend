import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PageLayout } from '@/components/layout';
import { Card, Button } from '@/components/ui';
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

  const isWhite = game?.white_player_id === profile?.id;
  const currentEval = analysisResults?.moves?.[currentMoveIndex]?.evalAfter;

  if (loading) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Carregando partida...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !game) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center">
            <p className="text-red-400 mb-4 text-sm">{error || 'Partida não encontrada'}</p>
            <Button variant="outline" onClick={() => navigate('/history')}>
              Voltar ao histórico
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const whiteRating = getRatingForTimeControl(game.white_player, game.time_control);
  const blackRating = getRatingForTimeControl(game.black_player, game.time_control);

  const getResultBadge = () => {
    const isWinner = game.winner_id === profile?.id;
    const isDraw = game.result === '1/2-1/2';
    if (isDraw) return { text: 'Empate', color: 'bg-surface-tertiary text-muted-foreground' };
    if (isWinner) return { text: 'Vitória', color: 'bg-green-500/20 text-green-400' };
    return { text: 'Derrota', color: 'bg-red-500/20 text-red-400' };
  };

  const result = getResultBadge();

  return (
    <PageLayout>
      <main className="flex-1 py-4 sm:py-6 px-4 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
          >
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft size={18} />
              <span>Voltar ao histórico</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${result.color}`}>
                {result.text}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-surface-secondary px-3 py-1 rounded-full border border-gold/10">
                <Clock size={12} />
                {game.time_control}
              </span>
              {game.ended_at && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-surface-secondary px-3 py-1 rounded-full border border-gold/10">
                  <Calendar size={12} />
                  {format(new Date(game.ended_at), "d MMM yyyy, HH:mm", { locale: ptBR })}
                </span>
              )}
            </div>
          </motion.div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-x-hidden">
            {/* Evaluation bar (desktop only) */}
            {analysisResults && (
              <div className="hidden lg:block lg:col-span-1">
                <EvaluationBar evaluation={currentEval} />
              </div>
            )}

            {/* Board and controls */}
            <div className={`${analysisResults ? 'lg:col-span-6' : 'lg:col-span-7'} space-y-3 min-w-0`}>
              <PlayerBar 
                player={game.black_player} 
                rating={blackRating}
                color="black"
                isMe={game.black_player_id === profile?.id}
              />
              <ReplayBoard 
                fen={currentFen} 
                lastMoveSquares={lastMoveSquares}
                orientation={isWhite ? 'white' : 'black'}
              />
              <PlayerBar 
                player={game.white_player} 
                rating={whiteRating}
                color="white"
                isMe={game.white_player_id === profile?.id}
              />
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
            <div className={`${analysisResults ? 'lg:col-span-5' : 'lg:col-span-5'} space-y-3 min-w-0`}>
              <AnalysisPanel
                isAnalyzing={isAnalyzing}
                progress={progress}
                analysisResults={analysisResults}
                error={analysisError}
                onStartAnalysis={handleStartAnalysis}
                onStopAnalysis={stopAnalysis}
              />
              <AnalysisMoveList
                moves={moves}
                analysisResults={analysisResults}
                currentMoveIndex={currentMoveIndex}
                onMoveClick={goToMove}
              />
              <Card variant="gradient" className="p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Informações da Partida</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resultado</span>
                    <span className="text-foreground">{game.result}</span>
                  </div>
                  {game.result_reason && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Motivo</span>
                      <span className="text-foreground capitalize">
                        {game.result_reason.replace(/_/g, ' ')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de lances</span>
                    <span className="text-foreground">{totalMoves}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}

function PlayerBar({ player, rating, color, isMe }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${
      isMe
        ? 'bg-gold/10 border-gold/30'
        : 'bg-surface-secondary border-surface-tertiary'
    }`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-full overflow-hidden bg-surface-tertiary border-2 shrink-0 ${
          isMe ? 'border-gold' : 'border-surface-tertiary'
        }`}>
          {player?.avatar_url ? (
            <img src={player.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg">
              {color === 'white' ? '♔' : '♚'}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className={`font-medium text-sm truncate ${isMe ? 'text-gold' : 'text-foreground'}`}>
            {player?.display_name || player?.username || 'Jogador'}
            {isMe && <span className="text-xs ml-2 text-muted-foreground">(você)</span>}
          </p>
          <p className="text-xs text-muted-foreground">
            {color === 'white' ? '♔ Brancas' : '♚ Pretas'}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="font-semibold text-sm text-foreground">{rating}</p>
        <p className="text-xs text-muted-foreground">rating</p>
      </div>
    </div>
  );
}

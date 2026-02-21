import React, { useState, useCallback } from "react";
import { PageLayout } from "@/components/layout";
import ChessBoardGame from "@/components/PlayComputer/ChessBoardGame";
import GameSetupSidebar from "@/components/PlayComputer/GameSetupSidebar";
import GameSidebar from "@/components/PlayComputer/GameSidebar";
import GameResultModal from "@/components/PlayComputer/GameResultModal";
import PlayerInfo from "@/components/PlayComputer/PlayerInfo";
import { BOTS, TIME_CONTROLS, getFlagUrl } from "@/data/botData";

export default function PlayComputer() {
  const [gameConfig, setGameConfig] = useState(null);
  const [gameKey, setGameKey] = useState(0);
  
  const [moves, setMoves] = useState([]);
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [whiteTime, setWhiteTime] = useState(300);
  const [blackTime, setBlackTime] = useState(300);
  const [currentTurn, setCurrentTurn] = useState('w');
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [showResult, setShowResult] = useState(false);
  const [gameResult, setGameResult] = useState({ result: 'draw', reason: 'stalemate' });

  const handleStartGame = useCallback((config) => {
    setGameConfig(config);
    setMoves([]);
    setFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    setWhiteTime(config.timeControl.initialTime);
    setBlackTime(config.timeControl.initialTime);
    setCurrentTurn('w');
    setIsGameOver(false);
    setShowResult(false);
    setGameKey(prev => prev + 1);
  }, []);

  const handleMove = useCallback((move, newFen, allMoves) => {
    setMoves(allMoves);
    setFen(newFen);
    setCurrentTurn(move.color === 'w' ? 'b' : 'w');
  }, []);

  const handleTimeUpdate = useCallback((white, black) => {
    setWhiteTime(white);
    setBlackTime(black);
  }, []);

  const handleGameEnd = useCallback((result, reason) => {
    setIsGameOver(true);
    setGameResult({ result, reason });
    setShowResult(true);
  }, []);

  const handleResign = useCallback(() => {
    setIsGameOver(true);
    setGameResult({ result: 'loss', reason: 'resignation' });
    setShowResult(true);
  }, []);

  const handleOfferDraw = useCallback(() => {
    const accepted = Math.random() > 0.7;
    if (accepted) {
      setIsGameOver(true);
      setGameResult({ result: 'draw', reason: 'agreement' });
      setShowResult(true);
    }
  }, []);

  const handleRematch = useCallback(() => {
    if (gameConfig) {
      handleStartGame({
        ...gameConfig,
        playerColor: gameConfig.playerColor === 'w' ? 'b' : 'w'
      });
    }
  }, [gameConfig, handleStartGame]);

  const handleNewGame = useCallback(() => {
    setGameConfig(null);
    setShowResult(false);
    setIsGameOver(false);
    setMoves([]);
  }, []);

  const isPlayerWhite = gameConfig?.playerColor === 'w';

  return (
    <PageLayout showFooter={false}>
      {/* Desktop: viewport-locked, no scroll. Mobile: natural scroll */}
      <div className="flex-1 lg:h-[calc(100vh-64px)] lg:overflow-hidden">
        <div className="w-full h-full flex flex-col lg:flex-row items-center lg:items-center justify-center gap-3 lg:gap-6 p-3 lg:p-4">
          
          {/* Coluna do Tabuleiro */}
          <div className="flex flex-col items-center shrink-0">
            {gameConfig && (
              <PlayerInfo
                avatar={isPlayerWhite ? gameConfig.bot.avatar : '👤'}
                name={isPlayerWhite ? gameConfig.bot.name : 'Você'}
                rating={isPlayerWhite ? gameConfig.bot.rating : 0}
                flagUrl={isPlayerWhite ? getFlagUrl(gameConfig.bot.country) : null}
                isBot={isPlayerWhite}
                time={isPlayerWhite ? blackTime : whiteTime}
                isActive={(isPlayerWhite ? currentTurn === 'b' : currentTurn === 'w') && !isGameOver}
              />
            )}

            {gameConfig ? (
              <ChessBoardGame
                key={gameKey}
                gameConfig={gameConfig}
                onMove={handleMove}
                onGameEnd={handleGameEnd}
                onTimeUpdate={handleTimeUpdate}
              />
            ) : (
              <div className="w-[280px] sm:w-[340px] md:w-[400px] lg:w-[min(500px,calc(100vh-140px))] aspect-square bg-surface-secondary/50 rounded-2xl border-4 border-gold/30 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-5xl mb-3">♟️</div>
                  <p className="text-base">Escolha um bot para começar</p>
                </div>
              </div>
            )}

            {gameConfig && (
              <PlayerInfo
                avatar={isPlayerWhite ? '👤' : gameConfig.bot.avatar}
                name={isPlayerWhite ? 'Você' : gameConfig.bot.name}
                rating={isPlayerWhite ? 0 : gameConfig.bot.rating}
                flagUrl={isPlayerWhite ? null : getFlagUrl(gameConfig.bot.country)}
                isBot={!isPlayerWhite}
                time={isPlayerWhite ? whiteTime : blackTime}
                isActive={(isPlayerWhite ? currentTurn === 'w' : currentTurn === 'b') && !isGameOver}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-auto shrink-0">
            {!gameConfig ? (
              <GameSetupSidebar onStartGame={handleStartGame} />
            ) : (
              <GameSidebar
                bot={gameConfig.bot}
                playerColor={gameConfig.playerColor}
                moves={moves}
                fen={fen}
                whiteTime={whiteTime}
                blackTime={blackTime}
                currentTurn={currentTurn}
                gameStarted={true}
                isGameOver={isGameOver}
                onResign={handleResign}
                onOfferDraw={handleOfferDraw}
                onNewGame={handleNewGame}
              />
            )}
          </div>
        </div>
      </div>

      <GameResultModal
        isOpen={showResult}
        result={gameResult.result}
        reason={gameResult.reason}
        bot={gameConfig?.bot}
        moves={moves}
        playerColor={gameConfig?.playerColor}
        onRematch={handleRematch}
        onNewGame={handleNewGame}
        onClose={() => setShowResult(false)}
      />
    </PageLayout>
  );
}

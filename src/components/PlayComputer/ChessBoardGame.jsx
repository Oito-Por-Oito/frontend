import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import { Chess } from "chess.js";
import { AnimatePresence, motion } from "framer-motion";
import createStockfish from "../../utils/stockfishLoader";
import { ThinkingIndicator, ThemedChessPiece } from "@/components/ui";
import { playMoveSound, playCaptureSound, playCheckSound } from "@/hooks/useSound";
import { useSettings } from "@/contexts/SettingsContext";

function ChessBoardGame({ 
  gameConfig,
  onMove,
  onGameEnd,
  onTimeUpdate
}) {
  const { bot, timeControl, playerColor } = gameConfig;
  
  const [game, setGame] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());
  const [moves, setMoves] = useState([]);
  const [engineReady, setEngineReady] = useState(false);
  const [isEngineThinking, setIsEngineThinking] = useState(false);
  
  // Tempos
  const [whiteTime, setWhiteTime] = useState(timeControl?.initialTime || 300);
  const [blackTime, setBlackTime] = useState(timeControl?.initialTime || 300);
  
  const { boardThemeConfig } = useSettings();
  const stockfishRef = useRef(null);
  const timerRef = useRef(null);
  
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMovesMap, setPossibleMovesMap] = useState({});
  const [lastMove, setLastMove] = useState({ from: null, to: null });

  const isPlayerTurn = game.turn() === playerColor;
  const isFlipped = playerColor === 'b';

  // Inicializar Stockfish
  useEffect(() => {
    setEngineReady(false);
    stockfishRef.current = createStockfish();
    
    if (!stockfishRef.current) {
      console.error("Erro ao criar Stockfish worker");
      return;
    }

    stockfishRef.current.postMessage("uci");

    const onMessage = (e) => {
      let msg = e.data;
      if (typeof msg !== "string" && msg && typeof msg.data === "string") {
        msg = msg.data;
      }

      if (msg === "uciok") {
        stockfishRef.current.postMessage(`setoption name Skill Level value ${bot?.stockfishLevel ?? 5}`);
        stockfishRef.current.postMessage("isready");
      } else if (msg === "readyok") {
        setEngineReady(true);
      } else if (typeof msg === "string" && msg.startsWith("bestmove")) {
        setIsEngineThinking(false);
        const move = msg.split(" ")[1];
        if (move && move !== "(none)") {
          executeMove(move.slice(0, 2), move.slice(2, 4), move.length > 4 ? move.charAt(4) : undefined, true);
        }
      }
    };

    stockfishRef.current.addEventListener("message", onMessage);

    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.removeEventListener("message", onMessage);
        stockfishRef.current.terminate();
      }
    };
  }, [bot?.stockfishLevel]);

  // Timer
  useEffect(() => {
    if (game.isGameOver()) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      const currentTurn = game.turn();
      
      if (currentTurn === 'w') {
        setWhiteTime(prev => {
          const newTime = Math.max(0, prev - 1);
          if (newTime === 0) {
            handleTimeout('w');
          }
          return newTime;
        });
      } else {
        setBlackTime(prev => {
          const newTime = Math.max(0, prev - 1);
          if (newTime === 0) {
            handleTimeout('b');
          }
          return newTime;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fen, game]);

  // Atualizar tempos no parent
  useEffect(() => {
    onTimeUpdate?.(whiteTime, blackTime);
  }, [whiteTime, blackTime, onTimeUpdate]);

  const handleTimeout = useCallback((losingColor) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const playerWins = losingColor !== playerColor;
    onGameEnd?.(playerWins ? 'win' : 'loss', 'timeout');
  }, [playerColor, onGameEnd]);

  const makeAIMove = useCallback(() => {
    if (!stockfishRef.current || !engineReady || game.isGameOver()) return;

    setIsEngineThinking(true);
    stockfishRef.current.postMessage(`position fen ${game.fen()}`);
    
    // Profundidade baseada no nível do bot
    const depth = Math.min(15, 5 + (bot?.stockfishLevel ?? 5));
    stockfishRef.current.postMessage(`go depth ${depth}`);
  }, [engineReady, game, bot?.stockfishLevel]);

  // Disparar jogada da AI quando for a vez dela
  useEffect(() => {
    if (!isPlayerTurn && engineReady && !game.isGameOver()) {
      const delay = 300 + Math.random() * 500; // Simular "pensamento"
      const timeout = setTimeout(() => makeAIMove(), delay);
      return () => clearTimeout(timeout);
    }
  }, [isPlayerTurn, engineReady, game, makeAIMove]);

  const executeMove = useCallback((from, to, promotion, isAIMove = false) => {
    try {
      const moveResult = game.move({ 
        from, 
        to, 
        promotion: promotion || 'q' 
      });

      if (moveResult) {
        // Aplicar incremento de tempo
        if (timeControl?.increment > 0) {
          if (moveResult.color === 'w') {
            setWhiteTime(prev => prev + timeControl.increment);
          } else {
            setBlackTime(prev => prev + timeControl.increment);
          }
        }

        // Som
        if (moveResult.captured) {
          playCaptureSound();
        } else if (game.inCheck()) {
          playCheckSound();
        } else {
          playMoveSound();
        }

        setLastMove({ from, to });
        setMoves(prev => [...prev, moveResult.san]);
        setFen(game.fen());
        setSelectedSquare(null);
        setPossibleMovesMap({});

        onMove?.(moveResult, game.fen(), [...moves, moveResult.san]);

        // Verificar fim de jogo
        if (game.isGameOver()) {
          if (timerRef.current) clearInterval(timerRef.current);
          
          if (game.isCheckmate()) {
            const winnerColor = game.turn() === 'w' ? 'b' : 'w';
            onGameEnd?.(winnerColor === playerColor ? 'win' : 'loss', 'checkmate');
          } else {
            onGameEnd?.('draw', game.isStalemate() ? 'stalemate' : 'repetition');
          }
        }

        return true;
      }
    } catch (err) {
      console.error("Erro ao executar movimento:", err);
    }
    return false;
  }, [game, timeControl, playerColor, moves, onMove, onGameEnd]);

  const handleSquareClick = useCallback((file, rank) => {
    if (!isPlayerTurn || game.isGameOver()) return;

    const square = `${file}${rank}`;

    if (!selectedSquare) {
      const piece = game.get(square);
      if (piece && piece.color === playerColor) {
        setSelectedSquare(square);
        const legalMoves = game.moves({ square, verbose: true });
        const moveInfo = {};
        legalMoves.forEach(m => {
          moveInfo[m.to] = { isCapture: !!m.captured };
        });
        setPossibleMovesMap(moveInfo);
      }
    } else {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMovesMap({});
      } else if (possibleMovesMap[square]) {
        executeMove(selectedSquare, square);
      } else {
        // Tentar selecionar outra peça
        const piece = game.get(square);
        if (piece && piece.color === playerColor) {
          setSelectedSquare(square);
          const legalMoves = game.moves({ square, verbose: true });
          const moveInfo = {};
          legalMoves.forEach(m => {
            moveInfo[m.to] = { isCapture: !!m.captured };
          });
          setPossibleMovesMap(moveInfo);
        } else {
          setSelectedSquare(null);
          setPossibleMovesMap({});
        }
      }
    }
  }, [isPlayerTurn, game, playerColor, selectedSquare, possibleMovesMap, executeMove]);

  const renderPiece = useCallback((piece, coord) => {
    if (!piece) return null;
    return (
      <ThemedChessPiece 
        piece={piece}
        size="xl"
        animated={true}
        layoutId={coord + "-" + piece.color + piece.type.toUpperCase()}
        shadow={true}
      />
    );
  }, []);

  // Gerar tabuleiro (com inversão se jogando de pretas)
  const boardSquares = useMemo(() => {
    const squares = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

    const orderedFiles = isFlipped ? [...files].reverse() : files;
    const orderedRanks = isFlipped ? [...ranks].reverse() : ranks;

    for (const rank of orderedRanks) {
      for (const file of orderedFiles) {
        const square = `${file}${rank}`;
        const piece = game.get(square);
        const fileIndex = files.indexOf(file);
        const rankIndex = 8 - rank;
        const isLight = (fileIndex + rankIndex) % 2 === 0;
        
        squares.push({
          square,
          file,
          rank,
          piece,
          isLight
        });
      }
    }

    return squares;
  }, [fen, isFlipped, game]);

  const fileLabels = isFlipped 
    ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
    : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const rankLabels = isFlipped
    ? [1, 2, 3, 4, 5, 6, 7, 8]
    : [8, 7, 6, 5, 4, 3, 2, 1];

  return (
    <div className="relative">
      <div className="grid grid-cols-8 w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[min(500px,calc(100vh-140px))] aspect-square border-4 border-gold rounded-2xl shadow-2xl overflow-hidden">
        {boardSquares.map(({ square, file, rank, piece, isLight }) => {
          const isSelected = selectedSquare === square;
          const isLastMoveFrom = square === lastMove.from;
          const isLastMoveTo = square === lastMove.to;
          const move = possibleMovesMap[square];
          const isMoveOption = move !== undefined;
          const isCapture = move?.isCapture;

          return (
            <motion.div
              key={square}
              onClick={() => handleSquareClick(file, rank)}
              style={{ 
                backgroundColor: isLight ? boardThemeConfig.light : boardThemeConfig.dark 
              }}
              className={`
                aspect-square relative flex items-center justify-center text-3xl 
                cursor-pointer select-none transition-all duration-100
                ${isLastMoveFrom || isLastMoveTo ? "ring-4 ring-inset ring-yellow-400/60" : ""}
                ${isSelected ? "ring-4 ring-gold z-10" : ""}
              `}
              whileHover={{ filter: 'brightness(1.1)' }}
            >
              {isMoveOption && !isCapture && (
                <div className="absolute w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full bg-black/30 z-10" />
              )}
              {isMoveOption && isCapture && (
                <div className="absolute w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border-[3px] border-red-500/70 z-10" />
              )}
              {renderPiece(piece, square)}
            </motion.div>
          );
        })}
      </div>

      {/* Thinking Indicator */}
      <AnimatePresence>
        <ThinkingIndicator isVisible={isEngineThinking} message={`${bot?.name || 'Bot'} pensando...`} />
      </AnimatePresence>

      {/* Coordenadas */}
      <div className="absolute bottom-[-24px] left-0 w-full grid grid-cols-8 text-center text-sm text-muted-foreground font-medium">
        {fileLabels.map(letter => (
          <div key={letter}>{letter.toUpperCase()}</div>
        ))}
      </div>

      <div className="absolute top-0 left-[-22px] h-full grid grid-rows-8 text-sm text-muted-foreground font-medium">
        {rankLabels.map(num => (
          <div key={num} className="flex items-center justify-center h-full">
            {num}
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ChessBoardGame);

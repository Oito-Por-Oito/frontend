import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import { Chess } from "chess.js";
import { AnimatePresence } from "framer-motion";
import createStockfish from "../../utils/stockfishLoader";
import { ThinkingIndicator, ThemedChessPiece } from "@/components/ui";
import { playMoveSound, playCaptureSound, playCheckSound } from "@/hooks/useSound";
import { useSettings } from "@/contexts/SettingsContext";

function ChessBoard({ stockfishLevel, gameStarted, setParentGame, setParentLog }) {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [engineReady, setEngineReady] = useState(false);
  const [isEngineThinking, setIsEngineThinking] = useState(false);
  const [log, setLog] = useState([]);

  // Obter cores do tabuleiro do contexto
  const { boardThemeConfig } = useSettings();

  const stockfishRef = useRef(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMovesMap, setPossibleMovesMap] = useState({});
  const [lastMove, setLastMove] = useState({ from: null, to: null });

  const addLog = useCallback((text) => {
    setLog((prev) => [...prev, text]);
  }, []);

  useEffect(() => {
    if (setParentGame) setParentGame(game);
  }, [game, setParentGame]);
  
  useEffect(() => {
    if (setParentLog) setParentLog(log);
  }, [log, setParentLog]);

  useEffect(() => {
    if (!gameStarted) return;

    setEngineReady(false);
    stockfishRef.current = createStockfish();
    if (!stockfishRef.current) {
      addLog("Erro ao criar o Stockfish worker.");
      return;
    }
    stockfishRef.current.postMessage("uci");

    const onMessage = (e) => {
      let msg = e.data;
      if (typeof msg !== "string" && msg && typeof msg.data === "string") {
        msg = msg.data;
      }

      if (typeof msg === "string" && !msg.startsWith("info") && msg !== "readyok") {
        addLog(`[Stockfish] ${JSON.stringify(msg)}`);
      }

      if (msg === "uciok") {
        addLog("UCI inicializado, configurando nível...");
        stockfishRef.current.postMessage(`setoption name Skill Level value ${stockfishLevel}`);
        stockfishRef.current.postMessage("isready");
      } else if (msg === "readyok") {
        setEngineReady(true);
        addLog("Engine pronta!");
      } else if (typeof msg === "string" && msg.startsWith("bestmove")) {
        setIsEngineThinking(false);
        const move = msg.split(" ")[1];
        if (move && move !== "(none)") {
          addLog(`Engine decidiu jogar: ${move}`);
          try {
            const from = move.slice(0, 2);
            const to = move.slice(2, 4);
            const promotion = move.length > 4 ? move.charAt(4) : undefined;

            const moveResult = game.move({
              from,
              to,
              promotion: promotion || "q",
            });

            if (moveResult) {
              // Tocar som apropriado
              if (moveResult.captured) {
                playCaptureSound();
              } else if (game.inCheck()) {
                playCheckSound();
              } else {
                playMoveSound();
              }
              
              setLastMove({ from, to });
              setFen(game.fen());
              setIsUserTurn(true);
              setSelectedSquare(null);
              setPossibleMovesMap({});
              addLog(`Engine jogou: ${from}${to}`);
            } else {
              addLog(`Erro: movimento inválido ${from}${to}`);
            }
          } catch (err) {
            addLog(`Erro ao processar movimento da engine: ${err.message}`);
          }
        } else {
          addLog("A engine não encontrou um movimento válido.");
        }
      }
    };

    stockfishRef.current.addEventListener("message", onMessage);

    return () => {
      stockfishRef.current.removeEventListener("message", onMessage);
      stockfishRef.current.terminate();
    };
    // eslint-disable-next-line
  }, [stockfishLevel, gameStarted, addLog]);

  // Safety timeout: if engine takes too long, reset thinking state
  useEffect(() => {
    if (isEngineThinking) {
      const timeout = setTimeout(() => {
        addLog("Engine demorou muito, aguardando...");
        setIsEngineThinking(false);
      }, 15000); // 15 seconds timeout
      return () => clearTimeout(timeout);
    }
  }, [isEngineThinking, addLog]);

  const makeAIMove = useCallback(() => {
    if (!stockfishRef.current) {
      addLog("Engine não inicializada. Tentando reiniciar...");
      stockfishRef.current = createStockfish();
      if (!stockfishRef.current) {
        addLog("Falha ao inicializar a engine.");
        return;
      }
      stockfishRef.current.postMessage("uci");
      setTimeout(() => makeAIMove(), 500);
      return;
    }

    if (!engineReady) {
      addLog("Engine ainda não pronta... Aguardando inicialização.");
      stockfishRef.current.postMessage("isready");
      setTimeout(() => makeAIMove(), 500);
      return;
    }

    const currentFen = game.fen();
    setIsEngineThinking(true);
    addLog("Engine pensando...");
    stockfishRef.current.postMessage(`position fen ${currentFen}`);
    stockfishRef.current.postMessage("go depth 15");
  }, [engineReady, game, addLog]);

  const handleMove = useCallback((from, to) => {
    try {
      const move = game.move({ from, to, promotion: "q" });
      if (move) {
        // Tocar som apropriado
        if (move.captured) {
          playCaptureSound();
        } else if (game.inCheck()) {
          playCheckSound();
        } else {
          playMoveSound();
        }
        
        setLastMove({ from, to });
        setFen(game.fen());
        setIsUserTurn(false);
        addLog(`Você jogou: ${from}${to}`);
        setTimeout(() => makeAIMove(), 300);
      } else {
        addLog("Movimento inválido.");
      }
    } catch (err) {
      addLog("Erro: " + err.message);
    }
  }, [game, addLog, makeAIMove]);

  const handleSquareClick = useCallback((x, y) => {
    if (!gameStarted || !isUserTurn || game.isGameOver()) return;
    const square = "abcdefgh"[x] + (8 - y);

    if (!selectedSquare) {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        const moveInfo = {};
        moves.forEach((m) => {
          moveInfo[m.to] = { isCapture: !!m.captured };
        });
        setPossibleMovesMap(moveInfo);
      }
    } else {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMovesMap({});
      } else {
        const isLegal = possibleMovesMap[square];
        if (isLegal) {
          handleMove(selectedSquare, square);
        }
        setSelectedSquare(null);
        setPossibleMovesMap({});
      }
    }
  }, [gameStarted, isUserTurn, game, selectedSquare, possibleMovesMap, handleMove]);

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

  // Memoize board data to prevent recalculation
  const boardData = useMemo(() => {
    return game.board().flat();
  }, [fen]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderBoard = () => {
    return (
      <div className="relative">
        <div className="grid grid-cols-8 w-full max-w-[320px] sm:max-w-[380px] md:max-w-[650px] aspect-square border-4 border-gold rounded-2xl shadow-2xl overflow-hidden">
          {boardData.map((square, idx) => {
            const x = idx % 8;
            const y = Math.floor(idx / 8);
            const isLight = (x + (8 - y)) % 2 === 0;
            const coord = "abcdefgh"[x] + (8 - y);
            const isSelected = selectedSquare === coord;
            const isLastMoveFrom = coord === lastMove.from;
            const isLastMoveTo = coord === lastMove.to;
            const move = possibleMovesMap[coord];
            const isMoveOption = move !== undefined;
            const isCapture = move?.isCapture;

            return (
              <div
                key={coord}
                onClick={() => handleSquareClick(x, y)}
                style={{ 
                  backgroundColor: isLight ? boardThemeConfig.light : boardThemeConfig.dark 
                }}
                className={`aspect-square relative flex items-center justify-center text-3xl cursor-pointer select-none transition-all duration-100
                  ${isLastMoveFrom || isLastMoveTo ? "border-4 border-yellow-500/50" : "border-0"}
                  ${isSelected ? "ring-4 ring-yellow-400 z-10" : "ring-0"}
                `}
              >
                {isMoveOption && !isCapture && (
                  <div className="absolute w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full bg-black/30 z-10" />
                )}
                {isMoveOption && isCapture && (
                  <div className="absolute w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border-[3px] border-red-500/70 z-10" />
                )}
                {renderPiece(square, coord)}
              </div>
            );
          })}
        </div>

        {/* Thinking Indicator Overlay */}
        <AnimatePresence>
          <ThinkingIndicator isVisible={isEngineThinking} message="Engine pensando..." />
        </AnimatePresence>

        {/* Horizontal notation A-H */}
        <div className="absolute bottom-[-24px] left-0 w-full grid grid-cols-8 text-center text-sm text-white/70 font-medium">
          {"abcdefgh".split("").map((letter) => (
            <div key={letter}>{letter.toUpperCase()}</div>
          ))}
        </div>

        {/* Vertical notation 8-1 */}
        <div className="absolute top-0 left-[-20px] h-full grid grid-rows-8 text-sm text-white/70 font-medium">
          {[8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
            <div key={num} className="flex items-center justify-center h-full">
              {num}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {renderBoard()}
    </div>
  );
}

export default memo(ChessBoard);
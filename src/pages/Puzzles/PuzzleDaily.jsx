import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Share2, Flame, ChevronLeft, Trophy, Lightbulb, RotateCcw } from 'lucide-react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useDailyPuzzle } from '@/hooks/useDailyPuzzle';
import { useAuth } from '@/contexts/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const DIFFICULTY_COLOR = {
  easy: 'text-green-400 bg-green-400/10 border-green-400/30',
  medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  hard: 'text-red-400 bg-red-400/10 border-red-400/30',
  expert: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
};
const DIFFICULTY_LABEL = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil', expert: 'Expert' };

// ─────────────────────────────────────────────────────────────────────────────
// Week calendar strip
// ─────────────────────────────────────────────────────────────────────────────
function WeekStrip({ days }) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((d) => (
        <div key={d.date} className="text-center">
          <div className="text-xs text-muted-foreground mb-1">{d.label}</div>
          <div
            className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium
              ${d.isToday
                ? 'bg-gold/20 text-gold border border-gold/40'
                : d.solved === true
                ? 'bg-green-500/20 text-green-400'
                : d.solved === false
                ? 'bg-red-500/10 text-red-400'
                : 'bg-surface-tertiary text-muted-foreground'
              }`}
          >
            {d.solved === true ? '✓' : d.solved === false ? '✗' : d.isToday ? '?' : ''}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Puzzle board (interactive)
// ─────────────────────────────────────────────────────────────────────────────
function PuzzleBoard({ puzzle, onSolved, onFailed }) {
  const [chess] = useState(() => {
    const c = new Chess();
    c.load(puzzle.fen);
    return c;
  });
  const [fen, setFen] = useState(puzzle.fen);
  const [status, setStatus] = useState('playing'); // 'playing' | 'correct' | 'wrong' | 'solved'
  const [moveIndex, setMoveIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [highlightSquares, setHighlightSquares] = useState({});
  const solvedRef = useRef(false);

  const boardOrientation = puzzle.player_to_move === 'black' ? 'black' : 'white';

  const handlePieceDrop = useCallback(
    (sourceSquare, targetSquare) => {
      if (status !== 'playing' || solvedRef.current) return false;

      const expectedUCI = puzzle.solution[moveIndex];
      const madeUCI = `${sourceSquare}${targetSquare}`;
      const isCorrect = madeUCI === expectedUCI || madeUCI.startsWith(expectedUCI.slice(0, 4));

      if (isCorrect) {
        try {
          chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
        } catch {
          return false;
        }
        const newFen = chess.fen();
        setFen(newFen);
        setHighlightSquares({
          [sourceSquare]: { background: 'rgba(34,197,94,0.3)' },
          [targetSquare]: { background: 'rgba(34,197,94,0.5)' },
        });
        setShowHint(false);

        const nextIndex = moveIndex + 1;
        if (nextIndex >= puzzle.solution.length) {
          solvedRef.current = true;
          setStatus('solved');
          setTimeout(() => onSolved(hintsUsed, attemptsCount + 1), 600);
        } else {
          setStatus('correct');
          setMoveIndex(nextIndex);
          setTimeout(() => {
            setStatus('playing');
            setHighlightSquares({});
          }, 700);
        }
        return true;
      } else {
        // Wrong move
        const newAttempts = attemptsCount + 1;
        setAttemptsCount(newAttempts);
        setStatus('wrong');
        setHighlightSquares({
          [sourceSquare]: { background: 'rgba(239,68,68,0.3)' },
          [targetSquare]: { background: 'rgba(239,68,68,0.3)' },
        });
        setTimeout(() => {
          chess.load(puzzle.fen);
          setFen(puzzle.fen);
          setMoveIndex(0);
          setStatus('playing');
          setHighlightSquares({});
        }, 900);
        return false;
      }
    },
    [chess, puzzle, moveIndex, status, hintsUsed, attemptsCount, onSolved]
  );

  const handleHint = () => {
    if (hintsUsed >= 3 || status !== 'playing') return;
    const newHints = hintsUsed + 1;
    setHintsUsed(newHints);
    setShowHint(true);
    // Highlight the hint squares
    const from = puzzle.solution[moveIndex]?.slice(0, 2);
    const to = puzzle.solution[moveIndex]?.slice(2, 4);
    if (from && to) {
      setHighlightSquares({
        [from]: { background: 'rgba(212,168,67,0.4)' },
        [to]: { background: 'rgba(212,168,67,0.4)' },
      });
    }
  };

  const handleReset = () => {
    chess.load(puzzle.fen);
    setFen(puzzle.fen);
    setMoveIndex(0);
    setStatus('playing');
    setHighlightSquares({});
    setShowHint(false);
  };

  const currentSolution = puzzle.solution?.[moveIndex];
  const hintFrom = currentSolution?.slice(0, 2)?.toUpperCase();
  const hintTo = currentSolution?.slice(2, 4)?.toUpperCase();
  const sanHint = puzzle.solution_san?.[moveIndex];

  const boardBorderColor =
    status === 'solved' || status === 'correct'
      ? 'border-green-500/60'
      : status === 'wrong'
      ? 'border-red-500/60'
      : 'border-gold/20';

  return (
    <div className="space-y-4">
      {/* Puzzle info */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-foreground text-lg">{puzzle.title}</h2>
          {puzzle.description && (
            <p className="text-sm text-muted-foreground mt-1">{puzzle.description}</p>
          )}
          <p className="text-sm text-foreground mt-2 font-medium">
            {puzzle.player_to_move === 'white' ? '⬜ Brancas jogam' : '⬛ Pretas jogam'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${DIFFICULTY_COLOR[puzzle.difficulty]}`}>
            {DIFFICULTY_LABEL[puzzle.difficulty]}
          </span>
          <span className="text-xs text-muted-foreground bg-surface-tertiary px-2 py-1 rounded-full border border-gold/10">
            ⭐ {puzzle.rating}
          </span>
        </div>
      </div>

      {/* Status banner */}
      <AnimatePresence>
        {status !== 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-center border
              ${status === 'solved' || status === 'correct'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
          >
            {status === 'solved'
              ? '🎉 Puzzle resolvido!'
              : status === 'correct'
              ? '✓ Bom lance! Continue...'
              : '✗ Lance incorreto — tente novamente'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board */}
      <div className={`rounded-xl overflow-hidden border-2 transition-colors ${boardBorderColor}`}>
        <Chessboard
          position={fen}
          onPieceDrop={handlePieceDrop}
          boardOrientation={boardOrientation}
          customSquareStyles={highlightSquares}
          customBoardStyle={{ borderRadius: '0' }}
          customDarkSquareStyle={{ backgroundColor: '#769656' }}
          customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
          animationDuration={200}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 flex items-center justify-center gap-1.5"
          onClick={handleHint}
          disabled={hintsUsed >= 3 || status !== 'playing'}
        >
          <Lightbulb size={14} />
          Dica {hintsUsed > 0 ? `(${hintsUsed}/3)` : ''}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center gap-1.5 px-3"
          onClick={handleReset}
          title="Reiniciar posição"
        >
          <RotateCcw size={14} />
        </Button>
        <div className="flex-1 flex items-center justify-center bg-surface-tertiary rounded-lg border border-gold/10 text-xs text-muted-foreground">
          🔄 {attemptsCount} tentativa{attemptsCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Hint box */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gold/5 border border-gold/30 rounded-xl px-4 py-3 text-sm text-gold"
          >
            💡 Mova a peça de{' '}
            <span className="font-bold">{hintFrom}</span>
            {' '}para{' '}
            <span className="font-bold">{hintTo}</span>
            {sanHint ? ` (${sanHint})` : ''}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Themes */}
      {puzzle.theme?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {puzzle.theme.map(t => (
            <span
              key={t}
              className="text-xs text-muted-foreground bg-surface-tertiary px-2 py-1 rounded-full border border-gold/10"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Solved result card
// ─────────────────────────────────────────────────────────────────────────────
function SolvedCard({ puzzle, streak, hintsUsed, attemptsCount, onShare }) {
  const stars = hintsUsed === 0 ? '⭐⭐⭐' : hintsUsed === 1 ? '⭐⭐' : hintsUsed === 2 ? '⭐' : '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-4"
    >
      <div className="text-5xl">🎉</div>
      <div>
        <h3 className="text-xl font-bold text-green-400">Puzzle Resolvido!</h3>
        <p className="text-muted-foreground text-sm mt-1">
          {stars || 'Resolvido com dicas'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface-tertiary rounded-xl p-3 border border-gold/10">
          <div className="text-2xl font-bold text-gold">{streak}</div>
          <div className="text-xs text-muted-foreground">🔥 Sequência</div>
        </div>
        <div className="bg-surface-tertiary rounded-xl p-3 border border-gold/10">
          <div className="text-2xl font-bold text-foreground">{attemptsCount}</div>
          <div className="text-xs text-muted-foreground">Tentativas</div>
        </div>
        <div className="bg-surface-tertiary rounded-xl p-3 border border-gold/10">
          <div className="text-2xl font-bold text-foreground">{hintsUsed}</div>
          <div className="text-xs text-muted-foreground">Dicas</div>
        </div>
      </div>

      <Button
        variant="primary"
        size="md"
        className="w-full flex items-center justify-center gap-2"
        onClick={onShare}
      >
        <Share2 size={16} /> Compartilhar Resultado
      </Button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export default function PuzzleDaily() {
  const { user } = useAuth();
  const { puzzle, attempt, streak, weekDays, loading, error, recordAttempt } = useDailyPuzzle();
  const [solvedInfo, setSolvedInfo] = useState(null);

  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // If already solved today, show solved state immediately
  useEffect(() => {
    if (attempt?.solved) {
      setSolvedInfo({ hintsUsed: attempt.hints_used, attemptsCount: attempt.attempts_count });
    }
  }, [attempt]);

  const handleSolved = useCallback(
    async (hintsUsed, attemptsCount) => {
      setSolvedInfo({ hintsUsed, attemptsCount });
      if (user) {
        await recordAttempt({ solved: true, failed: false, hintsUsed, attemptsCount });
      }
    },
    [user, recordAttempt]
  );

  const handleShare = useCallback(async () => {
    if (!puzzle || !solvedInfo) return;
    const stars =
      solvedInfo.hintsUsed === 0 ? '⭐⭐⭐'
      : solvedInfo.hintsUsed === 1 ? '⭐⭐'
      : solvedInfo.hintsUsed === 2 ? '⭐'
      : '✓';
    const dateLabel = new Date(puzzle.puzzle_date + 'T12:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
    const text =
      `🧩 Puzzle Diário OitoPorOito — ${dateLabel}\n` +
      `${stars} ${DIFFICULTY_LABEL[puzzle.difficulty]} (${puzzle.rating})\n` +
      `Tentativas: ${solvedInfo.attemptsCount} | Dicas: ${solvedInfo.hintsUsed}\n` +
      `🔥 Sequência: ${streak} dias\n` +
      `\nJogue em oitoporoito.com`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Resultado copiado para a área de transferência!');
    } catch {
      alert(text);
    }
  }, [puzzle, solvedInfo, streak]);

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-6xl mb-4">📅</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gold mb-2">Puzzle do Dia</h1>
            <p className="text-muted-foreground text-sm capitalize">{dateStr}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Carregando puzzle do dia...</p>
          </div>
        ) : error || !puzzle ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">😕</div>
            <h2 className="text-xl font-bold text-foreground mb-2">Puzzle indisponível</h2>
            <p className="text-muted-foreground text-sm">{error ?? 'Não foi possível carregar o puzzle de hoje.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main board column */}
            <div className="lg:col-span-2">
              <Card variant="gradient" className="border border-gold/30">
                {solvedInfo ? (
                  <SolvedCard
                    puzzle={puzzle}
                    streak={streak}
                    hintsUsed={solvedInfo.hintsUsed}
                    attemptsCount={solvedInfo.attemptsCount}
                    onShare={handleShare}
                  />
                ) : (
                  <PuzzleBoard
                    key={puzzle.puzzle_id}
                    puzzle={puzzle}
                    onSolved={handleSolved}
                    onFailed={() => {}}
                  />
                )}
              </Card>

              {/* Login prompt */}
              {!user && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <Card variant="gradient" className="border border-gold/20 text-center">
                    <p className="text-sm text-muted-foreground">
                      <a href="/login" className="text-gold hover:underline font-semibold">Faça login</a>
                      {' '}para salvar sua sequência e acompanhar seu progresso!
                    </p>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Streak */}
              <Card variant="gradient" className="text-center border border-gold/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame size={20} className="text-orange-400" />
                  <span className="text-3xl font-bold text-gold">{streak}</span>
                </div>
                <div className="text-sm text-muted-foreground">dias seguidos</div>
                {streak === 0 && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    Resolva o puzzle de hoje para começar sua sequência!
                  </div>
                )}
                {streak > 0 && (
                  <div className="mt-3 text-xs text-green-400 font-medium">
                    Incrível! Continue assim 💪
                  </div>
                )}
              </Card>

              {/* Week calendar */}
              <Card variant="gradient">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-gold" /> Esta Semana
                </h3>
                <WeekStrip days={weekDays} />
              </Card>

              {/* Puzzle info summary */}
              {puzzle && (
                <Card variant="gradient" className="border border-gold/20">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Trophy size={16} className="text-gold" /> Sobre este Puzzle
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dificuldade</span>
                      <span className={`font-semibold ${
                        puzzle.difficulty === 'easy' ? 'text-green-400' :
                        puzzle.difficulty === 'medium' ? 'text-amber-400' :
                        puzzle.difficulty === 'hard' ? 'text-red-400' : 'text-purple-400'
                      }`}>
                        {DIFFICULTY_LABEL[puzzle.difficulty]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="text-foreground font-semibold">⭐ {puzzle.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jogam</span>
                      <span className="text-foreground">
                        {puzzle.player_to_move === 'white' ? '⬜ Brancas' : '⬛ Pretas'}
                      </span>
                    </div>
                  </div>
                  {puzzle.theme?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {puzzle.theme.map(t => (
                        <span key={t} className="text-xs text-muted-foreground bg-surface-tertiary px-2 py-0.5 rounded-full border border-gold/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* Share */}
              <Card variant="gradient">
                <h3 className="font-bold text-foreground mb-3">Compartilhar</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {solvedInfo
                    ? 'Compartilhe seu resultado com amigos!'
                    : 'Resolva o puzzle para compartilhar seu resultado.'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={!solvedInfo}
                  onClick={handleShare}
                >
                  <Share2 size={14} /> Compartilhar Resultado
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

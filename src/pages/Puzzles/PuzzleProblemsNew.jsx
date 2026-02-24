import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useNavigate } from 'react-router-dom';
import {
  Target, Filter, ChevronRight, Check, X, Lightbulb,
  Timer, Share2, RotateCcw, ArrowRight, Star, TrendingUp,
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import {
  usePuzzleProblems,
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  THEME_LABELS,
} from '@/hooks/usePuzzleProblems';

const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];
const THEMES = Object.keys(THEME_LABELS);

// ─────────────────────────────────────────────────────────────────────────────
// Timer hook
// ─────────────────────────────────────────────────────────────────────────────
function useTimer(running) {
  const [secs, setSecs] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSecs(s => s + 1), 1000);
    } else if (ref.current) {
      clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);
  const reset = () => setSecs(0);
  return { secs, reset };
}

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats bar
// ─────────────────────────────────────────────────────────────────────────────
function StatsBar({ stats }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {[
        { label: 'Rating', value: stats.puzzle_rating, color: 'text-gold' },
        { label: 'Resolvidos', value: stats.total_solved, color: 'text-green-400' },
        { label: 'Precisão', value: stats.accuracy_pct != null ? `${stats.accuracy_pct}%` : '—', color: 'text-foreground' },
        { label: 'Tempo médio', value: stats.avg_time_secs != null ? `${Math.round(stats.avg_time_secs)}s` : '—', color: 'text-blue-400' },
      ].map(({ label, value, color }) => (
        <div key={label} className="bg-surface-secondary rounded-xl p-3 text-center border border-gold/10">
          <div className={`text-xl font-bold ${color}`}>{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Puzzle board (interactive)
// ─────────────────────────────────────────────────────────────────────────────
function PuzzleBoard({ puzzle, onSolved, onFailed }) {
  const [chess] = useState(() => { const c = new Chess(); c.load(puzzle.fen); return c; });
  const [fen, setFen] = useState(puzzle.fen);
  const [status, setStatus] = useState('playing'); // playing | correct | wrong | solved
  const [moveIndex, setMoveIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [hintSquare, setHintSquare] = useState(null);
  const [flashWrong, setFlashWrong] = useState(false);
  const { secs } = useTimer(status === 'playing');

  const handleMove = useCallback((sourceSquare, targetSquare) => {
    if (status !== 'playing') return false;

    const expectedUCI = puzzle.solution[moveIndex];
    const madeUCI = `${sourceSquare}${targetSquare}`;
    const isCorrect = madeUCI === expectedUCI || madeUCI === expectedUCI.slice(0, 4);

    if (isCorrect) {
      const result = chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      if (!result) return false;
      setFen(chess.fen());
      setHintSquare(null);

      const nextIndex = moveIndex + 1;
      if (nextIndex >= puzzle.solution.length) {
        setStatus('solved');
        onSolved({ hintsUsed, attemptsCount: attemptsCount + 1, timeSecs: secs });
      } else {
        setMoveIndex(nextIndex);
        setStatus('correct');
        setTimeout(() => setStatus('playing'), 600);

        // Play opponent's response
        const opponentUCI = puzzle.solution[nextIndex];
        if (opponentUCI) {
          setTimeout(() => {
            const from = opponentUCI.slice(0, 2);
            const to = opponentUCI.slice(2, 4);
            const promo = opponentUCI[4] ?? 'q';
            chess.move({ from, to, promotion: promo });
            setFen(chess.fen());
            setMoveIndex(nextIndex + 1);
          }, 700);
        }
      }
      return true;
    } else {
      setFlashWrong(true);
      setAttemptsCount(a => a + 1);
      setTimeout(() => {
        chess.load(puzzle.fen);
        setFen(puzzle.fen);
        setMoveIndex(0);
        setHintSquare(null);
        setFlashWrong(false);
        setStatus('playing');
      }, 900);
      return false;
    }
  }, [chess, puzzle, moveIndex, status, hintsUsed, attemptsCount, secs, onSolved]);

  const handleHint = () => {
    if (hintsUsed >= 3 || status !== 'playing') return;
    const move = puzzle.solution[moveIndex];
    setHintSquare(move ? move.slice(0, 2) : null);
    setHintsUsed(h => h + 1);
  };

  const handleGiveUp = () => {
    setStatus('wrong');
    onFailed();
  };

  const boardBorder = status === 'solved' ? '2px solid #22c55e'
    : flashWrong ? '2px solid #ef4444'
    : status === 'correct' ? '2px solid #22c55e'
    : '2px solid transparent';

  const customSquareStyles = {};
  if (hintSquare) {
    customSquareStyles[hintSquare] = { backgroundColor: 'rgba(212,168,67,0.5)' };
  }

  return (
    <div>
      {/* Puzzle info */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">{puzzle.title}</h2>
          {puzzle.description && (
            <p className="text-sm text-muted-foreground mt-1">{puzzle.description}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className="text-xs font-semibold px-2 py-1 rounded-md"
            style={{
              backgroundColor: `${DIFFICULTY_COLORS[puzzle.difficulty]}22`,
              color: DIFFICULTY_COLORS[puzzle.difficulty],
            }}
          >
            {DIFFICULTY_LABELS[puzzle.difficulty]}
          </span>
          <span className="text-xs text-gold">★ {puzzle.rating}</span>
        </div>
      </div>

      {/* Status + timer */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className="text-muted-foreground">
          {puzzle.player_to_move === 'white' ? '⬜ Brancas jogam' : '⬛ Pretas jogam'}
        </span>
        <span className="text-gold font-semibold flex items-center gap-1">
          <Timer size={14} /> {fmtTime(secs)}
        </span>
      </div>

      {/* Board */}
      <div style={{ border: boardBorder, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}>
        <Chessboard
          position={fen}
          onPieceDrop={handleMove}
          boardOrientation={puzzle.player_to_move === 'black' ? 'black' : 'white'}
          customBoardStyle={{ borderRadius: 0 }}
          customSquareStyles={customSquareStyles}
          customDarkSquareStyle={{ backgroundColor: '#769656' }}
          customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
          arePiecesDraggable={status === 'playing'}
        />
      </div>

      {/* Hint text */}
      {hintSquare && (
        <div className="mt-2 text-center text-sm text-gold">
          💡 Dica: mova a peça em <strong>{hintSquare.toUpperCase()}</strong>
        </div>
      )}

      {/* Solved banner */}
      {status === 'solved' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
        >
          <p className="text-green-400 font-bold text-lg">✓ Puzzle Resolvido!</p>
          <p className="text-muted-foreground text-sm mt-1">
            Tempo: {fmtTime(secs)} · {hintsUsed > 0 ? `${hintsUsed} dica${hintsUsed > 1 ? 's' : ''}` : 'Sem dicas'}
          </p>
        </motion.div>
      )}

      {/* Controls */}
      {status !== 'solved' && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleHint}
            disabled={hintsUsed >= 3 || status !== 'playing'}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-secondary border border-gold/20 text-gold text-sm font-medium hover:bg-gold/10 transition-colors disabled:opacity-40"
          >
            <Lightbulb size={15} /> Dica ({3 - hintsUsed})
          </button>
          <button
            onClick={handleGiveUp}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-secondary border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
          >
            <X size={15} /> Desistir
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter panel
// ─────────────────────────────────────────────────────────────────────────────
function FilterPanel({ filters, onApply, onClose }) {
  const [diff, setDiff] = useState(filters.difficulty ?? null);
  const [selThemes, setSelThemes] = useState(filters.themes ?? []);

  const toggleTheme = (t) => {
    setSelThemes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  return (
    <div className="bg-surface-secondary rounded-2xl border border-gold/20 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground">Filtros</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>
      </div>

      {/* Difficulty */}
      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Dificuldade</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {DIFFICULTIES.map(d => {
          const color = DIFFICULTY_COLORS[d];
          const selected = diff === d;
          return (
            <button
              key={d}
              onClick={() => setDiff(selected ? null : d)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-all"
              style={{
                backgroundColor: selected ? `${color}22` : 'transparent',
                borderColor: selected ? color : 'rgba(212,168,67,0.2)',
                color: selected ? color : '#888',
              }}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          );
        })}
      </div>

      {/* Themes */}
      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Temas</p>
      <div className="flex flex-wrap gap-2 mb-5 max-h-32 overflow-y-auto">
        {THEMES.map(t => {
          const selected = selThemes.includes(t);
          return (
            <button
              key={t}
              onClick={() => toggleTheme(t)}
              className="px-2.5 py-1 rounded-lg text-xs border transition-all"
              style={{
                backgroundColor: selected ? 'rgba(212,168,67,0.15)' : 'transparent',
                borderColor: selected ? '#d4a843' : 'rgba(212,168,67,0.2)',
                color: selected ? '#d4a843' : '#888',
              }}
            >
              {THEME_LABELS[t]}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => { setDiff(null); setSelThemes([]); onApply({}); onClose(); }}
          className="flex-1 py-2.5 rounded-xl bg-surface-primary border border-gold/20 text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          Limpar
        </button>
        <button
          onClick={() => { onApply({ difficulty: diff ?? undefined, themes: selThemes.length ? selThemes : undefined }); onClose(); }}
          className="flex-2 flex-1 py-2.5 rounded-xl bg-gold text-surface-primary font-bold text-sm hover:bg-gold/90 transition-colors"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Puzzle list item
// ─────────────────────────────────────────────────────────────────────────────
function PuzzleListItem({ puzzle, onSelect }) {
  const diffColor = DIFFICULTY_COLORS[puzzle.difficulty] ?? '#888';
  return (
    <button
      onClick={() => onSelect(puzzle)}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-secondary hover:bg-surface-secondary/80 border border-gold/10 hover:border-gold/30 transition-all text-left"
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: puzzle.user_solved ? 'rgba(34,197,94,0.15)' : '#1a1a1a' }}
      >
        {puzzle.user_solved ? '✓' : puzzle.user_attempts ? '↺' : '♟'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">{puzzle.title}</span>
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
            style={{ backgroundColor: `${diffColor}22`, color: diffColor }}
          >
            {DIFFICULTY_LABELS[puzzle.difficulty]}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gold">★ {puzzle.rating}</span>
          <span className="text-xs text-muted-foreground">
            {puzzle.theme.slice(0, 2).map(t => THEME_LABELS[t] ?? t).join(' · ')}
          </span>
        </div>
      </div>
      <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export default function PuzzleProblemsNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    puzzles, stats, loading, loadingMore, hasMore, error,
    filters, applyFilters, loadMore, refresh, getNextPuzzle, recordAttempt,
  } = usePuzzleProblems();

  const [activePuzzle, setActivePuzzle] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [solveParams, setSolveParams] = useState(null);

  const activeFilterCount = [
    filters.difficulty,
    filters.themes?.length,
  ].filter(Boolean).length;

  const handleSelectPuzzle = (puzzle) => {
    setActivePuzzle(puzzle);
    setSolved(false);
    setFailed(false);
    setSolveParams(null);
  };

  const handlePlayNext = async () => {
    const next = await getNextPuzzle();
    if (next) handleSelectPuzzle(next);
  };

  const handleSolved = async (params) => {
    setSolved(true);
    setSolveParams(params);
    if (user && activePuzzle) {
      await recordAttempt({
        puzzleId: activePuzzle.id,
        solved: true,
        hintsUsed: params.hintsUsed,
        attemptsCount: params.attemptsCount,
        timeSpentSecs: params.timeSecs,
      });
    }
  };

  const handleFailed = async () => {
    setFailed(true);
    if (user && activePuzzle) {
      await recordAttempt({
        puzzleId: activePuzzle.id,
        solved: false,
        hintsUsed: 0,
        attemptsCount: 1,
        timeSpentSecs: null,
      });
    }
  };

  const handleShare = async () => {
    if (!activePuzzle || !solveParams) return;
    const stars = solveParams.hintsUsed === 0 ? '⭐⭐⭐' : solveParams.hintsUsed === 1 ? '⭐⭐' : '⭐';
    const text = `♟ Resolvi "${activePuzzle.title}" no OitoPorOito!\n${stars} ${fmtTime(solveParams.timeSecs)} · Rating ${activePuzzle.rating}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Resultado copiado para a área de transferência!');
    } catch {
      alert(text);
    }
  };

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Target className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Problemas de Xadrez</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Resolva puzzles táticos reais. Filtre por dificuldade e tema para treinar pontos específicos do seu jogo.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        {user && stats && <StatsBar stats={stats} />}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: puzzle list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayNext}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gold text-surface-primary font-bold text-sm hover:bg-gold/90 transition-colors"
              >
                <span>♟</span>
                {user ? 'Próximo Não Resolvido' : 'Puzzle Aleatório'}
              </button>
              <button
                onClick={() => setShowFilters(v => !v)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
                style={{
                  backgroundColor: activeFilterCount > 0 ? 'rgba(212,168,67,0.1)' : 'transparent',
                  borderColor: activeFilterCount > 0 ? '#d4a843' : 'rgba(212,168,67,0.2)',
                  color: activeFilterCount > 0 ? '#d4a843' : '#888',
                }}
              >
                <Filter size={15} />
                {activeFilterCount > 0 && (
                  <span className="bg-gold text-surface-primary text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <FilterPanel
                    filters={filters}
                    onApply={applyFilters}
                    onClose={() => setShowFilters(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active filter chips */}
            {activeFilterCount > 0 && !showFilters && (
              <div className="flex flex-wrap gap-2">
                {filters.difficulty && (
                  <span
                    className="text-xs px-2 py-1 rounded-lg border font-medium"
                    style={{
                      backgroundColor: `${DIFFICULTY_COLORS[filters.difficulty]}22`,
                      borderColor: DIFFICULTY_COLORS[filters.difficulty],
                      color: DIFFICULTY_COLORS[filters.difficulty],
                    }}
                  >
                    {DIFFICULTY_LABELS[filters.difficulty]}
                  </span>
                )}
                {filters.themes?.map(t => (
                  <span key={t} className="text-xs px-2 py-1 rounded-lg border border-gold/40 text-gold bg-gold/10">
                    {THEME_LABELS[t] ?? t}
                  </span>
                ))}
              </div>
            )}

            {/* Count */}
            <p className="text-xs text-muted-foreground">
              {loading ? 'Carregando...' : `${puzzles.length} puzzle${puzzles.length !== 1 ? 's' : ''}`}
              {user && !loading ? ` · ${puzzles.filter(p => p.user_solved).length} resolvidos` : ''}
            </p>

            {/* List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-400 mb-3">{error}</p>
                <button onClick={refresh} className="text-gold text-sm underline">Tentar novamente</button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {puzzles.map(puzzle => (
                  <PuzzleListItem
                    key={puzzle.id}
                    puzzle={puzzle}
                    onSelect={handleSelectPuzzle}
                  />
                ))}
                {hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="w-full py-2.5 text-sm text-gold border border-gold/20 rounded-xl hover:bg-gold/10 transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? 'Carregando...' : 'Carregar mais'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: board */}
          <div className="lg:col-span-3">
            {activePuzzle ? (
              <Card variant="gradient" className="sticky top-4">
                <PuzzleBoard
                  key={activePuzzle.id}
                  puzzle={activePuzzle}
                  onSolved={handleSolved}
                  onFailed={handleFailed}
                />

                {/* Post-solve actions */}
                {(solved || failed) && (
                  <div className="mt-4 space-y-2">
                    {solved && (
                      <button
                        onClick={handleShare}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-secondary border border-gold/20 text-foreground text-sm hover:bg-gold/10 transition-colors"
                      >
                        <Share2 size={15} /> Compartilhar resultado
                      </button>
                    )}
                    <button
                      onClick={handlePlayNext}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gold text-surface-primary font-bold text-sm hover:bg-gold/90 transition-colors"
                    >
                      <ArrowRight size={15} /> Próximo Puzzle
                    </button>
                  </div>
                )}

                {/* Puzzle details */}
                {!user && (
                  <div className="mt-4 p-3 rounded-xl bg-gold/10 border border-gold/20 text-center">
                    <p className="text-sm text-gold">
                      <a href="/login" className="underline font-semibold">Entre</a> para salvar seu progresso e acompanhar seu rating de puzzles.
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gold/10">
                  <div className="flex flex-wrap gap-2">
                    {activePuzzle.theme.map(t => (
                      <span key={t} className="text-xs px-2 py-1 rounded-lg bg-gold/10 border border-gold/20 text-gold">
                        {THEME_LABELS[t] ?? t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Jogado {activePuzzle.times_played}x</span>
                    <span>Resolvido {activePuzzle.times_solved}x</span>
                    {activePuzzle.times_played > 0 && (
                      <span>Taxa: {Math.round((activePuzzle.times_solved / activePuzzle.times_played) * 100)}%</span>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="text-6xl mb-4">♟</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Selecione um puzzle</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Escolha um puzzle da lista ou clique em "Próximo Não Resolvido" para começar.
                </p>
                <button
                  onClick={handlePlayNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-surface-primary font-bold hover:bg-gold/90 transition-colors"
                >
                  <span>♟</span> Começar agora
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

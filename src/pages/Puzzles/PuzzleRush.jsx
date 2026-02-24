import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Trophy, Play, Info, Zap, Share2, RotateCcw } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { usePuzzleRush } from '@/hooks/usePuzzleRush';
import { useAuth } from '@/contexts/AuthContext';

const MODES = [
  {
    id: '3min',
    label: '3 Minutos',
    icon: '⚡',
    description: 'Resolva o máximo de puzzles em 3 minutos. Cada erro custa 10 segundos.',
    color: 'from-orange-600/20 to-orange-900/10',
    border: 'border-orange-500/30',
    seconds: 180,
    recommended: false,
  },
  {
    id: '5min',
    label: '5 Minutos',
    icon: '🔥',
    description: 'O modo clássico de Puzzle Rush. 5 minutos para alcançar o maior score possível.',
    color: 'from-gold/20 to-yellow-900/10',
    border: 'border-gold/40',
    seconds: 300,
    recommended: true,
  },
  {
    id: 'survival',
    label: 'Sobrevivência',
    icon: '💀',
    description: 'Sem limite de tempo, mas 3 erros e o jogo acaba. Até onde você chega?',
    color: 'from-red-600/20 to-red-900/10',
    border: 'border-red-500/30',
    seconds: null,
    recommended: false,
  },
];

const PERIODS = [
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
  { id: 'all', label: 'Todos' },
];

const MAX_LIVES = 3;
const ERROR_PENALTY_S = 10;
const RANK_MEDALS = ['🥇', '🥈', '🥉'];

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function formatTimeSec(s) {
  if (!s) return '—';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PuzzleRushGame — tela de jogo em tempo real
// ─────────────────────────────────────────────────────────────────────────────
function PuzzleRushGame({ mode, userRating, onFinish }) {
  const { loadPuzzles, startSession, finishSession } = usePuzzleRush();

  const [phase, setPhase] = useState('loading');
  const [puzzles, setPuzzles] = useState([]);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [moveIndex, setMoveIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [puzzleTimes, setPuzzleTimes] = useState([]);

  const chessRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const puzzleStartRef = useRef(Date.now());

  const currentPuzzle = puzzles[puzzleIndex];

  useEffect(() => {
    (async () => {
      const list = await loadPuzzles(userRating, mode, 60);
      if (!list || list.length === 0) {
        alert('Não foi possível carregar puzzles. Tente novamente.');
        onFinish({ score: 0, errors: 0, mode });
        return;
      }
      setPuzzles(list);
      const sid = await startSession(mode);
      setSessionId(sid);
      const modeCfg = MODES.find(m2 => m2.id === mode);
      setTimeLeft(modeCfg?.seconds ?? null);
      setPhase('playing');
      puzzleStartRef.current = Date.now();
    })();
  }, []);

  useEffect(() => {
    if (!currentPuzzle || phase !== 'playing') return;
    chessRef.current = new Chess(currentPuzzle.fen);
    setMoveIndex(0);
    puzzleStartRef.current = Date.now();
  }, [puzzleIndex, phase]);

  useEffect(() => {
    if (phase !== 'playing' || timeLeft === null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); endGame(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const endGame = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('finished');
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const allTimes = puzzleTimes;
    const avgTime = allTimes.length > 0 ? allTimes.reduce((a, b) => a + b, 0) / allTimes.length : 0;
    const highestRating = puzzles.slice(0, score).reduce((max, p) => Math.max(max, p.rating ?? 0), 0);
    if (sessionId) {
      await finishSession({ sessionId, score, errors, timeSpentS: elapsed, highestRating, avgTimePer: Math.round(avgTime * 10) / 10 });
    }
    onFinish({ score, errors, mode });
  }, [score, errors, puzzleTimes, sessionId, puzzles, mode]);

  const handlePieceDrop = useCallback((sourceSquare, targetSquare) => {
    if (!currentPuzzle || phase !== 'playing') return false;
    const expectedUci = currentPuzzle.solution_uci[moveIndex];
    const madeUci = sourceSquare + targetSquare;

    if (madeUci === expectedUci || madeUci === expectedUci?.slice(0, 4)) {
      setFeedback('correct');
      setTimeout(() => setFeedback(null), 500);
      const chess = chessRef.current;
      chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      const nextMoveIdx = moveIndex + 1;
      if (nextMoveIdx >= currentPuzzle.solution_uci.length) {
        const elapsed = (Date.now() - puzzleStartRef.current) / 1000;
        setPuzzleTimes(prev => [...prev, elapsed]);
        setScore(s => {
          const newScore = s + 1;
          const nextIdx = puzzleIndex + 1;
          if (nextIdx >= puzzles.length) setTimeout(endGame, 600);
          else setPuzzleIndex(nextIdx);
          return newScore;
        });
      } else {
        const opponentUci = currentPuzzle.solution_uci[nextMoveIdx];
        if (opponentUci) {
          setTimeout(() => { chess.move(opponentUci); setMoveIndex(nextMoveIdx + 1); }, 400);
        } else {
          setMoveIndex(nextMoveIdx);
        }
      }
      return true;
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 600);
      setErrors(e => e + 1);
      if (mode === 'survival') {
        setLives(l => { const newL = l - 1; if (newL <= 0) setTimeout(endGame, 600); return newL; });
      } else {
        setTimeLeft(prev => prev !== null ? Math.max(0, prev - ERROR_PENALTY_S) : null);
      }
      return false;
    }
  }, [currentPuzzle, moveIndex, phase, puzzleIndex, puzzles, mode, endGame]);

  const timerColor = timeLeft !== null && timeLeft <= 30 ? 'text-red-400' : 'text-gold';

  if (phase === 'loading' || !currentPuzzle) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-5xl animate-pulse">⚡</div>
        <p className="text-muted-foreground">Carregando puzzles...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card variant="gradient" className="text-center py-3 border border-gold/20">
          <div className="text-2xl font-bold text-gold">{score}</div>
          <div className="text-xs text-muted-foreground">Score</div>
        </Card>
        {mode === 'survival' ? (
          <Card variant="gradient" className="text-center py-3 border border-red-500/30">
            <div className="text-2xl">{Array.from({ length: MAX_LIVES }, (_, i) => i < lives ? '❤️' : '🖤').join('')}</div>
            <div className="text-xs text-muted-foreground">Vidas</div>
          </Card>
        ) : (
          <Card variant="gradient" className="text-center py-3 border border-gold/20">
            <div className={`text-2xl font-bold font-mono ${timerColor}`}>{timeLeft !== null ? formatTime(timeLeft) : '—'}</div>
            <div className="text-xs text-muted-foreground">Tempo</div>
          </Card>
        )}
        <Card variant="gradient" className="text-center py-3 border border-gold/20">
          <div className={`text-2xl font-bold ${errors > 0 ? 'text-red-400' : 'text-foreground'}`}>{errors}</div>
          <div className="text-xs text-muted-foreground">Erros</div>
        </Card>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`mb-4 rounded-lg py-2 px-4 text-center font-semibold text-sm ${
              feedback === 'correct' ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-red-500/20 border border-red-500 text-red-400'
            }`}>
            {feedback === 'correct' ? '✓ Correto!' : `✗ Errado! ${mode !== 'survival' ? `-${ERROR_PENALTY_S}s` : '-1 vida'}`}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div>
          <div className="text-sm text-muted-foreground mb-2 flex justify-between">
            <span>{currentPuzzle.title}</span>
            <span className="text-gold">⭐ {currentPuzzle.rating}</span>
          </div>
          <div className={`rounded-xl overflow-hidden border-2 transition-colors ${
            feedback === 'correct' ? 'border-green-500' : feedback === 'wrong' ? 'border-red-500' : 'border-surface-secondary'
          }`}>
            <Chessboard
              position={chessRef.current?.fen() ?? currentPuzzle.fen}
              onPieceDrop={handlePieceDrop}
              boardWidth={Math.min(480, typeof window !== 'undefined' ? window.innerWidth - 64 : 480)}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {chessRef.current?.turn() === 'w' ? '⬜ Brancas jogam' : '⬛ Pretas jogam'}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Card variant="gradient" className="border border-gold/20">
            <h3 className="font-semibold text-foreground mb-3 text-sm">Puzzle #{puzzleIndex + 1}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>Dificuldade</span><span className="text-foreground capitalize">{currentPuzzle.difficulty}</span></div>
              <div className="flex justify-between"><span>Rating</span><span className="text-gold font-mono">{currentPuzzle.rating}</span></div>
            </div>
          </Card>
          <Button variant="ghost" size="sm" className="border border-surface-secondary text-muted-foreground"
            onClick={() => { if (window.confirm('Encerrar a corrida?')) endGame(); }}>
            Encerrar corrida
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PuzzleRushResult — tela de resultado
// ─────────────────────────────────────────────────────────────────────────────
function PuzzleRushResult({ result, onPlayAgain }) {
  const handleShare = () => {
    const modeLabel = MODES.find(m => m.id === result.mode)?.label ?? result.mode;
    const accuracy = result.score + result.errors > 0 ? Math.round((result.score / (result.score + result.errors)) * 100) : 0;
    const text = `⚡ Corrida de Puzzles — OitoPorOito\n\nModo: ${modeLabel}\nScore: ${result.score} puzzles\nErros: ${result.errors}\nPrecisão: ${accuracy}%\n\nJogue em oitoporoito.com.br`;
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => alert('Resultado copiado!'));
  };
  const emoji = result.score >= 20 ? '🏆' : result.score >= 10 ? '🎯' : '⚡';
  const accuracy = result.score + result.errors > 0 ? Math.round((result.score / (result.score + result.errors)) * 100) : 0;
  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="text-7xl mb-4">{emoji}</div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Corrida Encerrada!</h2>
        <p className="text-muted-foreground mb-8">Modo: {MODES.find(m => m.id === result.mode)?.label}</p>
        <Card variant="gradient" className="mb-6 border border-gold/30">
          <div className="grid grid-cols-3 divide-x divide-surface-secondary">
            <div className="py-4 px-2"><div className="text-3xl font-bold text-gold">{result.score}</div><div className="text-xs text-muted-foreground mt-1">Puzzles resolvidos</div></div>
            <div className="py-4 px-2"><div className={`text-3xl font-bold ${result.errors > 0 ? 'text-red-400' : 'text-foreground'}`}>{result.errors}</div><div className="text-xs text-muted-foreground mt-1">Erros</div></div>
            <div className="py-4 px-2"><div className="text-3xl font-bold text-foreground">{accuracy}%</div><div className="text-xs text-muted-foreground mt-1">Precisão</div></div>
          </div>
        </Card>
        <div className="flex flex-col gap-3">
          <Button variant="ghost" className="border border-surface-secondary flex items-center gap-2 justify-center" onClick={handleShare}>
            <Share2 size={16} /> Compartilhar resultado
          </Button>
          <Button variant="primary" className="flex items-center gap-2 justify-center" onClick={onPlayAgain}>
            <RotateCcw size={16} /> Jogar Novamente
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PuzzleRush — página principal (lobby + leaderboard)
// ─────────────────────────────────────────────────────────────────────────────
export default function PuzzleRush() {
  const { user, profile } = useAuth();
  const { personalBest, leaderboard, loading, loadPersonalBest, loadLeaderboard } = usePuzzleRush();
  const [selectedMode, setSelectedMode] = useState('5min');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [gamePhase, setGamePhase] = useState('lobby');
  const [lastResult, setLastResult] = useState(null);

  const userRating = profile?.rating_blitz ?? 1200;

  useEffect(() => {
    if (user) loadPersonalBest(selectedMode);
  }, [user, selectedMode]);

  useEffect(() => {
    loadLeaderboard(selectedMode, selectedPeriod);
  }, [selectedMode, selectedPeriod]);

  const handleStart = () => {
    if (!user) { alert('Faça login para jogar a Corrida de Puzzles e salvar seu score!'); return; }
    setGamePhase('playing');
  };

  const handleFinish = (result) => {
    setLastResult(result);
    setGamePhase('result');
    if (user) loadPersonalBest(selectedMode);
    loadLeaderboard(selectedMode, selectedPeriod);
  };

  const handlePlayAgain = () => { setLastResult(null); setGamePhase('lobby'); };

  if (gamePhase === 'playing') {
    return (
      <PageLayout>
        <PuzzleRushGame mode={selectedMode} userRating={userRating} onFinish={handleFinish} />
      </PageLayout>
    );
  }

  if (gamePhase === 'result' && lastResult) {
    return (
      <PageLayout>
        <PuzzleRushResult result={lastResult} onPlayAgain={handlePlayAgain} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-6xl mb-4">⚡</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gold mb-3">Corrida de Puzzles</h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              Resolva puzzles contra o relógio! Teste sua velocidade e precisão tática.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mt-6 flex justify-center gap-4 flex-wrap">
            <Card variant="gradient" className="inline-flex items-center gap-4 px-6 py-3 border border-gold/30">
              <Trophy size={20} className="text-gold" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Recorde pessoal ({selectedMode})</div>
                <div className="text-xl font-bold text-gold">{personalBest?.best_score ?? '—'} puzzles</div>
              </div>
            </Card>
            {personalBest?.total_sessions > 0 && (
              <Card variant="gradient" className="inline-flex items-center gap-4 px-6 py-3 border border-gold/20">
                <Zap size={20} className="text-muted-foreground" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Sessões jogadas</div>
                  <div className="text-xl font-bold text-foreground">{personalBest.total_sessions}</div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-foreground mb-5 text-center">Escolha o Modo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {MODES.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card
                variant="gradient"
                className={`relative cursor-pointer text-center flex flex-col gap-3 bg-gradient-to-br ${m.color} ${m.border} transition-all hover:scale-[1.03] ${selectedMode === m.id ? 'ring-2 ring-gold' : ''}`}
                onClick={() => setSelectedMode(m.id)}
              >
                {m.recommended && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold text-surface-primary text-xs font-bold px-3 py-0.5 rounded-full">Recomendado</div>
                )}
                <div className="text-4xl pt-2">{m.icon}</div>
                <div className="font-bold text-lg text-foreground">{m.label}</div>
                <p className="text-xs text-muted-foreground">{m.description}</p>
                {selectedMode === m.id && <div className="text-gold text-xs font-semibold">✓ Selecionado</div>}
              </Card>
            </motion.div>
          ))}
        </div>

        <Card variant="gradient" className="mb-6 border border-gold/20">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-gold shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Como funciona</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Puzzles aparecem um por vez, cada vez mais difíceis</li>
                <li>• Acerte para ganhar pontos e avançar para o próximo</li>
                <li>• Cada erro desconta {ERROR_PENALTY_S}s (cronometrado) ou 1 vida (sobrevivência)</li>
                <li>• Seu score é o número de puzzles resolvidos corretamente</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="text-center mb-12">
          <Button variant="primary" size="lg" className="px-12 flex items-center gap-3 mx-auto text-lg" onClick={handleStart}>
            <Play size={20} />
            {user ? 'Iniciar Corrida' : 'Fazer login para jogar'}
          </Button>
          {!user && <p className="text-xs text-muted-foreground mt-2">Login necessário para salvar scores e aparecer no ranking</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Trophy size={18} className="text-gold" /> Top Jogadores
            </h2>
            <div className="flex gap-2">
              {PERIODS.map(p => (
                <button key={p.id} onClick={() => setSelectedPeriod(p.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedPeriod === p.id ? 'bg-gold/20 border-gold text-gold' : 'border-surface-secondary text-muted-foreground hover:text-foreground'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <Card variant="gradient" className="border border-gold/10">
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">Carregando...</div>
            ) : leaderboard.length === 0 ? (
              <div className="py-8 text-center">
                <div className="text-4xl mb-3">🏆</div>
                <p className="text-muted-foreground text-sm">Nenhuma sessão registrada ainda.</p>
                <p className="text-muted-foreground text-xs mt-1">Seja o primeiro a jogar!</p>
              </div>
            ) : (
              <div className="space-y-0">
                {leaderboard.map((entry, i) => (
                  <div key={entry.user_id} className="flex items-center gap-3 py-3 px-1 border-b border-gold/5 last:border-0">
                    <span className="text-lg w-8 text-center">{i < 3 ? RANK_MEDALS[i] : `${i + 1}`}</span>
                    {entry.avatar_url ? (
                      <img src={entry.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                        {(entry.display_name ?? 'J')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm truncate">{entry.display_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {entry.total_sessions} {entry.total_sessions === 1 ? 'sessão' : 'sessões'}
                        {entry.best_time_s ? ` · ${formatTimeSec(entry.best_time_s)}` : ''}
                      </div>
                    </div>
                    <span className="font-bold text-gold font-mono text-lg">{entry.best_score}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

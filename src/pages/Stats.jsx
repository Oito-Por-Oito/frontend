import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Target, Zap, Trophy, ChevronLeft } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { PageLayout } from '@/components/layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const MODES = [
  { key: 'blitz', label: 'Blitz', icon: '⚡', ratingKey: 'rating_blitz' },
  { key: 'rapid', label: 'Rápido', icon: '🕐', ratingKey: 'rating_rapid' },
  { key: 'classical', label: 'Clássico', icon: '♟', ratingKey: 'rating_classical' },
];

const TIER_RANGES = [
  { label: 'Mestre Internacional', min: 2400, color: '#f59e0b' },
  { label: 'Mestre', min: 2000, color: '#a78bfa' },
  { label: 'Avançado', min: 1600, color: '#60a5fa' },
  { label: 'Intermediário', min: 1200, color: '#34d399' },
  { label: 'Iniciante', min: 0, color: '#9ca3af' },
];

function getTier(rating) {
  return TIER_RANGES.find(t => rating >= t.min) ?? TIER_RANGES[TIER_RANGES.length - 1];
}

function StatCard({ icon, label, value, sub, color = 'text-gold' }) {
  return (
    <Card variant="gradient" className="flex flex-col items-center text-center gap-1 py-5">
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm font-medium text-foreground">{label}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </Card>
  );
}

function WinRateBar({ wins, draws, losses, total }) {
  if (total === 0) return <div className="h-3 rounded-full bg-surface-secondary w-full" />;
  const wPct = (wins / total) * 100;
  const dPct = (draws / total) * 100;
  const lPct = (losses / total) * 100;
  return (
    <div className="h-3 rounded-full overflow-hidden flex w-full">
      <div style={{ width: `${wPct}%` }} className="bg-success transition-all" />
      <div style={{ width: `${dPct}%` }} className="bg-warning transition-all" />
      <div style={{ width: `${lPct}%` }} className="bg-error transition-all" />
    </div>
  );
}

export default function Stats() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [games, setGames] = useState([]);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [puzzleStats, setPuzzleStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState('blitz');

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const [{ data: gamesData }, { data: histData }, { data: puzzleData }] = await Promise.all([
        supabase
          .from('games')
          .select('id, white_player_id, black_player_id, result, time_control_category, created_at, duration_seconds')
          .or(`white_player_id.eq.${user.id},black_player_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(200),
        supabase
          .from('rating_history')
          .select('recorded_at, rating_blitz, rating_rapid, rating_classical')
          .eq('user_id', user.id)
          .order('recorded_at', { ascending: true })
          .limit(30),
        supabase
          .from('puzzle_attempts')
          .select('solved, hints_used, time_seconds')
          .eq('user_id', user.id),
      ]);
      setGames(gamesData ?? []);
      setRatingHistory(histData ?? []);
      if (puzzleData) {
        const solved = puzzleData.filter(p => p.solved).length;
        const total = puzzleData.length;
        const avgTime = total > 0
          ? Math.round(puzzleData.reduce((s, p) => s + (p.time_seconds ?? 0), 0) / total)
          : 0;
        setPuzzleStats({ solved, total, accuracy: total > 0 ? Math.round((solved / total) * 100) : 0, avgTime });
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const getStats = (mode) => {
    const filtered = games.filter(g => g.time_control_category === mode);
    const wins = filtered.filter(g =>
      (g.white_player_id === user?.id && g.result === 'white') ||
      (g.black_player_id === user?.id && g.result === 'black')
    ).length;
    const losses = filtered.filter(g =>
      (g.white_player_id === user?.id && g.result === 'black') ||
      (g.black_player_id === user?.id && g.result === 'white')
    ).length;
    const draws = filtered.filter(g => g.result === 'draw').length;
    const total = filtered.length;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
    return { wins, losses, draws, total, winRate };
  };

  const allStats = getStats(activeMode);
  const currentMode = MODES.find(m => m.key === activeMode);
  const rating = profile?.[currentMode?.ratingKey] ?? 800;
  const tier = getTier(rating);

  if (!user) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center px-4 py-20 text-center">
          <div>
            <BarChart2 className="mx-auto mb-4 text-gold" size={48} />
            <h1 className="text-2xl font-bold text-foreground mb-2">Estatísticas</h1>
            <p className="text-muted-foreground mb-6">Faça login para ver suas estatísticas detalhadas</p>
            <Button onClick={() => navigate('/login')}>Fazer Login</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                <BarChart2 size={28} className="text-gold" /> Estatísticas
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Análise detalhada do seu desempenho</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Card variant="gradient" className="inline-flex items-center gap-4 px-6 py-4 border border-gold/30">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: tier.color + '22' }}>
                <Trophy size={24} style={{ color: tier.color }} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{tier.label}</div>
                <div className="text-3xl font-bold text-gold">{rating}</div>
                <div className="text-xs text-muted-foreground">{currentMode?.label}</div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Mode Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {MODES.map(m => (
            <button key={m.key} onClick={() => setActiveMode(m.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeMode === m.key ? 'bg-gold/20 border-gold text-gold' : 'border-surface-secondary text-muted-foreground hover:text-foreground'
              }`}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center text-muted-foreground">Carregando estatísticas...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <StatCard icon="🏆" label="Vitórias" value={allStats.wins} color="text-success" />
              <StatCard icon="💀" label="Derrotas" value={allStats.losses} color="text-error" />
              <StatCard icon="🤝" label="Empates" value={allStats.draws} color="text-warning" />
              <StatCard icon="♟" label="Total" value={allStats.total} sub={`${allStats.winRate}% vitórias`} />
            </div>

            {/* Win Rate Bar */}
            <Card variant="gradient" className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Distribuição de Resultados</h3>
                <span className="text-gold font-bold">{allStats.winRate}% vitórias</span>
              </div>
              <WinRateBar wins={allStats.wins} draws={allStats.draws} losses={allStats.losses} total={allStats.total} />
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success inline-block" /> Vitórias ({allStats.wins})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning inline-block" /> Empates ({allStats.draws})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error inline-block" /> Derrotas ({allStats.losses})</span>
              </div>
            </Card>

            {/* Puzzle Stats */}
            {puzzleStats && (
              <Card variant="gradient" className="mb-8">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Target size={16} className="text-gold" /> Puzzles
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold">{puzzleStats.solved}</div>
                    <div className="text-xs text-muted-foreground mt-1">Resolvidos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{puzzleStats.accuracy}%</div>
                    <div className="text-xs text-muted-foreground mt-1">Precisão</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{puzzleStats.avgTime}s</div>
                    <div className="text-xs text-muted-foreground mt-1">Tempo médio</div>
                  </div>
                </div>
              </Card>
            )}

            {/* Resumo por modalidade */}
            <Card variant="gradient" className="mb-8">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-gold" /> Resumo por Modalidade
              </h3>
              <div className="space-y-3">
                {MODES.map(mode => {
                  const s = getStats(mode.key);
                  const r = profile?.[mode.ratingKey] ?? 800;
                  const t = getTier(r);
                  return (
                    <div key={mode.key} className="flex items-center gap-3 py-2 border-b border-gold/5 last:border-0">
                      <span className="text-lg w-8 text-center">{mode.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-foreground text-sm">{mode.label}</div>
                        <div className="text-xs text-muted-foreground">{s.total} partidas · {s.winRate}% vitórias</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gold">{r}</div>
                        <div className="text-xs" style={{ color: t.color }}>{t.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Rating History */}
            {ratingHistory.length > 0 && (
              <Card variant="gradient">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Zap size={16} className="text-gold" /> Evolução de Rating
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted-foreground text-xs border-b border-gold/10">
                        <th className="text-left pb-2">Data</th>
                        <th className="text-right pb-2">⚡ Blitz</th>
                        <th className="text-right pb-2">🕐 Rápido</th>
                        <th className="text-right pb-2">♟ Clássico</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ratingHistory.slice(-10).reverse().map((r, i) => (
                        <tr key={i} className="border-b border-gold/5 last:border-0">
                          <td className="py-2 text-muted-foreground">
                            {new Date(r.recorded_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                          </td>
                          <td className="py-2 text-right font-mono text-foreground">{r.rating_blitz ?? '—'}</td>
                          <td className="py-2 text-right font-mono text-foreground">{r.rating_rapid ?? '—'}</td>
                          <td className="py-2 text-right font-mono text-foreground">{r.rating_classical ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, X, ChevronLeft, CheckCircle, Flame, Trophy, Puzzle, Swords } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { PageLayout } from '@/components/layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Metas automáticas baseadas em dados reais do Supabase
const AUTO_GOAL_TEMPLATES = [
  {
    id: 'rating_1000', type: 'auto', icon: '🎯',
    title: 'Alcançar 1000 de rating',
    desc: 'Chegue a 1000 pontos no modo Blitz',
    target: 1000, unit: 'pts', ratingKey: 'rating_blitz',
  },
  {
    id: 'rating_1200', type: 'auto', icon: '⭐',
    title: 'Alcançar 1200 de rating',
    desc: 'Chegue a 1200 pontos no modo Blitz',
    target: 1200, unit: 'pts', ratingKey: 'rating_blitz',
  },
  {
    id: 'games_50', type: 'auto', icon: '♟',
    title: 'Jogar 50 partidas',
    desc: 'Complete 50 partidas online',
    target: 50, unit: 'partidas', dataKey: 'totalGames',
  },
  {
    id: 'games_100', type: 'auto', icon: '🏅',
    title: 'Jogar 100 partidas',
    desc: 'Complete 100 partidas online',
    target: 100, unit: 'partidas', dataKey: 'totalGames',
  },
  {
    id: 'puzzles_50', type: 'auto', icon: '🧩',
    title: 'Resolver 50 puzzles',
    desc: 'Resolva 50 puzzles táticos',
    target: 50, unit: 'puzzles', dataKey: 'totalPuzzles',
  },
  {
    id: 'puzzles_100', type: 'auto', icon: '🧠',
    title: 'Resolver 100 puzzles',
    desc: 'Resolva 100 puzzles táticos',
    target: 100, unit: 'puzzles', dataKey: 'totalPuzzles',
  },
  {
    id: 'streak_7', type: 'auto', icon: '🔥',
    title: 'Sequência de 7 dias',
    desc: 'Resolva o puzzle diário por 7 dias consecutivos',
    target: 7, unit: 'dias', dataKey: 'dailyStreak',
  },
];

function GoalCard({ goal, onRemove, onUpdateCustom }) {
  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const done = pct >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
    >
      <Card variant="gradient" className={`mb-3 ${done ? 'border border-success/30' : ''}`}>
        <div className="flex items-start gap-3">
          <div className={`text-2xl mt-0.5 ${done ? 'grayscale-0' : ''}`}>{goal.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className={`font-semibold text-sm ${done ? 'text-success' : 'text-foreground'}`}>{goal.title}</h3>
              {done && <CheckCircle size={14} className="text-success flex-shrink-0" />}
            </div>
            {goal.desc && <p className="text-xs text-muted-foreground mb-2">{goal.desc}</p>}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">
                {done ? `${goal.target} / ${goal.target}` : `${goal.current} / ${goal.target}`} {goal.unit}
              </span>
              <span className={`text-xs font-bold ${done ? 'text-success' : 'text-gold'}`}>{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-surface-secondary overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${done ? 'bg-success' : 'bg-gold'}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            {goal.type === 'custom' && !done && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onUpdateCustom(goal.id, -1)}
                  className="px-3 py-1 rounded-lg text-sm border border-surface-secondary text-muted-foreground hover:text-foreground transition-colors"
                >−</button>
                <button
                  onClick={() => onUpdateCustom(goal.id, 1)}
                  className="px-3 py-1 rounded-lg text-sm bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30 transition-colors"
                >+</button>
              </div>
            )}
          </div>
          <button
            onClick={() => onRemove(goal.id)}
            className="text-muted-foreground hover:text-error transition-colors flex-shrink-0 mt-0.5"
          >
            <X size={14} />
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Goals() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [autoGoals, setAutoGoals] = useState([]);
  const [customGoals, setCustomGoals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', current: 0, icon: '🎯', unit: '' });
  const [liveData, setLiveData] = useState({ totalGames: 0, totalPuzzles: 0, dailyStreak: 0 });
  const [loading, setLoading] = useState(true);

  // Buscar dados reais do Supabase
  const fetchLiveData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [{ count: gamesCount }, { count: puzzlesCount }, { data: streakData }] = await Promise.all([
      supabase
        .from('games')
        .select('id', { count: 'exact', head: true })
        .or(`white_player_id.eq.${user.id},black_player_id.eq.${user.id}`),
      supabase
        .from('puzzle_attempts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('solved', true),
      supabase.rpc('get_user_daily_streak', { p_user_id: user.id }),
    ]);
    setLiveData({
      totalGames: gamesCount ?? 0,
      totalPuzzles: puzzlesCount ?? 0,
      dailyStreak: streakData ?? 0,
    });
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchLiveData(); }, [fetchLiveData]);

  // Carregar metas customizadas do localStorage
  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`goals_custom_${user.id}`);
    if (saved) setCustomGoals(JSON.parse(saved));
    const savedAuto = localStorage.getItem(`goals_auto_${user.id}`);
    if (savedAuto) setAutoGoals(JSON.parse(savedAuto));
  }, [user]);

  const saveCustomGoals = (goals) => {
    setCustomGoals(goals);
    if (user) localStorage.setItem(`goals_custom_${user.id}`, JSON.stringify(goals));
  };

  const saveAutoGoals = (goals) => {
    setAutoGoals(goals);
    if (user) localStorage.setItem(`goals_auto_${user.id}`, JSON.stringify(goals));
  };

  // Montar metas automáticas com dados reais
  const resolvedAutoGoals = autoGoals.map(g => {
    const tpl = AUTO_GOAL_TEMPLATES.find(t => t.id === g.id);
    if (!tpl) return g;
    let current = g.current;
    if (tpl.ratingKey) current = profile?.[tpl.ratingKey] ?? 800;
    else if (tpl.dataKey) current = liveData[tpl.dataKey] ?? 0;
    return { ...g, current };
  });

  const allGoals = [...resolvedAutoGoals, ...customGoals];
  const completedGoals = allGoals.filter(g => g.current >= g.target);
  const activeGoals = allGoals.filter(g => g.current < g.target);

  const handleAddCustomGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    const goal = {
      id: `custom_${Date.now()}`,
      type: 'custom',
      title: newGoal.title,
      desc: '',
      icon: newGoal.icon || '🎯',
      target: parseInt(newGoal.target),
      current: parseInt(newGoal.current) || 0,
      unit: newGoal.unit || 'pontos',
    };
    saveCustomGoals([...customGoals, goal]);
    setNewGoal({ title: '', target: '', current: 0, icon: '🎯', unit: '' });
    setShowAddModal(false);
  };

  const handleAddAutoGoal = (tpl) => {
    if (autoGoals.find(g => g.id === tpl.id)) return;
    let current = 0;
    if (tpl.ratingKey) current = profile?.[tpl.ratingKey] ?? 800;
    else if (tpl.dataKey) current = liveData[tpl.dataKey] ?? 0;
    saveAutoGoals([...autoGoals, { ...tpl, current }]);
    setShowAutoModal(false);
  };

  const handleRemoveGoal = (id) => {
    if (id.startsWith('custom_')) {
      saveCustomGoals(customGoals.filter(g => g.id !== id));
    } else {
      saveAutoGoals(autoGoals.filter(g => g.id !== id));
    }
  };

  const handleUpdateCustom = (id, delta) => {
    saveCustomGoals(customGoals.map(g =>
      g.id === id ? { ...g, current: Math.min(Math.max(0, g.current + delta), g.target) } : g
    ));
  };

  const availableAutoGoals = AUTO_GOAL_TEMPLATES.filter(t => !autoGoals.find(g => g.id === t.id));

  if (!user) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center px-4 py-20 text-center">
          <div>
            <Target className="mx-auto mb-4 text-gold" size={48} />
            <h1 className="text-2xl font-bold text-foreground mb-2">Metas</h1>
            <p className="text-muted-foreground mb-6">Faça login para acompanhar suas metas</p>
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
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                <Target size={28} className="text-gold" /> Metas
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Defina e acompanhe seus objetivos no xadrez</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAutoModal(true)}
                className="px-3 py-2 rounded-lg text-sm border border-gold/40 text-gold hover:bg-gold/10 transition-colors flex items-center gap-1"
              >
                <Trophy size={14} /> Sugeridas
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-2 rounded-lg text-sm bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30 transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Nova
              </button>
            </div>
          </motion.div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card variant="gradient" className="text-center py-4">
              <div className="text-2xl font-bold text-success">{completedGoals.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Concluídas</div>
            </Card>
            <Card variant="gradient" className="text-center py-4">
              <div className="text-2xl font-bold text-gold">{activeGoals.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Em andamento</div>
            </Card>
            <Card variant="gradient" className="text-center py-4">
              <div className="text-2xl font-bold text-foreground">
                {allGoals.length > 0 ? Math.round((completedGoals.length / allGoals.length) * 100) : 0}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Progresso</div>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Dados em tempo real */}
        {!loading && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <Card variant="gradient" className="flex items-center gap-3 py-3 px-4">
              <Swords size={18} className="text-gold flex-shrink-0" />
              <div>
                <div className="font-bold text-foreground">{liveData.totalGames}</div>
                <div className="text-xs text-muted-foreground">Partidas</div>
              </div>
            </Card>
            <Card variant="gradient" className="flex items-center gap-3 py-3 px-4">
              <Puzzle size={18} className="text-gold flex-shrink-0" />
              <div>
                <div className="font-bold text-foreground">{liveData.totalPuzzles}</div>
                <div className="text-xs text-muted-foreground">Puzzles</div>
              </div>
            </Card>
            <Card variant="gradient" className="flex items-center gap-3 py-3 px-4">
              <Flame size={18} className="text-gold flex-shrink-0" />
              <div>
                <div className="font-bold text-foreground">{liveData.dailyStreak}</div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
            </Card>
          </div>
        )}

        {allGoals.length === 0 ? (
          <div className="py-16 text-center">
            <Target size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground mb-4">Nenhuma meta definida ainda</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setShowAutoModal(true)}>Ver Metas Sugeridas</Button>
              <Button onClick={() => setShowAddModal(true)}>Criar Meta</Button>
            </div>
          </div>
        ) : (
          <>
            {/* Metas em andamento */}
            {activeGoals.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Em Andamento</h2>
                <AnimatePresence>
                  {activeGoals.map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onRemove={handleRemoveGoal}
                      onUpdateCustom={handleUpdateCustom}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Metas concluídas */}
            {completedGoals.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">✅ Concluídas</h2>
                <AnimatePresence>
                  {completedGoals.map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onRemove={handleRemoveGoal}
                      onUpdateCustom={handleUpdateCustom}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal: Nova Meta Customizada */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-surface rounded-2xl p-6 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-foreground mb-4">Nova Meta</h3>
              <div className="space-y-3">
                <input
                  className="w-full bg-surface-secondary border border-gold/20 rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-gold/50"
                  placeholder="Título da meta"
                  value={newGoal.title}
                  onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="bg-surface-secondary border border-gold/20 rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-gold/50"
                    placeholder="Valor alvo"
                    type="number"
                    value={newGoal.target}
                    onChange={e => setNewGoal(p => ({ ...p, target: e.target.value }))}
                  />
                  <input
                    className="bg-surface-secondary border border-gold/20 rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-gold/50"
                    placeholder="Unidade"
                    value={newGoal.unit}
                    onChange={e => setNewGoal(p => ({ ...p, unit: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancelar</Button>
                <Button className="flex-1" onClick={handleAddCustomGoal}>Criar</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Metas Sugeridas */}
      <AnimatePresence>
        {showAutoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAutoModal(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-surface rounded-2xl p-6 w-full max-w-sm max-h-[70vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-foreground mb-4">Metas Sugeridas</h3>
              {availableAutoGoals.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">Você já adicionou todas as metas sugeridas!</p>
              ) : (
                <div className="space-y-2">
                  {availableAutoGoals.map(tpl => {
                    let current = 0;
                    if (tpl.ratingKey) current = profile?.[tpl.ratingKey] ?? 800;
                    else if (tpl.dataKey) current = liveData[tpl.dataKey] ?? 0;
                    const pct = Math.min(100, Math.round((current / tpl.target) * 100));
                    return (
                      <button
                        key={tpl.id}
                        onClick={() => handleAddAutoGoal(tpl)}
                        className="w-full text-left p-3 rounded-xl border border-gold/20 hover:border-gold/50 hover:bg-gold/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{tpl.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground text-sm">{tpl.title}</div>
                            <div className="text-xs text-muted-foreground">{current} / {tpl.target} {tpl.unit} · {pct}%</div>
                          </div>
                          <Plus size={16} className="text-gold flex-shrink-0" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" onClick={() => setShowAutoModal(false)}>Fechar</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}

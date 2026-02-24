import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Filter, ChevronRight, Star, Lock, Calendar, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useDailyPuzzle } from '@/hooks/useDailyPuzzle';

const THEMES = [
  { id: 'fork', label: 'Garfo', emoji: '🍴', count: 1240 },
  { id: 'pin', label: 'Cravada', emoji: '📌', count: 980 },
  { id: 'skewer', label: 'Espeto', emoji: '🔱', count: 654 },
  { id: 'discovery', label: 'Ataque Descoberto', emoji: '💡', count: 820 },
  { id: 'mate1', label: 'Mate em 1', emoji: '♟️', count: 2100 },
  { id: 'mate2', label: 'Mate em 2', emoji: '♟️', count: 1800 },
  { id: 'mate3', label: 'Mate em 3', emoji: '♟️', count: 1200 },
  { id: 'endgame', label: 'Final', emoji: '🏁', count: 760 },
  { id: 'opening', label: 'Abertura', emoji: '📖', count: 430 },
  { id: 'sacrifice', label: 'Sacrifício', emoji: '💎', count: 590 },
  { id: 'promotion', label: 'Promoção', emoji: '👑', count: 340 },
  { id: 'defense', label: 'Defesa', emoji: '🛡️', count: 480 },
];

const DIFFICULTIES = ['Todos', 'Iniciante', 'Intermediário', 'Avançado', 'Mestre'];

const MOCK_PUZZLES = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  theme: THEMES[i % THEMES.length].label,
  difficulty: DIFFICULTIES[1 + (i % 4)],
  rating: 800 + i * 150,
  solved: i % 3 === 0,
  emoji: THEMES[i % THEMES.length].emoji,
}));

const DIFFICULTY_COLOR = {
  easy: 'text-green-400',
  medium: 'text-amber-400',
  hard: 'text-red-400',
  expert: 'text-purple-400',
};
const DIFFICULTY_LABEL = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil', expert: 'Expert' };

export default function PuzzleProblems() {
  const navigate = useNavigate();
  const [activeDiff, setActiveDiff] = useState('Todos');
  const [activeTheme, setActiveTheme] = useState(null);
  const { puzzle: dailyPuzzle, attempt: dailyAttempt, streak } = useDailyPuzzle();

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Brain className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Problemas de Xadrez</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Treine sua visão tática com milhares de puzzles organizados por tema e dificuldade.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { label: 'Puzzles Resolvidos', value: '0', icon: '✅' },
              { label: 'Sequência Atual', value: '0 dias', icon: '🔥' },
              { label: 'Rating de Puzzles', value: '1200', icon: '⭐' },
              { label: 'Total Disponível', value: '12k+', icon: '🧩' },
            ].map(s => (
              <Card key={s.label} variant="gradient" className="p-3 text-center">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-lg font-bold text-gold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de temas */}
          <div className="lg:col-span-1">
            <Card variant="gradient" className="sticky top-20">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Filter size={16} className="text-gold" /> Temas
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTheme(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    !activeTheme ? 'bg-gold/20 text-gold font-semibold' : 'text-muted-foreground hover:bg-surface-tertiary'
                  }`}
                >
                  Todos os temas
                </button>
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTheme(t.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      activeTheme === t.id ? 'bg-gold/20 text-gold font-semibold' : 'text-muted-foreground hover:bg-surface-tertiary'
                    }`}
                  >
                    <span>{t.emoji} {t.label}</span>
                    <span className="text-xs opacity-60">{t.count}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Conteúdo principal */}
          <div className="lg:col-span-3">
            {/* Daily Puzzle Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5"
            >
              <Card
                variant="gradient"
                className="cursor-pointer border-2 border-gold/40 hover:border-gold/70 transition-all group"
                onClick={() => navigate('/puzzles/daily')}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">📅</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gold text-base">Puzzle do Dia</h3>
                      {dailyAttempt?.solved && (
                        <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                          ✓ Resolvido
                        </span>
                      )}
                    </div>
                    {dailyPuzzle ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={DIFFICULTY_COLOR[dailyPuzzle.difficulty]}>
                          {DIFFICULTY_LABEL[dailyPuzzle.difficulty]}
                        </span>
                        <span>·</span>
                        <span>⭐ {dailyPuzzle.rating}</span>
                        <span>·</span>
                        <span>{dailyPuzzle.title}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Resolva o puzzle tático de hoje!</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 bg-gold/10 border border-gold/20 rounded-lg px-3 py-1.5">
                      <Flame size={14} className="text-orange-400" />
                      <span className="text-gold font-bold text-sm">{streak}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">dias</span>
                  </div>
                </div>
                <div className="mt-3 bg-gold text-surface-primary text-center py-2 rounded-lg text-sm font-semibold group-hover:bg-gold-light transition-colors">
                  {dailyAttempt?.solved ? '✓ Ver resultado' : '▶ Resolver Agora'}
                </div>
              </Card>
            </motion.div>
            {/* Filtros de dificuldade */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDiff(d)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    activeDiff === d
                      ? 'bg-gold text-surface-primary border-gold'
                      : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Grid de puzzles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {MOCK_PUZZLES.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    variant="gradient"
                    className="cursor-pointer hover:border-gold/40 transition-all group"
                  >
                    {/* Tabuleiro placeholder */}
                    <div className="aspect-square bg-surface-tertiary rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                      <div className="grid grid-cols-8 w-full h-full">
                        {Array.from({ length: 64 }, (_, j) => (
                          <div
                            key={j}
                            className={`${(Math.floor(j / 8) + j % 8) % 2 === 0 ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'}`}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-surface-primary/60">
                        <span className="text-4xl">{p.emoji}</span>
                      </div>
                      {p.solved && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                          ✓ Resolvido
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm text-foreground group-hover:text-gold transition-colors">{p.theme}</div>
                        <div className="text-xs text-muted-foreground">{p.difficulty} · ⭐ {p.rating}</div>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-gold transition-colors" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" size="md">Carregar mais puzzles</Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

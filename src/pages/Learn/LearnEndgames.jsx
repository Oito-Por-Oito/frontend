import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, Play, CheckCircle, Lock } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const ENDGAME_CATEGORIES = [
  {
    id: 'pawn', title: 'Finais de Peão', emoji: '♟️',
    lessons: [
      { id: 1, title: 'Rei e Peão vs Rei', completed: true, locked: false },
      { id: 2, title: 'Oposição', completed: true, locked: false },
      { id: 3, title: 'Peões passados', completed: false, locked: false },
      { id: 4, title: 'Peões isolados', completed: false, locked: true },
    ]
  },
  {
    id: 'rook', title: 'Finais de Torre', emoji: '🏰',
    lessons: [
      { id: 5, title: 'Posição de Lucena', completed: false, locked: false },
      { id: 6, title: 'Posição de Philidor', completed: false, locked: false },
      { id: 7, title: 'Torre e Peão vs Torre', completed: false, locked: true },
    ]
  },
  {
    id: 'bishop', title: 'Finais de Bispo', emoji: '⛪',
    lessons: [
      { id: 8, title: 'Bispos de mesma cor', completed: false, locked: false },
      { id: 9, title: 'Bispos de cor oposta', completed: false, locked: true },
    ]
  },
  {
    id: 'queen', title: 'Finais de Dama', emoji: '👑',
    lessons: [
      { id: 10, title: 'Dama vs Peão na 7ª', completed: false, locked: true },
      { id: 11, title: 'Dama vs Torre', completed: false, locked: true },
    ]
  },
];

export default function LearnEndgames() {
  const [activeCategory, setActiveCategory] = useState('pawn');
  const current = ENDGAME_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Flag className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Finais de Jogo</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Domine os finais de xadrez. Aprenda as técnicas essenciais para converter vantagens em vitórias.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categorias */}
          <div className="lg:col-span-1">
            <Card variant="gradient" className="sticky top-20">
              <h3 className="font-bold text-foreground mb-3">Categorias</h3>
              <div className="space-y-1">
                {ENDGAME_CATEGORIES.map(cat => {
                  const completedCount = cat.lessons.filter(l => l.completed).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                        activeCategory === cat.id
                          ? 'bg-gold/20 text-gold font-semibold border border-gold/30'
                          : 'text-muted-foreground hover:bg-surface-tertiary'
                      }`}
                    >
                      <span>{cat.emoji} {cat.title}</span>
                      <span className="text-xs opacity-60">{completedCount}/{cat.lessons.length}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Lições */}
          <div className="lg:col-span-3">
            {current && (
              <>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span>{current.emoji}</span> {current.title}
                </h2>
                <div className="space-y-3">
                  {current.lessons.map((lesson, i) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Card
                        variant="gradient"
                        className={`flex items-center gap-4 transition-all ${
                          lesson.locked ? 'opacity-60' : 'hover:border-gold/40 cursor-pointer'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          lesson.completed ? 'bg-green-500/20 border border-green-500/30' :
                          lesson.locked ? 'bg-surface-tertiary border border-gold/10' :
                          'bg-gold/10 border border-gold/20'
                        }`}>
                          {lesson.completed ? (
                            <CheckCircle size={18} className="text-green-400" />
                          ) : lesson.locked ? (
                            <Lock size={16} className="text-muted-foreground" />
                          ) : (
                            <Play size={16} className="text-gold" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-sm ${lesson.locked ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {lesson.title}
                          </h3>
                        </div>
                        {!lesson.locked && (
                          <Button
                            variant={lesson.completed ? 'outline' : 'primary'}
                            size="sm"
                            className="shrink-0"
                          >
                            {lesson.completed ? 'Rever' : 'Iniciar'}
                          </Button>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

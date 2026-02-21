import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Lock, CheckCircle, Star, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const LEVELS = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];

const LESSONS = [
  { id: 1, title: 'Como as peças se movem', level: 'Iniciante', duration: '10 min', completed: true, locked: false, emoji: '♟️', rating: 4.9 },
  { id: 2, title: 'Valor das peças', level: 'Iniciante', duration: '8 min', completed: true, locked: false, emoji: '⚖️', rating: 4.8 },
  { id: 3, title: 'Princípios de abertura', level: 'Iniciante', duration: '15 min', completed: false, locked: false, emoji: '📖', rating: 4.9 },
  { id: 4, title: 'Táticas básicas: Garfo', level: 'Iniciante', duration: '12 min', completed: false, locked: false, emoji: '🍴', rating: 4.7 },
  { id: 5, title: 'Táticas básicas: Cravada', level: 'Intermediário', duration: '14 min', completed: false, locked: false, emoji: '📌', rating: 4.8 },
  { id: 6, title: 'Estruturas de peões', level: 'Intermediário', duration: '20 min', completed: false, locked: true, emoji: '🏗️', rating: 4.6 },
  { id: 7, title: 'Finais de torre', level: 'Intermediário', duration: '25 min', completed: false, locked: true, emoji: '🏰', rating: 4.7 },
  { id: 8, title: 'Planejamento estratégico', level: 'Avançado', duration: '30 min', completed: false, locked: true, emoji: '🎯', rating: 4.9 },
  { id: 9, title: 'Sacrifícios posicionais', level: 'Avançado', duration: '28 min', completed: false, locked: true, emoji: '💎', rating: 4.8 },
];

export default function LearnLessons() {
  const [activeLevel, setActiveLevel] = useState('Todos');

  const filtered = LESSONS.filter(l => activeLevel === 'Todos' || l.level === activeLevel);
  const completedCount = LESSONS.filter(l => l.completed).length;

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Aulas</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Aprenda xadrez passo a passo com aulas interativas para todos os níveis.
            </p>
          </motion.div>

          {/* Progresso */}
          <Card variant="gradient" className="mt-6 border border-gold/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Seu Progresso</span>
              <span className="text-sm text-gold font-bold">{completedCount}/{LESSONS.length} aulas</span>
            </div>
            <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all"
                style={{ width: `${(completedCount / LESSONS.length) * 100}%` }}
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {LEVELS.map(l => (
            <button
              key={l}
              onClick={() => setActiveLevel(l)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeLevel === l
                  ? 'bg-gold text-surface-primary border-gold'
                  : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                variant="gradient"
                className={`h-full flex flex-col gap-3 transition-all ${
                  lesson.locked ? 'opacity-60' : 'hover:border-gold/40 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{lesson.emoji}</span>
                  <div className="flex items-center gap-1">
                    {lesson.completed && <CheckCircle size={16} className="text-green-400" />}
                    {lesson.locked && <Lock size={16} className="text-muted-foreground" />}
                  </div>
                </div>

                <div>
                  <h3 className={`font-bold text-sm ${lesson.locked ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {lesson.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{lesson.level}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-yellow-400 flex items-center gap-0.5">
                      <Star size={10} className="fill-yellow-400" />{lesson.rating}
                    </span>
                  </div>
                </div>

                <div className="mt-auto">
                  {lesson.locked ? (
                    <Button variant="ghost" size="sm" className="w-full" disabled>
                      <Lock size={13} className="mr-1" /> Bloqueada
                    </Button>
                  ) : lesson.completed ? (
                    <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                      <Play size={13} /> Rever Aula
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm" className="w-full flex items-center gap-1">
                      <Play size={13} /> Iniciar Aula
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

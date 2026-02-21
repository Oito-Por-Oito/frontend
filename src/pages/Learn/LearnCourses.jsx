import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Star, Clock, Users, ChevronRight, Lock } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const CATEGORIES = ['Todos', 'Iniciante', 'Intermediário', 'Avançado', 'Abertura', 'Final'];

const COURSES = [
  { id: 1, title: 'Xadrez para Iniciantes', category: 'Iniciante', lessons: 12, duration: '2h 30min', students: 4821, rating: 4.9, free: true, emoji: '🌱', instructor: 'Prof. Silva', progress: 33 },
  { id: 2, title: 'Táticas Essenciais', category: 'Intermediário', lessons: 18, duration: '4h 15min', students: 2341, rating: 4.8, free: true, emoji: '⚡', instructor: 'GM Mendes', progress: 0 },
  { id: 3, title: 'Aberturas para Brancas', category: 'Abertura', lessons: 24, duration: '5h 40min', students: 1876, rating: 4.7, free: false, emoji: '📖', instructor: 'IM Souza', progress: 0 },
  { id: 4, title: 'Finais de Peão', category: 'Final', lessons: 15, duration: '3h 20min', students: 1234, rating: 4.8, free: false, emoji: '🏁', instructor: 'FM Lima', progress: 0 },
  { id: 5, title: 'Estratégia Avançada', category: 'Avançado', lessons: 30, duration: '7h 00min', students: 876, rating: 4.9, free: false, emoji: '🎯', instructor: 'GM Petrov', progress: 0 },
  { id: 6, title: 'Defesa Siciliana Completa', category: 'Abertura', lessons: 20, duration: '4h 50min', students: 1543, rating: 4.7, free: false, emoji: '🛡️', instructor: 'IM Costa', progress: 0 },
];

export default function LearnCourses() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = COURSES.filter(c => activeCategory === 'Todos' || c.category === activeCategory);

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Cursos</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Cursos completos e estruturados para evoluir seu jogo de forma consistente.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === c
                  ? 'bg-gold text-surface-primary border-gold'
                  : 'bg-surface-secondary text-muted-foreground border-gold/10 hover:border-gold/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card variant="gradient" className="h-full flex flex-col gap-3 hover:border-gold/40 transition-all cursor-pointer group">
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-surface-tertiary to-surface-secondary rounded-xl flex items-center justify-center text-5xl border border-gold/10 relative overflow-hidden">
                  {course.emoji}
                  {!course.free && (
                    <div className="absolute top-2 right-2 bg-gold text-surface-primary text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock size={10} /> PRO
                    </div>
                  )}
                  {course.free && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      GRÁTIS
                    </div>
                  )}
                  {course.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-tertiary">
                      <div className="h-full bg-gold" style={{ width: `${course.progress}%` }} />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-foreground group-hover:text-gold transition-colors">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{course.instructor}</p>

                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Star size={10} className="text-yellow-400 fill-yellow-400" />{course.rating}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{course.duration}</span>
                    <span className="flex items-center gap-1"><Users size={10} />{course.students.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs bg-surface-tertiary text-muted-foreground px-2 py-1 rounded-full border border-gold/10">
                    {course.lessons} aulas
                  </span>
                  <button className="text-gold text-sm font-medium flex items-center gap-1 hover:text-gold-light transition-colors">
                    {course.progress > 0 ? 'Continuar' : 'Ver Curso'} <ChevronRight size={14} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

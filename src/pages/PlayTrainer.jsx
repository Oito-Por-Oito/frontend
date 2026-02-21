import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Star, ChevronRight, BookOpen, Target, Brain } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const TRAINERS = [
  {
    id: 1,
    name: 'Mestre Silva',
    emoji: '🧔',
    specialty: 'Aberturas',
    level: 'Intermediário',
    rating: 1800,
    description: 'Especialista em aberturas clássicas. Ideal para jogadores que querem melhorar o início da partida.',
    lessons: 24,
    students: 312,
    color: 'from-blue-600/20 to-blue-900/10',
    border: 'border-blue-500/30',
  },
  {
    id: 2,
    name: 'Dra. Carvalho',
    emoji: '👩‍🏫',
    specialty: 'Finais',
    level: 'Avançado',
    rating: 2200,
    description: 'Mestre em finais de jogo. Aprenda a converter vantagens e defender posições difíceis.',
    lessons: 36,
    students: 198,
    color: 'from-purple-600/20 to-purple-900/10',
    border: 'border-purple-500/30',
  },
  {
    id: 3,
    name: 'Prof. Rodrigues',
    emoji: '👨‍💼',
    specialty: 'Táticas',
    level: 'Todos os níveis',
    rating: 2000,
    description: 'Foco em combinações táticas e padrões de ataque. Melhore seu jogo com exercícios práticos.',
    lessons: 48,
    students: 521,
    color: 'from-green-600/20 to-green-900/10',
    border: 'border-green-500/30',
  },
  {
    id: 4,
    name: 'Iniciante Amigo',
    emoji: '🌱',
    specialty: 'Iniciantes',
    level: 'Iniciante',
    rating: 1200,
    description: 'Perfeito para quem está aprendendo. Paciência e didática para os primeiros passos no xadrez.',
    lessons: 20,
    students: 876,
    color: 'from-yellow-600/20 to-yellow-900/10',
    border: 'border-yellow-500/30',
  },
];

const FEATURES = [
  { icon: Brain, title: 'Feedback em Tempo Real', desc: 'Receba dicas e análises durante a partida.' },
  { icon: Target, title: 'Exercícios Personalizados', desc: 'Treinos adaptados ao seu nível e objetivos.' },
  { icon: BookOpen, title: 'Plano de Estudos', desc: 'Currículo estruturado para evoluir rapidamente.' },
];

export default function PlayTrainer() {
  const [selected, setSelected] = useState(null);

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Jogar contra o Treinador</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Aprenda enquanto joga com treinadores especializados. Receba feedback personalizado e evolua mais rápido.
            </p>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card variant="gradient" className="p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <f.icon size={18} className="text-gold" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{f.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{f.desc}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-foreground mb-5">Escolha seu Treinador</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TRAINERS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                variant="gradient"
                className={`h-full flex flex-col gap-4 bg-gradient-to-br ${t.color} ${t.border} cursor-pointer
                  transition-all hover:scale-[1.02] ${selected === t.id ? 'ring-2 ring-gold' : ''}`}
                onClick={() => setSelected(t.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-tertiary flex items-center justify-center text-4xl shrink-0 border border-gold/20">
                    {t.emoji}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-foreground">{t.name}</h3>
                    <div className="text-gold text-sm font-medium">{t.specialty}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground bg-surface-tertiary px-2 py-0.5 rounded-full border border-gold/10">
                        {t.level}
                      </span>
                      <span className="text-xs text-gold font-mono">⭐ {t.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{t.description}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>📚 {t.lessons} lições</span>
                  <span>👥 {t.students} alunos</span>
                </div>

                <Button
                  variant={selected === t.id ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full mt-auto flex items-center gap-2"
                >
                  {selected === t.id ? 'Treinador Selecionado ✓' : 'Selecionar Treinador'}
                  {selected !== t.id && <ChevronRight size={14} />}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <Button variant="primary" size="lg" className="px-10">
              Começar Sessão de Treino
            </Button>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Play, CheckCircle, Lock, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const CONCEPTS = [
  {
    id: 1,
    category: 'Princípios Fundamentais',
    emoji: '🏛️',
    items: [
      { id: 1, title: 'Controle do Centro', desc: 'Por que e4, d4, e5, d5 são as jogadas mais importantes.', completed: true, locked: false },
      { id: 2, title: 'Desenvolvimento das Peças', desc: 'Desenvolva cavalos antes de bispos, bispos antes de torres.', completed: true, locked: false },
      { id: 3, title: 'Segurança do Rei', desc: 'Roque cedo e mantenha peões na frente do rei.', completed: false, locked: false },
      { id: 4, title: 'Atividade das Peças', desc: 'Uma peça ativa vale mais do que uma passiva.', completed: false, locked: false },
    ]
  },
  {
    id: 2,
    category: 'Conceitos Táticos',
    emoji: '⚡',
    items: [
      { id: 5, title: 'Ameaças Duplas', desc: 'Crie duas ameaças simultâneas que o adversário não pode defender.', completed: false, locked: false },
      { id: 6, title: 'Peças Sobrecarregadas', desc: 'Explore peças que defendem múltiplos alvos ao mesmo tempo.', completed: false, locked: true },
      { id: 7, title: 'Zwischenzug', desc: 'A jogada intermediária que muda tudo.', completed: false, locked: true },
    ]
  },
  {
    id: 3,
    category: 'Conceitos Estratégicos',
    emoji: '🎯',
    items: [
      { id: 8, title: 'Peões Passados', desc: 'Um peão passado é um criminoso que deve ser mantido preso.', completed: false, locked: false },
      { id: 9, title: 'Casas Fracas', desc: 'Identifique e explore casas que não podem ser defendidas por peões.', completed: false, locked: true },
      { id: 10, title: 'Estruturas de Peões', desc: 'Como a estrutura de peões determina o plano de jogo.', completed: false, locked: true },
    ]
  },
  {
    id: 4,
    category: 'Finais Essenciais',
    emoji: '🏁',
    items: [
      { id: 11, title: 'Rei Ativo no Final', desc: 'No final, o rei é uma peça forte. Use-o!', completed: false, locked: false },
      { id: 12, title: 'Regra do Quadrado', desc: 'Como calcular se um rei alcança um peão passado.', completed: false, locked: true },
    ]
  },
];

export default function LearnCriticalIdeas() {
  const [activeCategory, setActiveCategory] = useState(1);
  const current = CONCEPTS.find(c => c.id === activeCategory);
  const totalCompleted = CONCEPTS.flatMap(c => c.items).filter(i => i.completed).length;
  const totalItems = CONCEPTS.flatMap(c => c.items).length;

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Lightbulb className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Ideias Críticas</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Os conceitos fundamentais que todo jogador de xadrez precisa dominar para evoluir de verdade.
            </p>
          </motion.div>

          {/* Progresso geral */}
          <Card variant="gradient" className="mt-6 border border-gold/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Progresso Geral</span>
              <span className="text-sm text-gold font-bold">{totalCompleted}/{totalItems} conceitos</span>
            </div>
            <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all"
                style={{ width: `${(totalCompleted / totalItems) * 100}%` }}
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de categorias */}
          <div className="lg:col-span-1">
            <Card variant="gradient" className="sticky top-20">
              <h3 className="font-bold text-foreground mb-3">Categorias</h3>
              <div className="space-y-1">
                {CONCEPTS.map(cat => {
                  const done = cat.items.filter(i => i.completed).length;
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
                      <span>{cat.emoji} {cat.category}</span>
                      <span className="text-xs opacity-60">{done}/{cat.items.length}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Conteúdo */}
          <div className="lg:col-span-3">
            {current && (
              <>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span>{current.emoji}</span> {current.category}
                </h2>
                <div className="space-y-3">
                  {current.items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Card
                        variant="gradient"
                        className={`flex items-center gap-4 transition-all ${
                          item.locked ? 'opacity-60' : 'hover:border-gold/40 cursor-pointer group'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          item.completed ? 'bg-green-500/20 border border-green-500/30' :
                          item.locked ? 'bg-surface-tertiary border border-gold/10' :
                          'bg-gold/10 border border-gold/20'
                        }`}>
                          {item.completed ? (
                            <CheckCircle size={18} className="text-green-400" />
                          ) : item.locked ? (
                            <Lock size={16} className="text-muted-foreground" />
                          ) : (
                            <Lightbulb size={16} className="text-gold" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-sm ${item.locked ? 'text-muted-foreground' : 'text-foreground group-hover:text-gold transition-colors'}`}>
                            {item.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.desc}</p>
                        </div>
                        {!item.locked && (
                          <Button
                            variant={item.completed ? 'outline' : 'primary'}
                            size="sm"
                            className="shrink-0 flex items-center gap-1"
                          >
                            {item.completed ? 'Rever' : <><Play size={12} /> Aprender</>}
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

import React from 'react';
import { motion } from 'framer-motion';
import { User, ChevronRight, Target, Puzzle, BarChart2, BookOpen } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const SOLO_MODES = [
  {
    id: 1, title: 'Puzzles Táticos', desc: 'Resolva puzzles do seu nível e melhore sua visão tática progressivamente.',
    emoji: '⚡', color: 'from-yellow-600/20 to-yellow-900/10', border: 'border-yellow-500/30',
    stats: '2.847 puzzles resolvidos', href: '/puzzles'
  },
  {
    id: 2, title: 'Jogar contra Bots', desc: 'Desafie bots de diferentes níveis, do iniciante ao mestre.',
    emoji: '🤖', color: 'from-blue-600/20 to-blue-900/10', border: 'border-blue-500/30',
    stats: '47 bots disponíveis', href: '/play-computer'
  },
  {
    id: 3, title: 'Praticar Aberturas', desc: 'Treine as linhas das suas aberturas favoritas contra a engine.',
    emoji: '📖', color: 'from-green-600/20 to-green-900/10', border: 'border-green-500/30',
    stats: '1.327 aberturas catalogadas', href: '/learn/openings'
  },
  {
    id: 4, title: 'Análise de Partidas', desc: 'Analise suas partidas com engine e descubra onde pode melhorar.',
    emoji: '🔍', color: 'from-purple-600/20 to-purple-900/10', border: 'border-purple-500/30',
    stats: 'Engine Stockfish 16', href: '/learn/analysis'
  },
  {
    id: 5, title: 'Lições Interativas', desc: 'Aprenda conceitos de xadrez com lições guiadas passo a passo.',
    emoji: '🎓', color: 'from-red-600/20 to-red-900/10', border: 'border-red-500/30',
    stats: '120+ lições disponíveis', href: '/learn/lessons'
  },
  {
    id: 6, title: 'Finais de Jogo', desc: 'Pratique os finais mais importantes com exercícios específicos.',
    emoji: '🏁', color: 'from-teal-600/20 to-teal-900/10', border: 'border-teal-500/30',
    stats: '4 categorias de finais', href: '/learn/endgames'
  },
];

const DAILY_STATS = [
  { label: 'Puzzles hoje', value: '12', icon: Target },
  { label: 'Lições concluídas', value: '3', icon: BookOpen },
  { label: 'Partidas vs bot', value: '5', icon: User },
  { label: 'Análises feitas', value: '2', icon: BarChart2 },
];

export default function MaisXadrezSolo() {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <User className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Xadrez Solo</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Pratique e aprenda no seu próprio ritmo. Todos os modos de jogo individual em um só lugar.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Estatísticas diárias */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {DAILY_STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Card variant="gradient" className="text-center py-4">
                  <Icon size={20} className="text-gold mx-auto mb-1" />
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Modos solo */}
        <h2 className="text-xl font-bold text-foreground mb-5">Modos de Prática</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOLO_MODES.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}>
              <Card
                variant="gradient"
                className={`h-full flex flex-col gap-3 bg-gradient-to-br ${m.color} ${m.border} hover:scale-[1.02] transition-all cursor-pointer group`}
              >
                <span className="text-4xl">{m.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground group-hover:text-gold transition-colors">{m.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                  <p className="text-xs text-gold mt-2 font-medium">{m.stats}</p>
                </div>
                <a href={m.href} className="text-gold text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all mt-auto">
                  Começar <ChevronRight size={14} />
                </a>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

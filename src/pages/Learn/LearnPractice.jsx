import React from 'react';
import { motion } from 'framer-motion';
import { Target, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const PRACTICE_MODES = [
  { id: 1, title: 'Praticar Aberturas', desc: 'Treine as principais linhas das suas aberturas favoritas.', emoji: '📖', color: 'from-blue-600/20 to-blue-900/10', border: 'border-blue-500/30', href: '/learn/openings' },
  { id: 2, title: 'Praticar Finais', desc: 'Exercícios práticos de finais de jogo com engine.', emoji: '🏁', color: 'from-green-600/20 to-green-900/10', border: 'border-green-500/30', href: '/learn/endgames' },
  { id: 3, title: 'Puzzles Táticos', desc: 'Resolva puzzles para melhorar sua visão tática.', emoji: '⚡', color: 'from-yellow-600/20 to-yellow-900/10', border: 'border-yellow-500/30', href: '/puzzles' },
  { id: 4, title: 'Jogo Livre', desc: 'Jogue contra a engine em qualquer dificuldade.', emoji: '♟️', color: 'from-purple-600/20 to-purple-900/10', border: 'border-purple-500/30', href: '/play/computer' },
  { id: 5, title: 'Coordenadas', desc: 'Treine identificar coordenadas do tabuleiro rapidamente.', emoji: '🗺️', color: 'from-red-600/20 to-red-900/10', border: 'border-red-500/30', href: '#' },
  { id: 6, title: 'Visão do Tabuleiro', desc: 'Exercícios para melhorar sua visão espacial no xadrez.', emoji: '👁️', color: 'from-teal-600/20 to-teal-900/10', border: 'border-teal-500/30', href: '#' },
];

export default function LearnPractice() {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Target className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Praticar</h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Escolha um modo de prática para aprimorar habilidades específicas do seu jogo.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRACTICE_MODES.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card
                variant="gradient"
                className={`h-full flex flex-col gap-3 bg-gradient-to-br ${m.color} ${m.border} hover:scale-[1.02] transition-all cursor-pointer group`}
              >
                <span className="text-4xl">{m.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground group-hover:text-gold transition-colors">{m.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                </div>
                <button className="text-gold text-sm font-medium flex items-center gap-1 hover:text-gold-light transition-colors mt-auto">
                  Começar <ChevronRight size={14} />
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

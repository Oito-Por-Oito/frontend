import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, ChevronRight, Star } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const VARIANTS = [
  {
    id: 'chess960',
    name: 'Chess960',
    emoji: '🎲',
    description: 'As peças iniciais são embaralhadas aleatoriamente. 960 posições iniciais possíveis.',
    players: '2',
    difficulty: 'Médio',
    popular: true,
    color: 'from-purple-600/20 to-purple-800/10',
    border: 'border-purple-500/30',
  },
  {
    id: 'crazyhouse',
    name: 'Crazyhouse',
    emoji: '🏠',
    description: 'Peças capturadas podem ser colocadas de volta no tabuleiro como suas próprias.',
    players: '2',
    difficulty: 'Difícil',
    popular: true,
    color: 'from-red-600/20 to-red-800/10',
    border: 'border-red-500/30',
  },
  {
    id: 'four-player',
    name: '4 Jogadores',
    emoji: '👥',
    description: 'Xadrez para quatro jogadores num tabuleiro especial. Alianças e traições!',
    players: '4',
    difficulty: 'Médio',
    popular: true,
    color: 'from-blue-600/20 to-blue-800/10',
    border: 'border-blue-500/30',
  },
  {
    id: 'king-of-the-hill',
    name: 'Rei da Colina',
    emoji: '⛰️',
    description: 'Leve seu rei ao centro do tabuleiro para vencer. Estratégia completamente diferente.',
    players: '2',
    difficulty: 'Fácil',
    popular: false,
    color: 'from-green-600/20 to-green-800/10',
    border: 'border-green-500/30',
  },
  {
    id: 'three-check',
    name: 'Três Xeques',
    emoji: '3️⃣',
    description: 'Dê xeque ao rei adversário três vezes para vencer. Ataques são a prioridade.',
    players: '2',
    difficulty: 'Médio',
    popular: false,
    color: 'from-yellow-600/20 to-yellow-800/10',
    border: 'border-yellow-500/30',
  },
  {
    id: 'antichess',
    name: 'Antixadrez',
    emoji: '🔄',
    description: 'O objetivo é perder todas as suas peças! Capturas são obrigatórias.',
    players: '2',
    difficulty: 'Difícil',
    popular: false,
    color: 'from-pink-600/20 to-pink-800/10',
    border: 'border-pink-500/30',
  },
  {
    id: 'atomic',
    name: 'Atômico',
    emoji: '💥',
    description: 'Capturas causam explosões que eliminam peças adjacentes. Caos controlado.',
    players: '2',
    difficulty: 'Difícil',
    popular: false,
    color: 'from-orange-600/20 to-orange-800/10',
    border: 'border-orange-500/30',
  },
  {
    id: 'horde',
    name: 'Horda',
    emoji: '🐝',
    description: 'Brancas têm 36 peões, pretas têm o conjunto normal. Sobreviva à horda!',
    players: '2',
    difficulty: 'Médio',
    popular: false,
    color: 'from-teal-600/20 to-teal-800/10',
    border: 'border-teal-500/30',
  },
];

const DIFFICULTY_COLORS = {
  Fácil: 'text-green-400 bg-green-500/10 border-green-500/20',
  Médio: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Difícil: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function Variants() {
  const popular = VARIANTS.filter(v => v.popular);
  const others = VARIANTS.filter(v => !v.popular);

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <Gamepad2 className="text-gold" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-gold">Variantes</h1>
            </div>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl">
              Explore modos de jogo únicos e desafiadores. Do Chess960 ao xadrez para 4 jogadores, há algo para todos.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Populares */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Star size={18} className="text-gold" />
            Mais Populares
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popular.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card
                  variant="gradient"
                  className={`h-full flex flex-col gap-3 bg-gradient-to-br ${v.color} ${v.border} hover:scale-[1.02] transition-all cursor-pointer group`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{v.emoji}</span>
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-gold transition-colors">{v.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[v.difficulty]}`}>
                          {v.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground">{v.players} jogadores</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">{v.description}</p>
                  <Button variant="primary" size="sm" className="w-full mt-auto">
                    Jogar Agora
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Outras variantes */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Todas as Variantes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {others.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  variant="gradient"
                  className={`h-full flex flex-col gap-3 ${v.border} hover:scale-[1.02] transition-all cursor-pointer group`}
                >
                  <span className="text-3xl">{v.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">{v.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[v.difficulty]} mt-1 inline-block`}>
                      {v.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex-1">{v.description}</p>
                  <button className="text-gold text-sm font-medium flex items-center gap-1 hover:text-gold-light transition-colors mt-auto">
                    Jogar <ChevronRight size={14} />
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

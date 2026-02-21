import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Trophy, Play, Info } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const MODES = [
  {
    id: '3min',
    label: '3 Minutos',
    icon: '⚡',
    description: 'Resolva o máximo de puzzles em 3 minutos. Cada erro custa 10 segundos.',
    color: 'from-orange-600/20 to-orange-900/10',
    border: 'border-orange-500/30',
    recommended: false,
  },
  {
    id: '5min',
    label: '5 Minutos',
    icon: '🔥',
    description: 'O modo clássico de Puzzle Rush. 5 minutos para alcançar o maior score possível.',
    color: 'from-gold/20 to-yellow-900/10',
    border: 'border-gold/40',
    recommended: true,
  },
  {
    id: 'survival',
    label: 'Sobrevivência',
    icon: '💀',
    description: 'Sem limite de tempo, mas 3 erros e o jogo acaba. Até onde você chega?',
    color: 'from-red-600/20 to-red-900/10',
    border: 'border-red-500/30',
    recommended: false,
  },
];

export default function PuzzleRush() {
  const [selectedMode, setSelectedMode] = useState('5min');

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-6xl mb-4">⚡</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gold mb-3">Corrida de Puzzles</h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              Resolva puzzles contra o relógio! Teste sua velocidade e precisão tática em modo frenético.
            </p>
          </motion.div>

          {/* Recorde pessoal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Card variant="gradient" className="inline-flex items-center gap-4 px-6 py-3 border border-gold/30">
              <Trophy size={20} className="text-gold" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Seu recorde pessoal</div>
                <div className="text-xl font-bold text-gold">— puzzles</div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Seleção de modo */}
        <h2 className="text-xl font-bold text-foreground mb-5 text-center">Escolha o Modo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {MODES.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                variant="gradient"
                className={`relative cursor-pointer text-center flex flex-col gap-3 bg-gradient-to-br ${m.color} ${m.border}
                  transition-all hover:scale-[1.03] ${selectedMode === m.id ? 'ring-2 ring-gold' : ''}`}
                onClick={() => setSelectedMode(m.id)}
              >
                {m.recommended && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold text-surface-primary text-xs font-bold px-3 py-0.5 rounded-full">
                    Recomendado
                  </div>
                )}
                <div className="text-4xl pt-2">{m.icon}</div>
                <div className="font-bold text-lg text-foreground">{m.label}</div>
                <p className="text-xs text-muted-foreground">{m.description}</p>
                {selectedMode === m.id && (
                  <div className="text-gold text-xs font-semibold">✓ Selecionado</div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Regras */}
        <Card variant="gradient" className="mb-6 border border-gold/20">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-gold shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Como funciona</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Puzzles aparecem um por vez, cada vez mais difíceis</li>
                <li>• Acerte para ganhar pontos e avançar para o próximo</li>
                <li>• Cada erro desconta tempo (modo cronometrado) ou vida (sobrevivência)</li>
                <li>• Seu score é o número de puzzles resolvidos corretamente</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Botão de iniciar */}
        <div className="text-center">
          <Button variant="primary" size="lg" className="px-12 flex items-center gap-3 mx-auto text-lg">
            <Play size={20} />
            Iniciar Corrida
          </Button>
        </div>

        {/* Ranking */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-gold" /> Top Jogadores
          </h2>
          <Card variant="gradient">
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => ({
                rank: i + 1,
                name: ['SpeedKing', 'TacticsMaster', 'PuzzleQueen', 'BlitzWizard', 'ChessRacer'][i],
                score: [98, 87, 82, 79, 74][i],
                mode: '5min',
              })).map(p => (
                <div key={p.rank} className="flex items-center gap-3 py-2 border-b border-gold/5 last:border-0">
                  <span className="text-lg w-8 text-center">{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][p.rank - 1]}</span>
                  <div className="flex-1 font-medium text-foreground text-sm">{p.name}</div>
                  <span className="text-xs text-muted-foreground">{p.mode}</span>
                  <span className="font-bold text-gold font-mono">{p.score}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

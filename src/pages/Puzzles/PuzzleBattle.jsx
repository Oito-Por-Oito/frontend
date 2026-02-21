import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Users, Play, Trophy } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function PuzzleBattle() {
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-surface-secondary to-transparent border-b border-gold/10 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-6xl mb-4">⚔️</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gold mb-3">Batalha de Puzzles</h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              Desafie outros jogadores em duelos de puzzles em tempo real. Quem resolver mais rápido vence!
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Card variant="gradient" className="text-center border border-gold/30 flex flex-col gap-4">
            <div className="text-4xl">🎯</div>
            <h2 className="text-xl font-bold text-foreground">Desafio Rápido</h2>
            <p className="text-sm text-muted-foreground">
              Encontre um oponente aleatório e batalhe em 5 puzzles. O mais rápido e preciso vence.
            </p>
            <Button variant="primary" size="md" className="mt-auto flex items-center gap-2 mx-auto">
              <Play size={16} /> Batalha Rápida
            </Button>
          </Card>

          <Card variant="gradient" className="text-center flex flex-col gap-4">
            <div className="text-4xl">👥</div>
            <h2 className="text-xl font-bold text-foreground">Desafiar Amigo</h2>
            <p className="text-sm text-muted-foreground">
              Crie uma sala e convide um amigo para uma batalha privada de puzzles.
            </p>
            <Button variant="outline" size="md" className="mt-auto flex items-center gap-2 mx-auto">
              <Users size={16} /> Criar Sala
            </Button>
          </Card>
        </div>

        {/* Partidas ao vivo */}
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Swords size={18} className="text-gold" /> Batalhas em Andamento
        </h2>
        <Card variant="gradient">
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => ({
              p1: ['TacticsMaster', 'PuzzleKing', 'ChessWizard', 'BlitzQueen'][i],
              p2: ['SpeedSolver', 'BrainStorm', 'NightOwl', 'DailyGrind'][i],
              score1: [3, 2, 4, 1][i],
              score2: [2, 3, 3, 2][i],
              puzzle: [5, 5, 7, 3][i],
            })).map((b, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gold/5 last:border-0">
                <div className="flex-1 text-sm font-medium text-foreground truncate">{b.p1}</div>
                <div className="text-gold font-bold font-mono text-sm shrink-0">{b.score1} - {b.score2}</div>
                <div className="flex-1 text-sm font-medium text-foreground text-right truncate">{b.p2}</div>
                <button className="text-xs text-gold hover:text-gold-light ml-2 shrink-0">👁️</button>
              </div>
            ))}
          </div>
        </Card>

        {/* Ranking */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-gold" /> Ranking de Batalhas
          </h2>
          <Card variant="gradient">
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => ({
                rank: i + 1,
                name: ['BattleKing', 'TacticsBeast', 'PuzzleWarrior', 'SpeedDemon', 'NightStalker'][i],
                wins: [142, 128, 115, 98, 87][i],
                wr: [78, 72, 68, 65, 61][i],
              })).map(p => (
                <div key={p.rank} className="flex items-center gap-3 py-2 border-b border-gold/5 last:border-0">
                  <span className="text-lg w-8 text-center">{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][p.rank - 1]}</span>
                  <div className="flex-1 font-medium text-foreground text-sm">{p.name}</div>
                  <span className="text-xs text-muted-foreground">{p.wins} vitórias</span>
                  <span className="font-bold text-green-400 text-sm">{p.wr}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

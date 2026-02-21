import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Trophy, Target, Clock, Percent, Puzzle } from "lucide-react";
import Card from "@/components/ui/Card";

function StatItem({ icon: Icon, label, value, subValue, color = "text-gold" }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-tertiary/30">
      <div className={`p-2 rounded-lg bg-surface-tertiary`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {subValue && (
          <p className="text-xs text-muted-foreground/70">{subValue}</p>
        )}
      </div>
    </div>
  );
}

function formatPlayTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export default function ProgressCard({ stats }) {
  const winRate = stats.totalGames > 0
    ? ((stats.wins / stats.totalGames) * 100).toFixed(1)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card variant="gradient">
        <Card.Header>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold" />
            <Card.Title as="h3" className="text-lg">Seu Progresso</Card.Title>
          </div>
        </Card.Header>
        
        <Card.Content>
          <div className="grid grid-cols-2 gap-3">
            <StatItem
              icon={Trophy}
              label="Partidas"
              value={stats.totalGames}
              subValue={`${stats.wins}V / ${stats.draws}E / ${stats.losses}D`}
            />
            <StatItem
              icon={Target}
              label="Taxa de Vitória"
              value={`${winRate}%`}
              color="text-green-500"
            />
            <StatItem
              icon={Puzzle}
              label="Puzzles Resolvidos"
              value={stats.puzzlesSolved}
              color="text-purple-500"
            />
            <StatItem
              icon={Percent}
              label="Acurácia Média"
              value={`${stats.accuracy}%`}
              color="text-blue-500"
            />
          </div>
          
          <div className="mt-4 pt-4 border-t border-gold/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tempo total de jogo</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {formatPlayTime(stats.totalPlayTime)}
              </span>
            </div>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}

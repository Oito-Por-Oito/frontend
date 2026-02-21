import React from "react";
import { motion } from "framer-motion";
import { Trophy, Target, TrendingUp, Swords, Award, Percent } from "lucide-react";
import Card from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";

export default function PlayerStatsCard() {
  const { profile } = useAuth();

  const stats = [
    {
      icon: Swords,
      label: "Partidas",
      value: profile?.total_games || 0,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      icon: Trophy,
      label: "Vitórias",
      value: profile?.wins || 0,
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      icon: Target,
      label: "Derrotas",
      value: profile?.losses || 0,
      color: "text-red-400",
      bgColor: "bg-red-500/20"
    },
    {
      icon: Award,
      label: "Empates",
      value: profile?.draws || 0,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20"
    },
  ];

  // Calculate win rate
  const totalGames = profile?.total_games || 0;
  const winRate = totalGames > 0 
    ? Math.round((profile?.wins || 0) / totalGames * 100) 
    : 0;

  const ratings = [
    { label: "Blitz", value: profile?.rating_blitz || 800, icon: "⚡" },
    { label: "Rápido", value: profile?.rating_rapid || 800, icon: "🕐" },
    { label: "Clássico", value: profile?.rating_classical || 800, icon: "♟️" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="h-full">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gold" />
          Suas Estatísticas
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex items-center gap-3 p-3 rounded-xl ${stat.bgColor}`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Win Rate */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gold/10 mb-4">
          <Percent className="w-5 h-5 text-gold" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Taxa de Vitória</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-surface-tertiary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${winRate}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                />
              </div>
              <span className="text-sm font-bold text-gold">{winRate}%</span>
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Ratings</p>
          <div className="grid grid-cols-3 gap-2">
            {ratings.map((rating) => (
              <div
                key={rating.label}
                className="text-center p-2 rounded-lg bg-surface-tertiary"
              >
                <span className="text-lg">{rating.icon}</span>
                <p className="text-xs text-muted-foreground mt-1">{rating.label}</p>
                <p className="text-sm font-bold text-gold">{rating.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

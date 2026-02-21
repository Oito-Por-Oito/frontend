import React from "react";
import { motion } from "framer-motion";
import { Target, Puzzle, Gamepad2, BookOpen, Check } from "lucide-react";
import Card from "@/components/ui/Card";

const goalConfig = {
  puzzles: {
    icon: Puzzle,
    label: "Puzzles",
    color: "from-purple-500 to-purple-600"
  },
  games: {
    icon: Gamepad2,
    label: "Partidas",
    color: "from-blue-500 to-blue-600"
  },
  studyMinutes: {
    icon: BookOpen,
    label: "Estudo",
    unit: "min",
    color: "from-green-500 to-green-600"
  }
};

function GoalProgress({ type, current, target }) {
  const config = goalConfig[type];
  const Icon = config.icon;
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;
  const displayValue = config.unit ? `${current}/${target} ${config.unit}` : `${current}/${target}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-gradient-to-r ${config.color} bg-opacity-20`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-foreground">{config.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{displayValue}</span>
          {isComplete && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
            >
              <Check className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${isComplete ? 'from-green-500 to-green-400' : config.color}`}
        />
      </div>
    </motion.div>
  );
}

export default function DailyGoalsCard({ dailyGoals }) {
  const totalGoals = Object.keys(dailyGoals).length;
  const completedGoals = Object.values(dailyGoals).filter(
    goal => goal.current >= goal.target
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card variant="gradient">
        <Card.Header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-gold" />
              <Card.Title as="h3" className="text-lg">Metas Diárias</Card.Title>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedGoals}/{totalGoals} completas
            </span>
          </div>
        </Card.Header>
        
        <Card.Content className="space-y-4">
          {Object.entries(dailyGoals).map(([type, goal], index) => (
            <GoalProgress
              key={type}
              type={type}
              current={goal.current}
              target={goal.target}
            />
          ))}
        </Card.Content>
      </Card>
    </motion.div>
  );
}

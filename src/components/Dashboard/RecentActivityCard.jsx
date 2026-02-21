import React from "react";
import { motion } from "framer-motion";
import { Activity, Trophy, XCircle, Puzzle, BookOpen, Award, Minus } from "lucide-react";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const activityConfig = {
  game: {
    win: { icon: Trophy, color: "text-green-500", bg: "bg-green-500/10" },
    loss: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
    draw: { icon: Minus, color: "text-yellow-500", bg: "bg-yellow-500/10" }
  },
  puzzle: {
    success: { icon: Puzzle, color: "text-purple-500", bg: "bg-purple-500/10" },
    fail: { icon: Puzzle, color: "text-red-500", bg: "bg-red-500/10" }
  },
  lesson: {
    complete: { icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" }
  },
  achievement: {
    unlock: { icon: Award, color: "text-gold", bg: "bg-gold/10" }
  }
};

function ActivityItem({ activity, index }) {
  const config = activityConfig[activity.type]?.[activity.result] || {
    icon: Activity,
    color: "text-muted-foreground",
    bg: "bg-surface-tertiary"
  };
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center gap-3 py-2"
    >
      <div className={cn("p-2 rounded-lg", config.bg)}>
        <Icon className={cn("w-4 h-4", config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{activity.description}</p>
        <p className="text-xs text-muted-foreground">{activity.time}</p>
      </div>
    </motion.div>
  );
}

export default function RecentActivityCard({ recentActivity }) {
  if (!recentActivity || recentActivity.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card variant="gradient">
        <Card.Header>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gold" />
            <Card.Title as="h3" className="text-lg">Atividades Recentes</Card.Title>
          </div>
        </Card.Header>
        
        <Card.Content>
          <div className="divide-y divide-gold/5">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <ActivityItem key={activity.id} activity={activity} index={index} />
            ))}
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}

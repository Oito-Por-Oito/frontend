import React from "react";
import { motion } from "framer-motion";
import { Play, Puzzle, BookOpen, Gamepad2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";

const iconMap = {
  game: Gamepad2,
  puzzle: Puzzle,
  lesson: BookOpen,
  gamepad: Gamepad2,
  book: BookOpen
};

function ContinueItem({ item, index }) {
  const Icon = iconMap[item.icon] || iconMap[item.type] || Play;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link
        to={item.href}
        className="group flex items-center gap-3 p-3 rounded-xl bg-surface-tertiary/50 hover:bg-surface-tertiary transition-all duration-200 border border-transparent hover:border-gold/20"
      >
        <div className="p-2 rounded-lg bg-gold/10 group-hover:bg-gold/20 transition-colors">
          <Icon className="w-5 h-5 text-gold" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
          <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
          
          {item.progress > 0 && (
            <div className="mt-1.5 h-1 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          )}
        </div>
        
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  );
}

export default function ContinueWhereYouLeftCard({ continueFrom }) {
  if (!continueFrom || continueFrom.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card variant="gradient">
        <Card.Header>
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-gold" />
            <Card.Title as="h3" className="text-lg">Continue de onde parou</Card.Title>
          </div>
        </Card.Header>
        
        <Card.Content className="space-y-2">
          {continueFrom.map((item, index) => (
            <ContinueItem key={item.id} item={item} index={index} />
          ))}
        </Card.Content>
      </Card>
    </motion.div>
  );
}

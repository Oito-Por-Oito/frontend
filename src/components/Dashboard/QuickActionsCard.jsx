import React from "react";
import { motion } from "framer-motion";
import { Zap, Gamepad2, Puzzle, BookOpen, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const quickActions = [
  {
    icon: Gamepad2,
    label: "Jogar Agora",
    href: "/play",
    variant: "primary"
  },
  {
    icon: Puzzle,
    label: "Puzzle Diário",
    href: "/puzzle",
    variant: "secondary"
  },
  {
    icon: BookOpen,
    label: "Aprender",
    href: "/learn",
    variant: "secondary"
  },
  {
    icon: Trophy,
    label: "Ver Ranking",
    href: "/ratings",
    variant: "secondary"
  }
];

export default function QuickActionsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <Card variant="gradient">
        <Card.Header>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-gold" />
            <Card.Title as="h3" className="text-lg">Ações Rápidas</Card.Title>
          </div>
        </Card.Header>
        
        <Card.Content>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.6 + index * 0.1 }}
                >
                  <Link to={action.href}>
                    <Button
                      variant={action.variant}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {action.label}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}

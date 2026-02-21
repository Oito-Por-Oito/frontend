import React from "react";
import { motion } from "framer-motion";
import { Flame, Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function WelcomeCard({ user, streak, lastSeen }) {
  const { profile } = useAuth();
  const greeting = getGreeting();
  const userName = profile?.display_name || profile?.username || user?.email?.split("@")[0] || "Jogador";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const lastSeenText = lastSeen
    ? formatDistanceToNow(new Date(lastSeen), { addSuffix: true, locale: ptBR })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card variant="gradient" className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4">
          {/* Avatar with better styling */}
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-3 ring-gold/40 bg-surface-tertiary">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl text-muted-foreground bg-gradient-to-br from-surface-secondary to-surface-tertiary">
                  👤
                </div>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-surface-primary" />
          </div>
          
          <div className="flex-1">
            <p className="text-muted-foreground text-sm">{greeting},</p>
            <h2 className="text-2xl font-bold text-gold capitalize">{userName}</h2>
            
            <div className="flex items-center gap-4 mt-2">
              {/* Streak */}
              <div className="flex items-center gap-1.5 text-sm">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-foreground font-medium">{streak}</span>
                <span className="text-muted-foreground">dias</span>
              </div>
              
              {/* Last seen */}
              {lastSeenText && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Último acesso {lastSeenText}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

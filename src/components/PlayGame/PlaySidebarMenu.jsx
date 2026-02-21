import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui";

const MENU_ITEMS = [
  {
    icon: "⚡",
    title: "Jogue online",
    desc: "Jogar contra uma pessoa com habilidades parecidas",
    route: "/play-online",
    color: "text-yellow-400",
  },
  {
    icon: "🤖",
    title: "Jogar Com Bots",
    desc: "Desafie um bot de Fácil até Mestre",
    route: "/play-computer",
    color: "text-blue-400",
  },
  {
    icon: "🧑‍🏫",
    title: "Jogar contra o Treinador",
    desc: "Aprenda enquanto joga com o Treinador",
    route: "/play/trainer",
    color: "text-green-400",
  },
  {
    icon: "🤝",
    title: "Jogar com um amigo",
    desc: "Convide um amigo para uma partida de xadrez",
    route: "/play-friend",
    color: "text-pink-400",
  },
  {
    icon: "🏆",
    title: "Torneios",
    desc: "Entre em uma Arena onde qualquer um pode vencer",
    route: "/tournaments",
    color: "text-gold",
  },
  {
    icon: "🎲",
    title: "Variantes de Xadrez",
    desc: "Encontre novas formas divertidas de jogar xadrez",
    route: "/variants",
    color: "text-purple-400",
  },
];

export default function PlaySidebarMenu() {
  const navigate = useNavigate();

  return (
    <Card
      variant="gradient"
      className="p-3 w-full lg:w-[300px] flex flex-col"
    >
      {/* Cabeçalho */}
      <div className="mb-3">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-xl">♟️</span>
          <span>Jogue Xadrez</span>
        </h2>
      </div>

      {/* Lista de modos */}
      <div className="flex-1 flex flex-col gap-1.5">
        {MENU_ITEMS.map((item, idx) => (
          <motion.button
            key={idx}
            type="button"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            onClick={() => navigate(item.route)}
            className="w-full text-left bg-surface-secondary/80 hover:bg-surface-tertiary border border-surface-tertiary hover:border-gold/40 rounded-xl px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-gold group"
          >
            <div className="flex items-center gap-2.5">
              <span className={`text-xl ${item.color} group-hover:scale-110 transition-transform`}>
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className={`font-semibold text-sm ${item.color} leading-tight`}>
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Rodapé */}
      <div className="mt-3 pt-3 border-t border-surface-tertiary flex justify-between text-xs text-muted-foreground">
        <button
          onClick={() => navigate("/game-history")}
          className="flex items-center gap-1 hover:text-gold transition-colors"
        >
          📜 Histórico de Partidas
        </button>
        <button
          onClick={() => navigate("/ranking")}
          className="flex items-center gap-1 hover:text-gold transition-colors"
        >
          📊 Classificação
        </button>
      </div>
    </Card>
  );
}

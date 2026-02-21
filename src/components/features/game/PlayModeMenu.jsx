import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui";

const DEFAULT_MENU_ITEMS = [
  { title: "Jogue online", desc: "Jogar contra uma pessoa com habilidades parecidas", icon: "⚡", route: "/play-online" },
  { title: "Jogar Com Bots", desc: "Desafie um bot de Fácil até Mestre", icon: "🤖", route: "/play-computer" },
  { title: "Jogar contra o Treinador", desc: "Aprenda enquanto joga com o Treinador", icon: "👨‍🏫", route: "/play-coach" },
  { title: "Jogar com um amigo", desc: "Convide um amigo para uma partida de xadrez", icon: "🤝", route: "/play-friend" },
  { title: "Torneios", desc: "Entre em uma Arena onde qualquer um pode vencer", icon: "🏅", route: "/tournaments" },
  { title: "Variantes de Xadrez", desc: "Encontre novas formas divertidas de jogar xadrez", icon: "🎲", route: "/variants" },
];

/**
 * PlayModeMenu - Menu de seleção de modos de jogo
 */
export default function PlayModeMenu({ menuItems = DEFAULT_MENU_ITEMS }) {
  const navigate = useNavigate();

  return (
    <div className="flex-shrink-0 flex flex-col h-full w-full max-w-[370px]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <Card variant="gradient" className="p-4 flex flex-col h-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2 text-gold-light drop-shadow">
            ♟️ Jogue Xadrez
          </h2>
          
          <div className="flex-1 flex flex-col gap-3 justify-center">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="bg-surface-primary p-4 rounded-xl hover:bg-surface-tertiary transition-all cursor-pointer border border-gold/20 shadow-lg flex flex-col justify-center focus:outline-none focus:ring-2 focus:ring-gold"
                onClick={() => navigate(item.route || "/")}
              >
                <h3 className="font-semibold flex items-center gap-2 text-lg text-gold">
                  <span>{item.icon}</span> {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 text-left w-full">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between text-sm text-muted-foreground">
            <span className="hover:text-gold cursor-pointer transition-colors">
              📜 Histórico de Partidas
            </span>
            <span className="hover:text-gold cursor-pointer transition-colors">
              📊 Tabela de classificação
            </span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

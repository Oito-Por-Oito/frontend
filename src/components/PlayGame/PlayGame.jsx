import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui";
import ChessBoardStatic from "./ChessBoardStatic";

const MENU_ITEMS = [
  { title: "Jogue online", desc: "Jogar contra uma pessoa com habilidades parecidas", icon: "⚡", route: "/play-online" },
  { title: "Jogar Com Bots", desc: "Desafie um bot de Fácil até Mestre", icon: "🤖", route: "/play-computer" },
  { title: "Jogar contra o Treinador", desc: "Aprenda enquanto joga com o Treinador", icon: "👨‍🏫", route: "/play-coach" },
  { title: "Jogar com um amigo", desc: "Convide um amigo para uma partida de xadrez", icon: "🤝", route: "/play-friend" },
  { title: "Torneios", desc: "Entre em uma Arena onde qualquer um pode vencer", icon: "🏅", route: "/tournaments" },
  { title: "Variantes de Xadrez", desc: "Encontre novas formas divertidas de jogar xadrez", icon: "🎲", route: "/variants" },
];

function PlayerRow({ name, rating, flag, isBot }) {
  return (
    <div className={`
      flex items-center justify-between w-full
      bg-surface-secondary/80 border rounded-xl px-4 py-2.5 shadow-md
      border-surface-tertiary
      ${isBot ? "mb-2" : "mt-2"}
    `}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-surface-tertiary flex items-center justify-center text-xl border border-gold/30">
          {isBot ? "🤖" : "👤"}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground truncate text-sm sm:text-base">{name}</span>
            {flag && (
              <img
                src={`https://flagcdn.com/w40/${flag}.png`}
                alt="flag"
                className="w-5 h-3 object-cover rounded-sm border border-surface-tertiary"
                draggable={false}
              />
            )}
            {isBot && (
              <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">Bot</span>
            )}
          </div>
          {rating > 0 && (
            <span className="text-gold font-bold text-xs sm:text-sm">{rating}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 text-muted-foreground text-sm">
        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 inline-block" />
      </div>
    </div>
  );
}

export default function PlayGame() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 p-4 lg:p-8">
      {/* Coluna do tabuleiro */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center w-full lg:w-auto"
      >
        <PlayerRow name="Gust" rating={2200} flag="us" isBot={true} />
        <div className="mt-2 mb-2">
          <ChessBoardStatic />
        </div>
        <PlayerRow name="Você" rating={0} flag={null} isBot={false} />
      </motion.div>

      {/* Sidebar de modos de jogo */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="w-full sm:max-w-[400px] lg:max-w-[380px]"
      >
        <Card variant="gradient" className="p-4 flex flex-col gap-3">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-gold-light drop-shadow">
            ♟️ Jogue Xadrez
          </h2>

          <div className="flex flex-col gap-2">
            {MENU_ITEMS.map((item, idx) => (
              <motion.button
                key={idx}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(item.route)}
                className="bg-surface-primary p-3 sm:p-4 rounded-xl hover:bg-surface-tertiary transition-all cursor-pointer border border-gold/20 shadow-md flex flex-col justify-center text-left focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <h3 className="font-semibold flex items-center gap-2 text-base text-gold">
                  <span>{item.icon}</span> {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{item.desc}</p>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground pt-1 border-t border-gold/10">
            <button
              onClick={() => navigate("/history")}
              className="hover:text-gold transition-colors"
            >
              📜 Histórico de Partidas
            </button>
            <button
              onClick={() => navigate("/ratings-players")}
              className="hover:text-gold transition-colors"
            >
              📊 Classificação
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

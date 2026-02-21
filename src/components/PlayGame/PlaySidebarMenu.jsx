import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function PlaySidebarMenu({ menuItems }) {
  const navigate = useNavigate();
  // Map menu item titles to routes
  const routeMap = {
    "Jogue online": "/play-online",
    "Jogar Com Bots": "/play-computer",
    "Jogar contra o Treinador": "/play-coach",
    "Jogar com um amigo": "/play-friend",
    "Torneios": "/tournaments",
    "Variantes de Xadrez": "/variants",
  };
  return (
    <div className="flex-shrink-0 flex flex-col h-full w-full max-w-[370px]">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] p-4 rounded-2xl shadow-xl border border-[#c29d5d]/30 flex flex-col h-full"
        style={{ flex: 1 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2 text-[#e7c27d] drop-shadow">
          ♟️ Jogue Xadrez
        </h2>
        <div className="flex-1 flex flex-col gap-3 justify-center">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="bg-[#1e1e1e] p-4 rounded-xl hover:bg-[#333] transition-all cursor-pointer border border-[#c29d5d]/20 shadow-lg flex flex-col justify-center focus:outline-none focus:ring-2 focus:ring-[#c29d5d]"
              style={{ minHeight: 70 }}
              onClick={() => navigate(routeMap[item.title] || "/")}
            >
              <h3 className="font-semibold flex items-center gap-2 text-lg text-[#c29d5d]">
                <span>{item.icon}</span> {item.title}
              </h3>
              <p className="text-sm text-gray-300 mt-1 text-left w-full">{item.desc}</p>
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-between text-sm text-gray-400">
          <span className="hover:text-[#c29d5d] cursor-pointer transition-colors">📜 Histórico de Partidas</span>
          <span className="hover:text-[#c29d5d] cursor-pointer transition-colors">📊 Tabela de classificação</span>
        </div>
      </motion.section>
    </div>
  );
}

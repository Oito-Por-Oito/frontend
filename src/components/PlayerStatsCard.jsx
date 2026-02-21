
import React from "react";
import { motion } from "framer-motion";

export default function PlayerStatsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-full bg-[#232526] text-white rounded-lg shadow-lg p-3 sm:p-4 space-y-3 sm:space-y-4 border border-[#444]"
    >
      {/* Imagem do jogador */}
      <div className="aspect-w-16 aspect-h-9 rounded overflow-hidden border border-[#444] bg-[#181818] flex items-center justify-center group relative">
        <img
          src="assets/img/YouTudeVideo.png"
          alt="Foto do jogador"
          className="object-cover w-full h-full"
        />
        {/* Botão de play */}
        <button
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          tabIndex={0}
          aria-label="Play video"
          onClick={() => window.open('https://www.youtube.com/watch?v=emZGqqemsq8', '_blank')}
        >
          <span
            className="bg-black bg-opacity-60 rounded-full p-4 flex items-center justify-center"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#d4af37" fillOpacity="0.85"/>
              <polygon points="20,16 34,24 20,32" fill="white" />
            </svg>
          </span>
        </button>
      </div>

      {/* Nome do jogador */}
      <div className="text-lg font-bold text-[#d4af37] flex items-center gap-2">
        <span className="bg-[#444] px-2 py-1 rounded-full text-xs border border-[#d4af37]">Top 1</span>
        ghostyphas
      </div>

      {/* Estatísticas */}
      <div>
        <h2 className="text-md font-bold mb-2 text-[#d4af37]">Estatísticas</h2>
        <div className="space-y-1">
          <StatItem label="Partidas" value={6} icon="♟️" />
          <StatItem label="Problemas" value={79} icon="❓" />
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-2">
        <RatingItem label="Diário" value={586} icon="🌞" />
        <RatingItem label="Problemas" value={751} icon="🧩" />
        <RatingItem label="Rápida" value={1036} icon="⚡" />
        <RatingItem label="Blitz" value={809} icon="💥" />
        <RatingItem label="Ideias Críticas" value={"-"} icon="💡" />
      </div>
    </motion.div>
  );
}


function StatItem({ label, value, icon }) {
  return (
    <div className="flex justify-between items-center border-b border-[#444] py-1">
      <span className="flex items-center gap-1 text-[#d4af37]">{icon} <span className="text-white">{label}</span></span>
      <span className="font-bold text-[#d4af37]">{value}</span>
    </div>
  );
}


function RatingItem({ label, value, icon }) {
  return (
    <div className="flex justify-between items-center px-2 py-1 bg-[#2c2c2c] rounded-md border border-[#444]">
      <div className="flex items-center gap-2">
        <span className="text-[#d4af37]">{icon}</span>
        <span className="text-white font-semibold">{label}</span>
      </div>
      <span className="font-bold text-[#d4af37]">{value}</span>
    </div>
  );
}

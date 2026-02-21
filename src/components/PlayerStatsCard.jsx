import React from "react";
import { motion } from "framer-motion";
import { Card, Badge, OptimizedImage } from '@/components/ui';

export default function PlayerStatsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Card variant="bordered" className="max-w-sm w-full p-4 space-y-4">
        {/* Player Image */}
        <div className="aspect-w-16 aspect-h-9 rounded overflow-hidden border border-surface-tertiary bg-surface-card flex items-center justify-center group relative">
          <OptimizedImage
            src="assets/img/YouTudeVideo.png"
            alt="Foto do jogador"
            className="object-cover w-full h-full"
          />
          {/* Play Button */}
          <button
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            tabIndex={0}
            aria-label="Play video"
            onClick={() => window.open('https://www.youtube.com/watch?v=emZGqqemsq8', '_blank')}
          >
            <span className="bg-black bg-opacity-60 rounded-full p-4 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" className="fill-gold" fillOpacity="0.85"/>
                <polygon points="20,16 34,24 20,32" fill="white" />
              </svg>
            </span>
          </button>
        </div>

        {/* Player Name */}
        <div className="text-lg font-bold text-gold flex items-center gap-2">
          <Badge variant="default" className="text-xs">Top 1</Badge>
          ghostyphas
        </div>

        {/* Stats */}
        <div>
          <h2 className="text-md font-bold mb-2 text-gold">Estatísticas</h2>
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
      </Card>
    </motion.div>
  );
}

function StatItem({ label, value, icon }) {
  return (
    <div className="flex justify-between items-center border-b border-surface-tertiary py-1">
      <span className="flex items-center gap-1 text-gold">
        {icon} <span className="text-white">{label}</span>
      </span>
      <span className="font-bold text-gold">{value}</span>
    </div>
  );
}

function RatingItem({ label, value, icon }) {
  return (
    <div className="flex justify-between items-center px-2 py-1 bg-surface-tertiary rounded-md border border-surface-tertiary">
      <div className="flex items-center gap-2">
        <span className="text-gold">{icon}</span>
        <span className="text-white font-semibold">{label}</span>
      </div>
      <span className="font-bold text-gold">{value}</span>
    </div>
  );
}

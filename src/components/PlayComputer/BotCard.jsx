import React from "react";

export default function BotCard({ name }) {
  return (
    <div
      className="w-10 h-10 rounded-xl bg-gradient-to-br from-surface-secondary via-surface-tertiary to-surface-secondary border-2 border-gold/60 flex items-center justify-center text-white text-lg font-bold shadow-md hover:scale-105 hover:border-gold-light transition-all duration-200 cursor-pointer select-none"
      title={name}
    >
      {name.charAt(0)}
    </div>
  );
}

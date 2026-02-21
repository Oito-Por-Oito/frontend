
import React from "react";

export default function SocialCardsGrid({ cards }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-surface-secondary via-surface-card to-surface-secondary rounded-2xl shadow-xl border border-gold/20 flex flex-col overflow-hidden"
        >
          <div className={`h-28 flex justify-center items-center ${card.color} border-b border-gold/20`}> 
            <span className="text-3xl md:text-4xl">{card.icon}</span>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <h3 className="font-bold text-lg text-gold-light drop-shadow">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

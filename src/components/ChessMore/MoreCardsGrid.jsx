
import React from "react";

export default function SocialCardsGrid({ cards }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] rounded-2xl shadow-xl border border-[#c29d5d]/20 flex flex-col overflow-hidden"
        >
          <div className={`h-28 flex justify-center items-center ${card.color} border-b border-[#c29d5d]/20`}> 
            <span className="text-3xl md:text-4xl">{card.icon}</span>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <h3 className="font-bold text-lg text-[#e7c27d] drop-shadow">{card.title}</h3>
            <p className="text-sm text-gray-300">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

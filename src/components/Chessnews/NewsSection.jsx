import React from 'react';

export default function NewsSection() {
  const headlines = [
    "Giri, Aronian, Nihal, Sindarov Grab Final Spots In Esports World Cup",
    "Gurel Scores 6/8 Against Naroditsky, Blazes To 4th Bullet Brawl Title",
    "Humpy Survives Vs. Divya, Lei Accepts Draw In Better Position",
  ];

  return (
    <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 md:p-6 shadow border border-[#c29d5d]/10 w-full">
      <h3 className="text-2xl font-bold mb-4 text-[#c29d5d]">Notícias</h3>

      {/* Destaque principal */}
      <div className="flex gap-4 mb-4">
        <img
          src="assets/img/NewsSection.png"
          alt="Tan Zhonyi"
          className="w-56 h-40 md:w-80 md:h-56 object-cover rounded-2xl border-2 border-[#c29d5d]/30 shadow-2xl"
        />
        <div className="flex-1">
          <h4 className="font-bold text-lg md:text-xl text-[#e7c27d] mb-1">Tan Finishes 3rd With Black Win</h4>
          <p className="text-sm text-[#e7c27d]/70 mb-1">Há 8 horas</p>
          <p className="text-base text-white/80 leading-snug line-clamp-2">
            GM Tan Zhongyi won with the black pieces against GM Lei Tingjie to finish in third place at the 2025 FIDE Women's World Cup. She qualifies for the 2026 FIDE...
          </p>
        </div>
      </div>

      {/* Outras manchetes */}
      <div className="divide-y divide-[#c29d5d]/10 mt-2">
        {headlines.map((title, index) => (
          <div
            key={index}
            className="py-3 text-base md:text-lg font-semibold cursor-pointer text-white/90 hover:underline"
          >
            {title}
          </div>
        ))}
      </div>
    </section>
  );
}

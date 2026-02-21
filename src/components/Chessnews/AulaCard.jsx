import React from "react";

export default function AulaCard() {
  return (
    <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 md:p-6 shadow border border-[#c29d5d]/10 w-full">
      <h3 className="text-2xl font-bold mb-4 text-[#c29d5d]">Aulas</h3>

      <div className="flex gap-4">
        {/* Imagem */}
        <img
          src="assets/img/AulaNews.png"
          alt="Tabuleiro"
          className="w-56 h-40 md:w-80 md:h-56 object-cover rounded-2xl border-2 border-[#c29d5d]/30 shadow-2xl"
        />

        {/* Conteúdo textual */}
        <div className="flex-1">
          {/* Título */}
          <h4 className="font-bold text-lg md:text-xl text-[#e7c27d] mb-1">
            Jogue Como Anatoly Karpov
          </h4>

          {/* Autor + Título */}
          <div className="flex items-center text-sm mb-1">
            <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded uppercase mr-2">
              NM
            </span>
            <span className="font-semibold">Jeremy Kane</span>
          </div>

          {/* Descrição */}
          <p className="text-base text-white/80 leading-snug line-clamp-2">
            Anatoly Karpov foi campeão mundial da FIDE de 1975 a 1985. Mesmo depois de perder o título, ele foi o principal rival do campeão mundial, Garry Kasparov, po...
          </p>
        </div>
      </div>
    </section>
  );
}

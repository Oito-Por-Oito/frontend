
import React from "react";

const eventos = [
  {
    nome: "Esports World Cup 2025",
    imagem: "assets/img/EWC.png",
    inicio: "24 de jul. de 2025",
    fim: "1 de ago. de 2025",
  },
  {
    nome: "Freestyle Friday 2025",
    imagem: "assets/img/FreeStyle.png",
    inicio: "24 de jan. de 2025",
    fim: "26 de dez. de 2025",
  },
  {
    nome: "Titled Tuesday 2025",
    imagem: "assets/img/Titled.png",
    inicio: "2 de jun. de 2025",
    fim: "30 de dez. de 2025",
  },
  {
    nome: "FIDE Women’s World Cup 2025",
    imagem: "assets/img/FideWomens.png",
    inicio: "4 de jul. de 2025",
    fim: "29 de jul. de 2025",
  },
];

export default function EventsSection() {
  return (
    <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 md:p-6 shadow border border-[#c29d5d]/10 w-full">
      <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 text-[#c29d5d]">Eventos</h3>

      <div className="flex flex-col gap-3">
        {eventos.map((evento, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-[#232526]/70 border border-[#c29d5d]/20 rounded-2xl px-4 py-3 shadow hover:bg-[#333] transition-all"
          >
            <img
              src={evento.imagem}
              alt={evento.nome}
              className="w-14 h-12 sm:w-20 sm:h-16 md:w-28 md:h-20 object-cover rounded-2xl border-2 border-[#c29d5d]/30 shadow flex-shrink-0"
            />
            <div className="flex-1">
              <h4 className="font-bold text-sm sm:text-lg md:text-xl text-[#e7c27d] mb-1 leading-snug">{evento.nome}</h4>
              <p className="text-sm text-gray-400">
                {evento.inicio} - {evento.fim}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

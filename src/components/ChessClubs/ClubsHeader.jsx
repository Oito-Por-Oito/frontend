import React from "react";

export default function ClubsHeader() {
  return (
    <div className="border-b border-[#c29d5d]/30 bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526]">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold text-[#e7c27d] drop-shadow">Encontre um Clube de Xadrez</h1>
        <div className="mt-3 relative">
          <input
            className="w-full rounded-xl bg-[#181818] border border-[#c29d5d]/20 pl-10 pr-3 py-3 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]/40 text-white shadow"
            placeholder="Encontre um clube relacionado ao seu país ou interesse..."
            aria-label="Buscar clubes"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-[#c29d5d]" viewBox="0 0 24 24" fill="none" aria-label="Ícone de busca">
            <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

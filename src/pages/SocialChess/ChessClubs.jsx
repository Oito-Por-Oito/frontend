
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ClubsHeader from "../../components/ChessClubs/ClubsHeader";
import ClubsSidebarLinks from "../../components/ChessClubs/ClubsSidebarLinks";
import ClubsSidebarRanking from "../../components/ChessClubs/ClubsSidebarRanking";
import ClubsList from "../../components/ChessClubs/ClubsList";


export default function ChessClubs() {
  // Para dados reais, troque ClubsList por um fetch e passe os dados como prop
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#181818] to-[#232526] text-white overflow-x-hidden">
      <Navbar />
      <ClubsHeader />
      <main className="flex-1 mx-auto max-w-6xl px-2 sm:px-4 md:px-8 lg:px-16 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 w-full">
        <section className="space-y-6">
          <div className="bg-[#181818]/90 border border-[#c29d5d]/20 shadow-lg p-6 rounded-2xl">
            <Toolbar />
            <ClubsList />
          </div>
        </section>
        <aside className="space-y-6 w-full lg:w-80">
          <div className="bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] rounded-2xl shadow-xl border-t-2 border-b-2 border-[#c29d5d]/30 p-5">
            <ClubsSidebarLinks />
          </div>
          <div className="bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] rounded-2xl shadow-xl border-t-2 border-b-2 border-[#c29d5d]/30 p-5">
            <ClubsSidebarRanking />
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
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

function Toolbar() {
  return (
    <div className="rounded-md bg-[#2a2b29] border border-white/10 p-3 flex flex-wrap gap-3 items-center">
      <span className="text-sm text-gray-300">Ordenar:</span>
      <select className="bg-[#1f201e] border border-white/10 rounded px-2 py-1 text-sm">
        <option>Recomendadas</option>
        <option>Mais membros</option>
        <option>Mais ativas</option>
      </select>

      <span className="ml-4 text-sm text-gray-300">País:</span>
      <select className="bg-[#1f201e] border border-white/10 rounded px-2 py-1 text-sm">
        <option>Todos os países</option>
        <option>Brasil</option>
        <option>Portugal</option>
        <option>México</option>
      </select>
    </div>
  );
}





import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


import DailyPuzzleBoard from "../components/Chessnews/DailyPuzzleBoard";
import RecentNews from "../components/Chessnews/RecentNews";
import MainHighlight from "../components/Chessnews/MainHighlight";
import NewsSection from "../components/Chessnews/NewsSection";
import AulaCard from "../components/Chessnews/AulaCard";
import ArticlesSection from "../components/Chessnews/ArticlesSection";
import BlogsSection from "../components/Chessnews/BlogsSection";
import EventsSection from "../components/Chessnews/EventsSection";
import PollSection from "../components/Chessnews/PollSection";
import TopPlayersSection from "../components/Chessnews/TopPlayersSection";


export default function Chessnews() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#181818] to-[#232526] text-white overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-2 mb-8">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Logo" className="h-10 w-10 object-contain drop-shadow-lg rounded-full border border-[#c29d5d] bg-[#232526] p-1" />
            <h1 className="text-3xl font-bold text-[#e7c27d] drop-shadow">Chess Today</h1>
          </div>
          <div className="text-sm text-[#c29d5d] bg-[#232526] px-3 py-1 rounded shadow border border-[#c29d5d]/30">Ao Vivo na ChessTV</div>
        </header>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Coluna 1: Principal + Notícias + Artigos + Vídeos + Blog + Eventos */}
          <div className="lg:col-span-3 space-y-7">
            {/* Destaque Principal */}
            <MainHighlight />
            {/* Notícias */}
            <NewsSection />
            {/* Aulas */}
            <AulaCard />
            {/* Artigos */}
            <ArticlesSection />
            {/* Vídeos */}
            {/* (Opcional: criar componente VideosSection futuramente) */}
            <BlogsSection />
            <EventsSection />
          </div>

          {/* Sidebar direita */}
          <div className="space-y-7">
            {/* Stream */}
            <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
              <h4 className="text-sm font-semibold mb-2 text-[#c29d5d]">Chessbrah is streaming</h4>
              <div className="bg-black text-center py-6 text-[#e7c27d] rounded-lg">Twitch Player</div>
            </div>

            {/* Problema Diário */}
            <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow border border-[#c29d5d]/10">
              <h4 className="text-sm font-semibold mb-2 text-[#c29d5d]">Problema Diário</h4>
              <div className="mb-2 rounded-lg">
                <DailyPuzzleBoard fen="r1bqkb1r/ppp2ppp/2n2n2/3pp3/2PP4/2N2NP1/PP2PP1P/R1BQKB1R b KQkq - 0 5" />
              </div>
              <p className="text-xs text-[#e7c27d] mb-2 text-center">Brancas jogam e vencem em 3 lances</p>
              <button className="bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] hover:from-[#ffe7b3] hover:to-[#e7c27d] text-sm px-4 py-2 rounded-xl text-black font-bold w-full shadow-lg transition-all duration-200">Resolver</button>
            </div>

            {/* Recent News */}
            <RecentNews />

            {/* Enquete */}
            <PollSection />
            {/* Top Players */}
            <TopPlayersSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

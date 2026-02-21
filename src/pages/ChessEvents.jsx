

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StreamersList from "../components/ChessEvents/StreamersList";
import RankingList from "../components/ChessEvents/RankingList";
import SocialLinks from "../components/ChessEvents/SocialLinks";
import ChessTVSchedule from "../components/ChessEvents/ChessTVSchedule";
import chessData from "../data/chessData";
import EventoCard from "../components/ChessEvents/EventoCard";



export default function ChessEvents() {
  const rankings = chessData.rankings;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#181818] via-[#232526] to-[#181818] text-white overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col lg:flex-row gap-8 px-2 sm:px-4 md:px-8 lg:px-16 py-8 text-white max-w-7xl w-full mx-auto">
        {/* Esquerda */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="bg-[#181818]/90 border border-[#c29d5d]/20 shadow-lg p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-[#c29d5d]">Eventos</h2>
            <div className="flex flex-col gap-4">
              <EventoCard
                img="/assets/img/speedchess.png"
                titulo="Women's Speed Chess Championship 2025"
                data="3 de ago. - 29 de set. 2025"
              />
              <EventoCard
                img="/assets/img/titledTuesday.png"
                titulo="Titled Tuesday 2025"
                data="2 de jun. - 30 de dez. 2025"
              />
              <EventoCard
                img="/assets/img/kaggle.png"
                titulo="Kaggle Game Arena Chess Exhibition Tournament 2025"
                data="4 de ago. de 2025 - 7 de ago. de 2025"
              />
              <EventoCard
                img="/assets/img/FreeStyleChess.png"
                titulo="Freestyle Friday 2025"
                data="24 de jan. de 2025 - 26 de dez. de 2025"
              />
            </div>
          </div>
          <ChessTVSchedule />
        </div>

        {/* Direita (Sidebar) */}
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-8">
          <SocialLinks />
          <StreamersList />
          <RankingList rankings={rankings} />
        </aside>
      </main>
      <Footer />
    </div>
  );
}
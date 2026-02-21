import React from "react";
import { PageLayout } from "@/components/layout";
import { Card, Container, Button } from "@/components/ui";

import DailyPuzzleBoard from "@/components/Chessnews/DailyPuzzleBoard";
import RecentNews from "@/components/Chessnews/RecentNews";
import MainHighlight from "@/components/Chessnews/MainHighlight";
import NewsSection from "@/components/Chessnews/NewsSection";
import AulaCard from "@/components/Chessnews/AulaCard";
import ArticlesSection from "@/components/Chessnews/ArticlesSection";
import BlogsSection from "@/components/Chessnews/BlogsSection";
import EventsSection from "@/components/Chessnews/EventsSection";
import PollSection from "@/components/Chessnews/PollSection";
import TopPlayersSection from "@/components/Chessnews/TopPlayersSection";

function ChessnewsHeader() {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <img 
          src="/assets/logo.png" 
          alt="Logo" 
          className="h-10 w-10 object-contain drop-shadow-lg rounded-full border border-gold bg-surface-secondary p-1" 
        />
        <h1 className="text-3xl font-bold text-gold-light drop-shadow">Chess Today</h1>
      </div>
      <div className="text-sm text-gold bg-surface-secondary px-3 py-1 rounded shadow border border-gold/30">
        Ao Vivo na ChessTV
      </div>
    </header>
  );
}

function ChessnewsSidebar() {
  return (
    <div className="space-y-7">
      {/* Stream */}
      <Card variant="gradient">
        <h4 className="text-sm font-semibold mb-2 text-gold">Chessbrah is streaming</h4>
        <div className="bg-black text-center py-6 text-gold-light rounded-lg">Twitch Player</div>
      </Card>

      {/* Problema Diário */}
      <Card variant="gradient">
        <h4 className="text-sm font-semibold mb-2 text-gold">Problema Diário</h4>
        <div className="mb-2 rounded-lg">
          <DailyPuzzleBoard fen="r1bqkb1r/ppp2ppp/2n2n2/3pp3/2PP4/2N2NP1/PP2PP1P/R1BQKB1R b KQkq - 0 5" />
        </div>
        <p className="text-xs text-gold-light mb-2 text-center">Brancas jogam e vencem em 3 lances</p>
        <Button variant="primary" className="w-full">Resolver</Button>
      </Card>

      {/* Recent News */}
      <RecentNews />

      {/* Enquete */}
      <PollSection />
      
      {/* Top Players */}
      <TopPlayersSection />
    </div>
  );
}

function ChessnewsMainContent() {
  return (
    <div className="space-y-7">
      <MainHighlight />
      <NewsSection />
      <AulaCard />
      <ArticlesSection />
      <BlogsSection />
      <EventsSection />
    </div>
  );
}

export default function Chessnews() {
  return (
    <PageLayout>
      <Container size="wide" className="py-8">
        <ChessnewsHeader />
        
        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-3">
            <ChessnewsMainContent />
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <ChessnewsSidebar />
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}

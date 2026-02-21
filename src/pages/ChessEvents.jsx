import React from "react";
import { PageLayout, MainLayout } from "@/components/layout";
import { Card } from "@/components/ui";
import StreamersList from "@/components/ChessEvents/StreamersList";
import RankingList from "@/components/ChessEvents/RankingList";
import SocialLinks from "@/components/ChessEvents/SocialLinks";
import ChessTVSchedule from "@/components/ChessEvents/ChessTVSchedule";
import chessData from "@/data/chessData";
import EventoCard from "@/components/ChessEvents/EventoCard";

function EventsSidebar({ rankings }) {
  return (
    <>
      <SocialLinks />
      <StreamersList />
      <RankingList rankings={rankings} />
    </>
  );
}

function EventsContent() {
  return (
    <>
      <Card variant="elevated">
        <Card.Title>Eventos</Card.Title>
        <div className="flex flex-col gap-4 mt-4">
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
      </Card>
      <ChessTVSchedule />
    </>
  );
}

export default function ChessEvents() {
  const rankings = chessData.rankings;

  return (
    <PageLayout>
      <MainLayout sidebar={<EventsSidebar rankings={rankings} />}>
        <EventsContent />
      </MainLayout>
    </PageLayout>
  );
}

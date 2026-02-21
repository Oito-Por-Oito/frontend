import React from "react";
import { PageLayout, MainLayout } from "@/components/layout";
import { Card } from "@/components/ui";
import ClubsHeader from "@/components/ChessClubs/ClubsHeader";
import ClubsSidebarLinks from "@/components/ChessClubs/ClubsSidebarLinks";
import ClubsSidebarRanking from "@/components/ChessClubs/ClubsSidebarRanking";
import ClubsList from "@/components/ChessClubs/ClubsList";

function Toolbar() {
  return (
    <div className="rounded-md bg-surface-tertiary border border-white/10 p-3 flex flex-wrap gap-3 items-center mb-4">
      <span className="text-sm text-muted-foreground">Ordenar:</span>
      <select className="bg-surface-primary border border-white/10 rounded px-2 py-1 text-sm">
        <option>Recomendadas</option>
        <option>Mais membros</option>
        <option>Mais ativas</option>
      </select>

      <span className="ml-4 text-sm text-muted-foreground">País:</span>
      <select className="bg-surface-primary border border-white/10 rounded px-2 py-1 text-sm">
        <option>Todos os países</option>
        <option>Brasil</option>
        <option>Portugal</option>
        <option>México</option>
      </select>
    </div>
  );
}

function ClubsSidebar() {
  return (
    <>
      <Card variant="gradient">
        <ClubsSidebarLinks />
      </Card>
      <Card variant="gradient">
        <ClubsSidebarRanking />
      </Card>
    </>
  );
}

export default function ChessClubs() {
  return (
    <PageLayout>
      <ClubsHeader />
      <MainLayout 
        sidebar={<ClubsSidebar />}
        containerSize="default"
      >
        <Card variant="elevated">
          <Toolbar />
          <ClubsList />
        </Card>
      </MainLayout>
    </PageLayout>
  );
}

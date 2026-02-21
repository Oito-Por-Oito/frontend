import React from "react";
import { PageLayout } from "@/components/layout";
import PlayGame from "@/components/PlayGame/PlayGame";

export default function Play() {
  return (
    <PageLayout showFooter={false}>
      <div className="flex-1 lg:h-[calc(100vh-64px)] lg:overflow-hidden overflow-x-hidden">
        <PlayGame />
      </div>
    </PageLayout>
  );
}

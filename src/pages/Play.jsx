import React from "react";
import { PageLayout } from "@/components/layout";
import PlayGame from "@/components/PlayGame/PlayGame";

export default function Play() {
  return (
    <PageLayout showFooter={false} className="flex items-center justify-center">
      <PlayGame />
    </PageLayout>
  );
}

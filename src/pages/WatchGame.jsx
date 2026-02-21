import React from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout';
import SpectatorRoom from '@/components/PlayOnline/SpectatorRoom';

export default function WatchGame() {
  const { gameId } = useParams();

  return (
    <PageLayout showFooter={false}>
      <div className="flex-1 overflow-x-hidden">
        <div className="py-4 sm:py-6 px-4">
          <SpectatorRoom gameId={gameId} />
        </div>
      </div>
    </PageLayout>
  );
}

import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpectatorRoom from '@/components/PlayOnline/SpectatorRoom';

export default function WatchGame() {
  const { gameId } = useParams();

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <SpectatorRoom gameId={gameId} />
      </main>

      <Footer />
    </div>
  );
}

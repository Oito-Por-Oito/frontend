import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MatchmakingLobby from '@/components/PlayOnline/MatchmakingLobby';
import GameRoom from '@/components/PlayOnline/GameRoom';
import { useAuth } from '@/hooks/useAuth';
import { useMatchmaking } from '@/hooks/useMatchmaking';

export default function PlayOnline() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { 
    isSearching, 
    error, 
    matchedGame, 
    joinQueue, 
    leaveQueue,
    clearMatchedGame,
    setMatchedGame 
  } = useMatchmaking();

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/play-online' } });
    }
  }, [user, authLoading, navigate]);

  const handleLeaveGame = () => {
    clearMatchedGame();
  };

  // Handler para navegar para partida de rematch
  const handleRematchAccepted = useCallback((newGameId) => {
    setMatchedGame({ id: newGameId });
  }, [setMatchedGame]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#181818] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#c29d5d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {matchedGame ? (
            <GameRoom 
              gameId={matchedGame.id} 
              onLeaveGame={handleLeaveGame}
              onRematchAccepted={handleRematchAccepted}
            />
          ) : (
            <div className="max-w-2xl mx-auto">
              <MatchmakingLobby
                onJoinQueue={joinQueue}
                onLeaveQueue={leaveQueue}
                isSearching={isSearching}
                error={error}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

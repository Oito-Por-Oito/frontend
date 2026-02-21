import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Chess } from 'chess.js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { playMoveSound, playCaptureSound, playCheckSound, playGameEndSound } from '@/hooks/useSound';

export function useSpectator(gameId) {
  const { user, profile } = useAuth();
  const [game, setGame] = useState(null);
  const [chess] = useState(() => new Chess());
  const [moves, setMoves] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ white: 0, black: 0 });
  const [spectatorCount, setSpectatorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const lastMoveTimeRef = useRef(null);

  // Carregar partida inicial
  useEffect(() => {
    if (!gameId) return;

    const loadGame = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('games')
          .select(`
            *,
            white_player:white_player_id(id, user_id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical),
            black_player:black_player_id(id, user_id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical)
          `)
          .eq('id', gameId)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Partida não encontrada');

        setGame(data);
        chess.load(data.fen);
        setTimeLeft({
          white: data.white_time_left,
          black: data.black_time_left,
        });
        lastMoveTimeRef.current = data.last_move_at ? new Date(data.last_move_at).getTime() : Date.now();

        // Carregar lances
        const { data: movesData } = await supabase
          .from('game_moves')
          .select('*')
          .eq('game_id', gameId)
          .order('move_number', { ascending: true });

        if (movesData) setMoves(movesData);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar partida:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId, chess]);

  // Subscription Realtime para atualizações do jogo
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase.channel(`spectator-game:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          const updatedGame = payload.new;
          
          setGame(prev => {
            // Detectar fim de jogo para tocar som
            if (updatedGame.status === 'completed' && prev?.status !== 'completed') {
              playGameEndSound(false); // Som neutro para espectador
            }
            return { ...prev, ...updatedGame };
          });

          // Atualizar tabuleiro se FEN mudou
          if (updatedGame.fen && updatedGame.fen !== chess.fen()) {
            chess.load(updatedGame.fen);
          }

          // Atualizar tempos
          setTimeLeft({
            white: updatedGame.white_time_left,
            black: updatedGame.black_time_left,
          });

          lastMoveTimeRef.current = updatedGame.last_move_at 
            ? new Date(updatedGame.last_move_at).getTime() 
            : Date.now();
        }
      )
      .subscribe();

    // Subscription para novos lances
    const movesChannel = supabase.channel(`spectator-moves:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_moves',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const newMove = payload.new;

          // Tocar som do lance
          const isCapture = newMove.san.includes('x');
          const isCheck = newMove.san.includes('+') || newMove.san.includes('#');

          if (isCheck) {
            playCheckSound();
          } else if (isCapture) {
            playCaptureSound();
          } else {
            playMoveSound();
          }

          setMoves(prev => [...prev, newMove]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(movesChannel);
    };
  }, [gameId, chess]);

  // Presence para contar espectadores
  useEffect(() => {
    if (!gameId) return;

    const uniqueKey = user?.id || `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const presenceChannel = supabase.channel(`spectators:${gameId}`, {
      config: { presence: { key: uniqueKey } }
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        setSpectatorCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user?.id || 'anonymous',
            username: profile?.display_name || profile?.username || 'Anônimo',
            joined_at: new Date().toISOString()
          });
        }
      });

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [gameId, user, profile]);

  // Timer local para espectador
  useEffect(() => {
    if (!game || game.status !== 'active') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const currentTurn = game.current_turn;
        const elapsed = Date.now() - (lastMoveTimeRef.current || Date.now());

        if (currentTurn === 'white') {
          return { ...prev, white: Math.max(0, game.white_time_left - elapsed) };
        } else {
          return { ...prev, black: Math.max(0, game.black_time_left - elapsed) };
        }
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [game]);

  // Último lance para highlight
  const lastMove = useMemo(() => {
    if (moves.length === 0) return null;
    const last = moves[moves.length - 1];
    return { from: last.from_square, to: last.to_square };
  }, [moves]);

  return {
    game,
    chess,
    moves,
    timeLeft,
    spectatorCount,
    loading,
    error,
    lastMove,
    isGameOver: game?.status === 'completed',
  };
}

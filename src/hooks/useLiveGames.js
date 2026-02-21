import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useLiveGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGames = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('games')
        .select(`
          id, 
          time_control, 
          started_at, 
          fen, 
          current_turn,
          white_time_left,
          black_time_left,
          white_player:white_player_id(id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical),
          black_player:black_player_id(id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical)
        `)
        .eq('status', 'active')
        .order('started_at', { ascending: false });

      if (fetchError) throw fetchError;
      setGames(data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar partidas ao vivo:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGames();

    // Subscription para novas partidas e atualizações
    const channel = supabase.channel('live-games-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
        },
        (payload) => {
          // Recarregar lista quando houver mudanças
          if (payload.new?.status === 'active' || payload.old?.status === 'active') {
            loadGames();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadGames]);

  return { games, loading, error, refresh: loadGames };
}

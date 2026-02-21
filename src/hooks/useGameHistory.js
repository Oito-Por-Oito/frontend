import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useGameHistory(initialLimit = 20) {
  const { profile } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    result: 'all', // 'all' | 'wins' | 'losses' | 'draws'
    timeControl: 'all', // 'all' | 'bullet' | 'blitz' | 'rapid' | 'classical'
  });
  const [page, setPage] = useState(0);

  const loadGames = useCallback(async (reset = false) => {
    if (!profile?.id) return;

    try {
      setLoading(true);
      const currentPage = reset ? 0 : page;
      const offset = currentPage * initialLimit;

      let query = supabase
        .from('games')
        .select(`
          id,
          time_control,
          result,
          result_reason,
          started_at,
          ended_at,
          fen,
          pgn,
          white_player_id,
          black_player_id,
          winner_id,
          white_player:white_player_id(id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical),
          black_player:black_player_id(id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical)
        `)
        .eq('status', 'completed')
        .or(`white_player_id.eq.${profile.id},black_player_id.eq.${profile.id}`)
        .order('ended_at', { ascending: false })
        .range(offset, offset + initialLimit - 1);

      // Apply result filter
      if (filters.result === 'wins') {
        query = query.eq('winner_id', profile.id);
      } else if (filters.result === 'losses') {
        query = query.neq('winner_id', profile.id).not('result', 'eq', '1/2-1/2');
      } else if (filters.result === 'draws') {
        query = query.eq('result', '1/2-1/2');
      }

      // Apply time control filter
      if (filters.timeControl !== 'all') {
        const timeControlMap = {
          bullet: ['Bullet 1+0', 'Bullet 2+1'],
          blitz: ['Blitz 3+0', 'Blitz 3+2', 'Blitz 5+0', 'Blitz 5+3'],
          rapid: ['Rapid 10+0', 'Rapid 15+10'],
          classical: ['Classical 30+0'],
        };
        const controls = timeControlMap[filters.timeControl] || [];
        if (controls.length > 0) {
          query = query.in('time_control', controls);
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (reset) {
        setGames(data || []);
        setPage(0);
      } else {
        setGames(prev => [...prev, ...(data || [])]);
      }
      
      setHasMore((data?.length || 0) === initialLimit);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [profile?.id, page, filters, initialLimit]);

  // Load on mount and when filters change
  useEffect(() => {
    loadGames(true);
  }, [profile?.id, filters]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Load more when page changes
  useEffect(() => {
    if (page > 0) {
      loadGames(false);
    }
  }, [page]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(0);
  }, []);

  return {
    games,
    loading,
    error,
    hasMore,
    filters,
    updateFilters,
    loadMore,
    refresh: () => loadGames(true),
    profileId: profile?.id,
  };
}

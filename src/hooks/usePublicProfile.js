import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

const PAGE_SIZE = 15;

function parseGameResult(game, profileId) {
  const isWhite = game.white_player_id === profileId;
  const playerColor = isWhite ? 'white' : 'black';
  let playerResult;
  if (game.result === '1/2-1/2') {
    playerResult = 'draw';
  } else if ((game.result === '1-0' && isWhite) || (game.result === '0-1' && !isWhite)) {
    playerResult = 'win';
  } else {
    playerResult = 'loss';
  }
  return { playerColor, playerResult };
}

function calcDuration(started, ended) {
  if (!ended) return 0;
  return Math.round((new Date(ended).getTime() - new Date(started).getTime()) / 1000);
}

export function usePublicProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    const fetch = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        if (fetchError) throw fetchError;
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userId]);

  return { profile, loading, error };
}

export function usePlayerGames(profileId) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const pageRef = useRef(0);

  const fetchGames = useCallback(async (page = 0, replace = false) => {
    if (!profileId) return;
    try {
      const { data, error: fetchError } = await supabase
        .from('games')
        .select(`
          id, time_control, result, result_reason, started_at, ended_at,
          white_player_id, black_player_id,
          white_player:white_player_id(id, user_id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical),
          black_player:black_player_id(id, user_id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical)
        `)
        .or(`white_player_id.eq.${profileId},black_player_id.eq.${profileId}`)
        .eq('status', 'completed')
        .not('result', 'is', null)
        .order('ended_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (fetchError) throw fetchError;

      const parsed = (data || []).map(game => {
        const { playerColor, playerResult } = parseGameResult(game, profileId);
        const isWhite = playerColor === 'white';
        const opponent = isWhite ? game.black_player : game.white_player;
        const tcField = game.time_control === 'blitz' ? 'rating_blitz' : game.time_control === 'classical' ? 'rating_classical' : 'rating_rapid';
        return {
          id: game.id,
          time_control: game.time_control,
          result: game.result,
          result_reason: game.result_reason,
          started_at: game.started_at,
          ended_at: game.ended_at,
          playerColor,
          playerResult,
          opponent,
          opponentRating: opponent?.[tcField] || 800,
          durationSeconds: calcDuration(game.started_at, game.ended_at),
        };
      });

      if (replace) {
        setGames(parsed);
      } else {
        setGames(prev => [...prev, ...parsed]);
      }
      setHasMore((data || []).length === PAGE_SIZE);
    } catch (err) {
      setError(err.message);
    }
  }, [profileId]);

  useEffect(() => {
    if (!profileId) return;
    pageRef.current = 0;
    setLoading(true);
    fetchGames(0, true).finally(() => setLoading(false));
  }, [profileId]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    await fetchGames(nextPage);
    setLoadingMore(false);
  }, [loadingMore, hasMore, fetchGames]);

  return { games, loading, loadingMore, hasMore, error, loadMore };
}

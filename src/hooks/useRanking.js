import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const PAGE_SIZE = 20;

const RATING_FIELD = {
  blitz: 'rating_blitz',
  rapid: 'rating_rapid',
  classical: 'rating_classical',
};

const TIER_CONFIG = [
  { label: 'Mestre Internacional', min: 2400, color: '#FFD700', emoji: '👑' },
  { label: 'Mestre', min: 2200, color: '#C0C0C0', emoji: '🏆' },
  { label: 'Expert', min: 2000, color: '#CD7F32', emoji: '💎' },
  { label: 'Avançado', min: 1800, color: '#7C3AED', emoji: '⚡' },
  { label: 'Intermediário', min: 1600, color: '#2563EB', emoji: '🔵' },
  { label: 'Iniciante', min: 1400, color: '#16A34A', emoji: '🟢' },
  { label: 'Novato', min: 0, color: '#6B7280', emoji: '⚪' },
];

export function getTier(rating) {
  return TIER_CONFIG.find(t => (rating || 800) >= t.min) || TIER_CONFIG[TIER_CONFIG.length - 1];
}

export function useRanking(initialMode = 'blitz') {
  const { profile } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [players, setPlayers] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const pageRef = useRef(0);

  const ratingField = RATING_FIELD[mode] || 'rating_blitz';

  const fetchPlayers = useCallback(async (page = 0, search = '', replace = false) => {
    try {
      let query = supabase
        .from('profiles')
        .select('id, user_id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical, bio')
        .order(ratingField, { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (search.trim()) {
        query = query.or(`username.ilike.%${search.trim()}%,display_name.ilike.%${search.trim()}%`);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      const ranked = (data || []).map((p, idx) => ({
        ...p,
        rank: page * PAGE_SIZE + idx + 1,
        rating: p[ratingField] || 800,
        tier: getTier(p[ratingField] || 800),
      }));

      if (replace) {
        setPlayers(ranked);
      } else {
        setPlayers(prev => [...prev, ...ranked]);
      }
      setHasMore((data || []).length === PAGE_SIZE);
    } catch (err) {
      setError(err.message);
    }
  }, [ratingField]);

  const fetchMyRank = useCallback(async () => {
    if (!profile?.id) return;
    try {
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gt(ratingField, profile[ratingField] || 800);

      setMyRank({
        rank: (count || 0) + 1,
        rating: profile[ratingField] || 800,
        tier: getTier(profile[ratingField] || 800),
        username: profile.username || profile.display_name,
        avatar_url: profile.avatar_url,
      });
    } catch {
      // silently fail
    }
  }, [profile, ratingField]);

  // Initial load / mode change
  useEffect(() => {
    pageRef.current = 0;
    setHasMore(true);
    setError(null);
    setLoading(true);
    Promise.all([fetchPlayers(0, searchQuery, true), fetchMyRank()]).finally(() => setLoading(false));
  }, [mode]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      pageRef.current = 0;
      setHasMore(true);
      setLoading(true);
      fetchPlayers(0, searchQuery, true).finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    pageRef.current = 0;
    setHasMore(true);
    await Promise.all([fetchPlayers(0, searchQuery, true), fetchMyRank()]);
    setRefreshing(false);
  }, [fetchPlayers, fetchMyRank, searchQuery]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    await fetchPlayers(nextPage, searchQuery);
    setLoadingMore(false);
  }, [loadingMore, hasMore, fetchPlayers, searchQuery]);

  return {
    players, myRank, loading, refreshing, loadingMore, hasMore,
    searchQuery, setSearchQuery, mode, setMode, error, refresh, loadMore,
  };
}

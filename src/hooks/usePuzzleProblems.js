import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
export const PAGE_SIZE = 20;

export const DIFFICULTY_LABELS = {
  easy:   'Fácil',
  medium: 'Médio',
  hard:   'Difícil',
  expert: 'Expert',
};

export const DIFFICULTY_COLORS = {
  easy:   '#22c55e',
  medium: '#f59e0b',
  hard:   '#ef4444',
  expert: '#a855f7',
};

export const THEME_LABELS = {
  'mate':              'Mate',
  'mate-in-1':         'Mate em 1',
  'mate-in-2':         'Mate em 2',
  'mate-in-3':         'Mate em 3',
  'fork':              'Garfo',
  'pin':               'Cravada',
  'skewer':            'Espeto',
  'discovered-attack': 'Ataque à Descoberta',
  'double-check':      'Duplo Xeque',
  'sacrifice':         'Sacrifício',
  'promotion':         'Promoção',
  'endgame':           'Final',
  'back-rank':         'Última Fileira',
  'x-ray':             'Raio-X',
  'combination':       'Combinação',
  'tactics':           'Tática',
  'material-gain':     'Ganho de Material',
  'attack':            'Ataque',
  'defense':           'Defesa',
  'zugzwang':          'Zugzwang',
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook: usePuzzleProblems
// ─────────────────────────────────────────────────────────────────────────────
export function usePuzzleProblems() {
  const { user } = useAuth();
  const [puzzles, setPuzzles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const pageRef = useRef(0);

  // ── Fetch puzzles list ──────────────────────────────────────────────────
  const fetchPuzzles = useCallback(async (page, currentFilters, isRefresh = false) => {
    try {
      if (page === 0) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      const { data, error: rpcErr } = await supabase.rpc('get_puzzles_list', {
        p_user_id:    user?.id ?? null,
        p_difficulty: currentFilters.difficulty ?? null,
        p_themes:     currentFilters.themes?.length ? currentFilters.themes : null,
        p_min_rating: currentFilters.minRating ?? null,
        p_max_rating: currentFilters.maxRating ?? null,
        p_limit:      PAGE_SIZE,
        p_offset:     page * PAGE_SIZE,
      });

      if (rpcErr) throw rpcErr;

      const rows = data ?? [];
      if (page === 0 || isRefresh) {
        setPuzzles(rows);
      } else {
        setPuzzles(prev => [...prev, ...rows]);
      }
      setHasMore(rows.length === PAGE_SIZE);
      pageRef.current = page;
    } catch (err) {
      setError(err.message ?? 'Erro ao carregar puzzles.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user]);

  // ── Fetch user stats ────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error: rpcErr } = await supabase.rpc('get_user_puzzle_stats', {
        p_user_id: user.id,
      });
      if (!rpcErr && data && data.length > 0) {
        setStats(data[0]);
      }
    } catch {
      // stats are optional
    }
  }, [user]);

  useEffect(() => {
    fetchPuzzles(0, filters);
    fetchStats();
  }, [fetchPuzzles, fetchStats, filters]);

  // ── Load more ───────────────────────────────────────────────────────────
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    fetchPuzzles(pageRef.current + 1, filters);
  }, [loadingMore, hasMore, fetchPuzzles, filters]);

  // ── Refresh ─────────────────────────────────────────────────────────────
  const refresh = useCallback(() => {
    pageRef.current = 0;
    fetchPuzzles(0, filters, true);
    fetchStats();
  }, [fetchPuzzles, fetchStats, filters]);

  // ── Apply filters ───────────────────────────────────────────────────────
  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    pageRef.current = 0;
  }, []);

  // ── Get next unsolved puzzle ────────────────────────────────────────────
  const getNextPuzzle = useCallback(async (overrideFilters) => {
    try {
      const f = overrideFilters ?? filters;
      const { data, error: rpcErr } = await supabase.rpc('get_next_puzzle', {
        p_user_id:    user?.id ?? null,
        p_difficulty: f.difficulty ?? null,
        p_themes:     f.themes?.length ? f.themes : null,
        p_min_rating: f.minRating ?? null,
        p_max_rating: f.maxRating ?? null,
      });
      if (rpcErr) throw rpcErr;
      return data && data.length > 0 ? data[0] : null;
    } catch {
      return null;
    }
  }, [user, filters]);

  // ── Record attempt ──────────────────────────────────────────────────────
  const recordAttempt = useCallback(async ({ puzzleId, solved, hintsUsed, attemptsCount, timeSpentSecs }) => {
    if (!user) return;
    const payload = {
      user_id:         user.id,
      puzzle_id:       puzzleId,
      solved,
      hints_used:      hintsUsed,
      attempts_count:  attemptsCount,
      time_spent_secs: solved ? timeSpentSecs : null,
      completed_at:    solved ? new Date().toISOString() : null,
      updated_at:      new Date().toISOString(),
    };

    const { error: upsertErr } = await supabase
      .from('puzzle_attempts')
      .upsert(payload, { onConflict: 'user_id,puzzle_id' });

    if (!upsertErr) {
      setPuzzles(prev =>
        prev.map(p =>
          p.id === puzzleId
            ? { ...p, user_solved: solved, user_attempts: attemptsCount }
            : p
        )
      );
      fetchStats();
    }
  }, [user, fetchStats]);

  return {
    puzzles,
    stats,
    loading,
    loadingMore,
    hasMore,
    error,
    filters,
    applyFilters,
    loadMore,
    refresh,
    getNextPuzzle,
    recordAttempt,
  };
}

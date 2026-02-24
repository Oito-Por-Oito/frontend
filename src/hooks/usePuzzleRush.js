import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook para gerenciar o estado e as operações do modo Corrida de Puzzles.
 * Conecta ao Supabase para buscar puzzles adaptativos, salvar sessões e
 * consultar o leaderboard competitivo.
 */
export function usePuzzleRush() {
  const { user } = useAuth();

  const [puzzles, setPuzzles] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [personalBest, setPersonalBest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Buscar puzzles adaptativos por rating do usuário */
  const loadPuzzles = useCallback(async (userRating = 1200, mode = '5min', count = 60) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.rpc('get_rush_puzzles', {
        p_user_rating: userRating,
        p_count: count,
        p_mode: mode,
      });
      if (err) throw err;
      setPuzzles(data ?? []);
      return data ?? [];
    } catch (e) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /** Iniciar uma nova sessão de Rush no banco */
  const startSession = useCallback(async (mode) => {
    if (!user) return null;
    try {
      const { data, error: err } = await supabase
        .from('puzzle_rush_sessions')
        .insert({ user_id: user.id, mode, score: 0, errors: 0, completed: false })
        .select('id')
        .single();
      if (err) throw err;
      return data.id;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, [user]);

  /** Finalizar a sessão com os dados completos */
  const finishSession = useCallback(async ({ sessionId, score, errors, timeSpentS, highestRating, avgTimePer }) => {
    if (!sessionId) return;
    try {
      const { error: err } = await supabase
        .from('puzzle_rush_sessions')
        .update({
          score,
          errors,
          time_spent_s: timeSpentS,
          highest_rating: highestRating,
          avg_time_per_puzzle: avgTimePer,
          completed: true,
        })
        .eq('id', sessionId);
      if (err) throw err;
    } catch (e) {
      setError(e.message);
    }
  }, []);

  /** Buscar recorde pessoal do usuário para um modo */
  const loadPersonalBest = useCallback(async (mode = '5min') => {
    if (!user) return null;
    try {
      const { data, error: err } = await supabase.rpc('get_my_rush_best', {
        p_user_id: user.id,
        p_mode: mode,
      });
      if (err) throw err;
      const row = Array.isArray(data) ? data[0] : data;
      setPersonalBest(row ?? { best_score: 0, best_time_s: 0, total_sessions: 0, last_played: null });
      return row;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, [user]);

  /** Buscar leaderboard por modo e período */
  const loadLeaderboard = useCallback(async (mode = '5min', period = 'all', limit = 20) => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase.rpc('get_rush_leaderboard', {
        p_mode: mode,
        p_limit: limit,
        p_period: period,
      });
      if (err) throw err;
      setLeaderboard(data ?? []);
      return data ?? [];
    } catch (e) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    puzzles,
    leaderboard,
    personalBest,
    loading,
    error,
    loadPuzzles,
    startSession,
    finishSession,
    loadPersonalBest,
    loadLeaderboard,
  };
}

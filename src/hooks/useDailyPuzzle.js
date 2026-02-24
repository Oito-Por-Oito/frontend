import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function getWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const labels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - dayOfWeek + i);
    days.push({
      date: d.toISOString().split('T')[0],
      label: labels[i],
      solved: null,
      isToday: i === dayOfWeek,
    });
  }
  return days;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook: useDailyPuzzle
// ─────────────────────────────────────────────────────────────────────────────

export function useDailyPuzzle() {
  const { user } = useAuth();
  const [puzzle, setPuzzle] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [streak, setStreak] = useState(0);
  const [weekDays, setWeekDays] = useState(getWeekDays());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const startTimeRef = useRef(null);

  const fetchDailyPuzzle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const today = todayISO();

      // Get today's puzzle via the DB function
      const { data: puzzleRows, error: puzzleErr } = await supabase
        .rpc('get_daily_puzzle', { target_date: today });

      if (puzzleErr) throw puzzleErr;
      if (!puzzleRows || puzzleRows.length === 0) {
        setError('Nenhum puzzle disponível para hoje.');
        return;
      }

      const p = puzzleRows[0];
      setPuzzle(p);
      startTimeRef.current = Date.now();

      if (user) {
        const [attemptRes, streakRes, weekRes] = await Promise.all([
          supabase
            .from('daily_puzzle_attempts')
            .select('*')
            .eq('user_id', user.id)
            .eq('puzzle_date', today)
            .maybeSingle(),
          supabase.rpc('get_user_daily_streak', { p_user_id: user.id }),
          supabase
            .from('daily_puzzle_attempts')
            .select('puzzle_date, solved')
            .eq('user_id', user.id)
            .in('puzzle_date', getWeekDays().map(d => d.date)),
        ]);

        if (attemptRes.data) setAttempt(attemptRes.data);
        if (streakRes.data !== null) setStreak(streakRes.data);
        if (weekRes.data) {
          const solvedMap = {};
          weekRes.data.forEach(r => { solvedMap[r.puzzle_date] = r.solved; });
          setWeekDays(prev =>
            prev.map(d => ({
              ...d,
              solved: solvedMap[d.date] !== undefined ? solvedMap[d.date] : null,
            }))
          );
        }
      }
    } catch (err) {
      setError(err.message ?? 'Erro ao carregar puzzle do dia.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDailyPuzzle();
  }, [fetchDailyPuzzle]);

  const recordAttempt = useCallback(
    async ({ solved: isSolved, failed, hintsUsed, attemptsCount }) => {
      if (!user || !puzzle) return;
      const today = todayISO();
      const timeSecs = startTimeRef.current
        ? Math.round((Date.now() - startTimeRef.current) / 1000)
        : null;

      const payload = {
        user_id: user.id,
        puzzle_id: puzzle.puzzle_id,
        puzzle_date: today,
        solved: isSolved,
        failed,
        hints_used: hintsUsed,
        attempts_count: attemptsCount,
        time_spent_secs: isSolved ? timeSecs : null,
        completed_at: isSolved ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      const { data, error: upsertErr } = await supabase
        .from('daily_puzzle_attempts')
        .upsert(payload, { onConflict: 'user_id,puzzle_date' })
        .select()
        .single();

      if (!upsertErr && data) {
        setAttempt(data);
        if (isSolved) {
          const { data: newStreak } = await supabase.rpc('get_user_daily_streak', {
            p_user_id: user.id,
          });
          if (newStreak !== null) setStreak(newStreak);
          const today2 = todayISO();
          setWeekDays(prev =>
            prev.map(d => (d.date === today2 ? { ...d, solved: true } : d))
          );
        }
      }
    },
    [user, puzzle]
  );

  return { puzzle, attempt, streak, weekDays, loading, error, refresh: fetchDailyPuzzle, recordAttempt };
}

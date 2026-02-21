import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function useUserProgress() {
  const { user, profile } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      setLoading(true);
      
      try {
        // Fetch rating history for the user (using profile.id as user_id in rating_history)
        const { data: ratingHistory, error: ratingError } = await supabase
          .from('rating_history')
          .select('*')
          .eq('user_id', profile.id)
          .order('recorded_at', { ascending: true })
          .limit(30);

        if (ratingError) {
          console.error('Error fetching rating history:', ratingError);
        }

        // Fetch recent activities
        const { data: activities, error: activitiesError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (activitiesError) {
          console.error('Error fetching activities:', activitiesError);
        }

        // Build progress object with real data
        setProgress({
          dailyGoals: {
            puzzles: { current: Math.min(profile.puzzles_solved || 0, 10), target: 10 },
            games: { current: Math.min(profile.total_games || 0, 3), target: 3 },
            studyMinutes: { current: 0, target: 30 }
          },
          continueFrom: [
            {
              id: 1,
              type: 'game',
              title: 'Partida vs Bot',
              subtitle: 'Jogue uma nova partida',
              icon: 'gamepad',
              href: '/play-computer',
              progress: 0
            },
            {
              id: 2,
              type: 'puzzle',
              title: 'Puzzle Diário',
              subtitle: 'Resolva o puzzle de hoje',
              icon: 'puzzle',
              href: '/puzzle-chess',
              progress: 0
            },
            {
              id: 3,
              type: 'lesson',
              title: 'Aprender Xadrez',
              subtitle: 'Continue suas lições',
              icon: 'book',
              href: '/learn',
              progress: 0
            }
          ],
          stats: {
            totalGames: profile.total_games || 0,
            wins: profile.wins || 0,
            losses: profile.losses || 0,
            draws: profile.draws || 0,
            puzzlesSolved: profile.puzzles_solved || 0,
            accuracy: Number(profile.accuracy) || 0,
            totalPlayTime: 0
          },
          ratingHistory: ratingHistory?.map(r => ({
            date: r.recorded_at,
            blitz: r.rating_blitz || 800,
            rapid: r.rating_rapid || 800,
            classical: r.rating_classical || 800
          })) || [
            // Fallback with current ratings if no history
            {
              date: new Date().toISOString(),
              blitz: profile.rating_blitz || 800,
              rapid: profile.rating_rapid || 800,
              classical: profile.rating_classical || 800
            }
          ],
          recentActivity: activities?.map(a => ({
            id: a.id,
            type: a.activity_type,
            result: a.result,
            description: a.description,
            time: formatDistanceToNow(new Date(a.created_at), { addSuffix: true, locale: ptBR })
          })) || [],
          streak: profile.streak_days || 0,
          lastSeen: profile.last_active_at
        });
      } catch (error) {
        console.error('Error fetching user progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, profile]);

  const updateDailyGoal = useCallback((goalType, increment = 1) => {
    setProgress(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        dailyGoals: {
          ...prev.dailyGoals,
          [goalType]: {
            ...prev.dailyGoals[goalType],
            current: Math.min(
              prev.dailyGoals[goalType].current + increment,
              prev.dailyGoals[goalType].target
            )
          }
        }
      };
    });
  }, []);

  return { progress, loading, updateDailyGoal };
}

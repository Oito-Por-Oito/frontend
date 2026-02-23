import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const TIME_CONTROL_OPTIONS = [
  { label: 'Bullet 1+0', timeControl: 'bullet', initialTime: 60, increment: 0, icon: '🚀' },
  { label: 'Bullet 2+1', timeControl: 'bullet', initialTime: 120, increment: 1, icon: '🚀' },
  { label: 'Blitz 3+0', timeControl: 'blitz', initialTime: 180, increment: 0, icon: '⚡' },
  { label: 'Blitz 3+2', timeControl: 'blitz', initialTime: 180, increment: 2, icon: '⚡' },
  { label: 'Blitz 5+0', timeControl: 'blitz', initialTime: 300, increment: 0, icon: '⚡' },
  { label: 'Blitz 5+3', timeControl: 'blitz', initialTime: 300, increment: 3, icon: '⚡' },
  { label: 'Rápido 10+0', timeControl: 'rapid', initialTime: 600, increment: 0, icon: '⏱' },
  { label: 'Rápido 10+5', timeControl: 'rapid', initialTime: 600, increment: 5, icon: '⏱' },
  { label: 'Rápido 15+10', timeControl: 'rapid', initialTime: 900, increment: 10, icon: '⏱' },
  { label: 'Clássico 30+0', timeControl: 'classical', initialTime: 1800, increment: 0, icon: '♟' },
];

/**
 * Hook para gerenciar o estado de desafio entre o usuário atual e um amigo específico.
 * @param {string} friendProfileId - ID do perfil do amigo (tabela profiles)
 */
export function useChallenge(friendProfileId) {
  const { user, profile } = useAuth();
  const [pendingChallenge, setPendingChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!profile?.id || !friendProfileId) return;

    const checkExisting = async () => {
      const { data } = await supabase
        .from('challenges')
        .select('*')
        .or(`and(challenger_id.eq.${profile.id},challenged_id.eq.${friendProfileId}),and(challenger_id.eq.${friendProfileId},challenged_id.eq.${profile.id})`)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) setPendingChallenge(data);
    };

    checkExisting();

    channelRef.current = supabase
      .channel(`challenge_pair:${[profile.id, friendProfileId].sort().join('_')}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, (payload) => {
        const ch = payload.new;
        if (!ch) return;
        const involves =
          (ch.challenger_id === profile.id && ch.challenged_id === friendProfileId) ||
          (ch.challenger_id === friendProfileId && ch.challenged_id === profile.id);
        if (!involves) return;

        if (payload.eventType === 'INSERT' || (payload.eventType === 'UPDATE' && ch.status === 'pending')) {
          setPendingChallenge(ch);
        } else if (payload.eventType === 'UPDATE' && ch.status !== 'pending') {
          setPendingChallenge(prev => (prev?.id === ch.id ? ch : prev));
        }
      })
      .subscribe();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [profile?.id, friendProfileId]);

  const sendChallenge = useCallback(async ({ timeControl, initialTime, increment, colorPreference, message }) => {
    if (!profile?.id || !friendProfileId) return null;
    setLoading(true);
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('challenges')
        .insert({
          challenger_id: profile.id,
          challenged_id: friendProfileId,
          time_control: timeControl,
          initial_time: initialTime,
          increment: increment,
          color_preference: colorPreference || 'random',
          message: message || null,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setPendingChallenge(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [profile?.id, friendProfileId]);

  const cancelChallenge = useCallback(async (challengeId) => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      await supabase
        .from('challenges')
        .update({ status: 'cancelled' })
        .eq('id', challengeId)
        .eq('challenger_id', profile.id);
      setPendingChallenge(null);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  return {
    pendingChallenge,
    iAmChallenger: pendingChallenge?.challenger_id === profile?.id,
    loading,
    error,
    sendChallenge,
    cancelChallenge,
  };
}

/**
 * Hook global para escutar TODOS os desafios recebidos pelo usuário atual.
 */
export function usePendingChallenges() {
  const { profile } = useAuth();
  const [incomingChallenges, setIncomingChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchChallenges = async () => {
      const { data } = await supabase
        .from('challenges')
        .select(`
          *,
          challenger:challenger_id(id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical)
        `)
        .eq('challenged_id', profile.id)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      setIncomingChallenges(data || []);
      setLoading(false);
    };

    fetchChallenges();

    const channel = supabase
      .channel(`incoming_challenges:${profile.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'challenges',
        filter: `challenged_id=eq.${profile.id}`,
      }, () => fetchChallenges())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile?.id]);

  const acceptChallenge = useCallback(async (challenge) => {
    if (!profile?.id) return null;
    try {
      let whiteId, blackId;
      if (challenge.color_preference === 'white') {
        whiteId = challenge.challenger_id;
        blackId = challenge.challenged_id;
      } else if (challenge.color_preference === 'black') {
        whiteId = challenge.challenged_id;
        blackId = challenge.challenger_id;
      } else {
        const rand = Math.random() < 0.5;
        whiteId = rand ? challenge.challenger_id : challenge.challenged_id;
        blackId = rand ? challenge.challenged_id : challenge.challenger_id;
      }

      const { data: newGame, error: gameError } = await supabase
        .from('games')
        .insert({
          white_player_id: whiteId,
          black_player_id: blackId,
          status: 'active',
          time_control: challenge.time_control,
          initial_time: challenge.initial_time,
          increment: challenge.increment,
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          current_turn: 'white',
          white_time_left: challenge.initial_time * 1000,
          black_time_left: challenge.initial_time * 1000,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (gameError || !newGame) throw gameError;

      await supabase
        .from('challenges')
        .update({ status: 'accepted', game_id: newGame.id })
        .eq('id', challenge.id);

      setIncomingChallenges(prev => prev.filter(c => c.id !== challenge.id));
      return newGame.id;
    } catch (err) {
      console.error('Erro ao aceitar desafio:', err);
      return null;
    }
  }, [profile?.id]);

  const declineChallenge = useCallback(async (challengeId) => {
    await supabase
      .from('challenges')
      .update({ status: 'declined' })
      .eq('id', challengeId);
    setIncomingChallenges(prev => prev.filter(c => c.id !== challengeId));
  }, []);

  return {
    incomingChallenges,
    loading,
    pendingCount: incomingChallenges.length,
    acceptChallenge,
    declineChallenge,
  };
}

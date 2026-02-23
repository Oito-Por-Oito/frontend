import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

/**
 * Hook para gerenciar o estado de amizade entre o usuário atual e outro usuário.
 * @param {string} targetUserId - user_id (auth) do outro usuário
 */
export function useFriendship(targetUserId) {
  const { user } = useAuth();
  const [status, setStatus] = useState('none'); // 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'declined'
  const [friendshipId, setFriendshipId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const myUserId = user?.id;

  const loadStatus = useCallback(async () => {
    if (!myUserId || !targetUserId || myUserId === targetUserId) {
      setStatus('none');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const { data, error: fetchErr } = await supabase
      .from('friendships')
      .select('*')
      .or(`and(requester_id.eq.${myUserId},addressee_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},addressee_id.eq.${myUserId})`)
      .maybeSingle();

    if (fetchErr) { setError(fetchErr.message); setLoading(false); return; }

    if (!data) {
      setStatus('none');
      setFriendshipId(null);
    } else {
      setFriendshipId(data.id);
      if (data.status === 'accepted') setStatus('accepted');
      else if (data.status === 'declined') setStatus('declined');
      else if (data.requester_id === myUserId) setStatus('pending_sent');
      else setStatus('pending_received');
    }
    setLoading(false);
  }, [myUserId, targetUserId]);

  useEffect(() => {
    if (myUserId && targetUserId) loadStatus();
  }, [myUserId, targetUserId, loadStatus]);

  const sendRequest = useCallback(async () => {
    if (!myUserId || !targetUserId) return;
    setActionLoading(true);
    setError(null);
    const { data, error: insertErr } = await supabase
      .from('friendships')
      .insert({ requester_id: myUserId, addressee_id: targetUserId, status: 'pending' })
      .select().single();
    if (insertErr) { setError(insertErr.message); }
    else { setFriendshipId(data.id); setStatus('pending_sent'); }
    setActionLoading(false);
  }, [myUserId, targetUserId]);

  const cancelRequest = useCallback(async () => {
    if (!friendshipId) return;
    setActionLoading(true);
    await supabase.from('friendships').delete().eq('id', friendshipId);
    setStatus('none');
    setFriendshipId(null);
    setActionLoading(false);
  }, [friendshipId]);

  const acceptRequest = useCallback(async () => {
    if (!friendshipId) return;
    setActionLoading(true);
    await supabase.from('friendships').update({ status: 'accepted', updated_at: new Date().toISOString() }).eq('id', friendshipId);
    setStatus('accepted');
    setActionLoading(false);
  }, [friendshipId]);

  const declineRequest = useCallback(async () => {
    if (!friendshipId) return;
    setActionLoading(true);
    await supabase.from('friendships').update({ status: 'declined', updated_at: new Date().toISOString() }).eq('id', friendshipId);
    setStatus('declined');
    setFriendshipId(null);
    setActionLoading(false);
  }, [friendshipId]);

  const removeFriend = useCallback(async () => {
    if (!friendshipId) return;
    setActionLoading(true);
    await supabase.from('friendships').delete().eq('id', friendshipId);
    setStatus('none');
    setFriendshipId(null);
    setActionLoading(false);
  }, [friendshipId]);

  return {
    status, friendshipId, loading, actionLoading, error,
    isOwnProfile: myUserId === targetUserId,
    sendRequest, cancelRequest, acceptRequest, declineRequest, removeFriend,
    refresh: loadStatus,
  };
}

/**
 * Hook para listar amigos, solicitações recebidas e enviadas do usuário atual.
 */
export function useFriends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const myUserId = user?.id;

  const load = useCallback(async (isRefresh = false) => {
    if (!myUserId) return;
    if (!isRefresh) setLoading(true);
    setError(null);

    const { data, error: fetchErr } = await supabase
      .from('friendships')
      .select('*')
      .or(`requester_id.eq.${myUserId},addressee_id.eq.${myUserId}`)
      .order('updated_at', { ascending: false });

    if (fetchErr) { setError(fetchErr.message); setLoading(false); setRefreshing(false); return; }

    const otherIds = (data || []).map(f => f.requester_id === myUserId ? f.addressee_id : f.requester_id);

    const { data: profilesData } = otherIds.length > 0
      ? await supabase
          .from('profiles')
          .select('id, user_id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical, total_games, wins, streak_days, last_active_at')
          .in('user_id', otherIds)
      : { data: [] };

    const profileMap = new Map((profilesData || []).map(p => [p.user_id, p]));

    const friendsList = [], receivedList = [], sentList = [];
    for (const f of data || []) {
      const otherId = f.requester_id === myUserId ? f.addressee_id : f.requester_id;
      const profile = profileMap.get(otherId);
      if (!profile) continue;
      const entry = { friendship: f, profile };
      if (f.status === 'accepted') friendsList.push(entry);
      else if (f.status === 'pending') {
        if (f.addressee_id === myUserId) receivedList.push(entry);
        else sentList.push(entry);
      }
    }

    setFriends(friendsList);
    setReceived(receivedList);
    setSent(sentList);
    setLoading(false);
    setRefreshing(false);
  }, [myUserId]);

  useEffect(() => { if (myUserId) load(); }, [myUserId, load]);

  const refresh = useCallback(async () => { setRefreshing(true); await load(true); }, [load]);

  const acceptRequest = useCallback(async (friendshipId) => {
    await supabase.from('friendships').update({ status: 'accepted', updated_at: new Date().toISOString() }).eq('id', friendshipId);
    await load(true);
  }, [load]);

  const declineRequest = useCallback(async (friendshipId) => {
    await supabase.from('friendships').update({ status: 'declined', updated_at: new Date().toISOString() }).eq('id', friendshipId);
    await load(true);
  }, [load]);

  const removeFriend = useCallback(async (friendshipId) => {
    await supabase.from('friendships').delete().eq('id', friendshipId);
    await load(true);
  }, [load]);

  const cancelRequest = useCallback(async (friendshipId) => {
    await supabase.from('friendships').delete().eq('id', friendshipId);
    await load(true);
  }, [load]);

  return {
    friends, received, sent, loading, refreshing, error,
    refresh, acceptRequest, declineRequest, removeFriend, cancelRequest,
    totalPending: received.length,
  };
}

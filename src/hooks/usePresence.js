import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook para gerenciar presença de jogadores usando Supabase Realtime
 * @param {string} channelName - Nome do canal de presença
 * @param {string} playerId - ID do perfil do jogador
 * @param {Object} userData - Dados do jogador para tracking
 * @param {Object} options - Opções de configuração
 * @param {Function} options.onPlayerLeave - Callback quando um jogador sai
 * @param {boolean} options.enabled - Se o tracking deve estar ativo
 */
export function usePresence(channelName, playerId, userData, options = {}) {
  const { onPlayerLeave, enabled = true } = options;
  const [onlineUsers, setOnlineUsers] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef(null);

  // Cleanup de jogador que saiu
  const handlePlayerLeave = useCallback(async (leftPlayerId) => {
    if (!leftPlayerId) return;
    
    try {
      // Chamar função RPC para remover da fila
      await supabase.rpc('remove_player_from_matchmaking', {
        p_player_id: leftPlayerId
      });
      
      // Callback externo se fornecido
      onPlayerLeave?.(leftPlayerId);
    } catch (error) {
      console.error('Erro ao limpar jogador offline:', error);
    }
  }, [onPlayerLeave]);

  useEffect(() => {
    if (!enabled || !playerId || !channelName) {
      return;
    }

    // Criar canal de presença
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: playerId,
        },
      },
    });

    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineUsers(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log(`[Presence] Jogador entrou: ${key}`, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log(`[Presence] Jogador saiu: ${key}`, leftPresences);
        // Limpar o jogador que saiu da fila de matchmaking
        handlePlayerLeave(key);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          // Registrar presença com dados do usuário
          const trackResult = await channel.track({
            ...userData,
            online_at: new Date().toISOString(),
          });
          console.log('[Presence] Track result:', trackResult);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsConnected(false);
        }
      });

    return () => {
      // Cleanup ao desmontar
      if (channelRef.current) {
        channelRef.current.untrack();
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [channelName, playerId, userData, enabled, handlePlayerLeave]);

  // Atualizar dados de presença
  const updatePresence = useCallback(async (newData) => {
    if (channelRef.current && isConnected) {
      await channelRef.current.track({
        ...userData,
        ...newData,
        updated_at: new Date().toISOString(),
      });
    }
  }, [userData, isConnected]);

  // Listar jogadores online
  const getOnlinePlayers = useCallback(() => {
    return Object.entries(onlineUsers).map(([key, presences]) => ({
      playerId: key,
      ...presences[0], // Pegar primeira presença (pode haver múltiplas abas)
    }));
  }, [onlineUsers]);

  // Verificar se um jogador específico está online
  const isPlayerOnline = useCallback((targetPlayerId) => {
    return !!onlineUsers[targetPlayerId];
  }, [onlineUsers]);

  return {
    onlineUsers,
    isConnected,
    updatePresence,
    getOnlinePlayers,
    isPlayerOnline,
  };
}

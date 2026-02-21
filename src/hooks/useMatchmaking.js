import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePresence } from '@/hooks/usePresence';
import { getRatingForTimeControl, TIME_CONTROLS, INITIAL_FEN } from '@/lib/gameHelpers';
import { playMatchFoundSound } from '@/hooks/useSound';

const SUPABASE_URL = 'https://ispjuxtvrxykioorhbmk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzcGp1eHR2cnh5a2lvb3JoYm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTAzNDAsImV4cCI6MjA4NTM4NjM0MH0.Vfr2kuXTfQVBBzx7ayEYGOoAxeuZ1vblgQajvjhHFSc';
const HEARTBEAT_INTERVAL = 30000; // 30 segundos
const HEARTBEAT_STALE_THRESHOLD = 60000; // 60 segundos - entradas mais velhas são ignoradas

export function useMatchmaking() {
  const { user, profile } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [matchedGame, setMatchedGame] = useState(null);
  const [queueEntry, setQueueEntry] = useState(null);
  const heartbeatIntervalRef = useRef(null);
  const queueEntryRef = useRef(null);
  const profileRef = useRef(null);

  // Manter refs atualizadas para uso em beforeunload
  useEffect(() => {
    queueEntryRef.current = queueEntry;
    profileRef.current = profile;
  }, [queueEntry, profile]);

  // Dados de presença do usuário
  const presenceData = useMemo(() => ({
    username: profile?.username || profile?.display_name || 'Jogador',
    avatar_url: profile?.avatar_url,
    rating: profile?.rating_rapid || 800,
  }), [profile]);

  // Hook de presença - só ativo quando estiver buscando
  const { isConnected: presenceConnected } = usePresence(
    'matchmaking-presence',
    profile?.id,
    presenceData,
    {
      enabled: isSearching && !!profile?.id,
    }
  );

  // Atualizar heartbeat na fila
  const updateHeartbeat = useCallback(async () => {
    if (!queueEntryRef.current?.id) return;
    
    try {
      await supabase
        .from('matchmaking_queue')
        .update({ last_heartbeat: new Date().toISOString() })
        .eq('id', queueEntryRef.current.id);
    } catch (err) {
      console.error('Erro ao atualizar heartbeat:', err);
    }
  }, []);

  // Iniciar heartbeat quando entrar na fila
  useEffect(() => {
    if (!queueEntry) {
      // Limpar intervalo se não tiver entrada na fila
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      return;
    }

    // Atualizar heartbeat imediatamente
    updateHeartbeat();
    
    // Configurar intervalo de heartbeat
    heartbeatIntervalRef.current = setInterval(updateHeartbeat, HEARTBEAT_INTERVAL);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [queueEntry, updateHeartbeat]);

  // Listener para beforeunload - tentar limpar ao fechar janela
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentEntry = queueEntryRef.current;
      const currentProfile = profileRef.current;
      
      if (!currentEntry || !currentProfile) return;

      // Usar sendBeacon para request mais confiável ao fechar
      const url = `${SUPABASE_URL}/rest/v1/matchmaking_queue?player_id=eq.${currentProfile.id}`;
      
      try {
        navigator.sendBeacon(
          url,
          new Blob([JSON.stringify({})], { type: 'application/json' })
        );
        
        // Também tentar via fetch com keepalive
        fetch(url, {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          keepalive: true,
        }).catch(() => {
          // Ignorar erros silenciosamente
        });
      } catch {
        // Ignorar erros silenciosamente
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, []);

  // Entrar na fila de matchmaking
  const joinQueue = useCallback(async (timeControlName) => {
    if (!user || !profile) {
      setError('Você precisa estar logado para jogar online');
      return null;
    }

    setError(null);
    setIsSearching(true);

    try {
      const timeControl = TIME_CONTROLS.find(tc => tc.name === timeControlName);
      if (!timeControl) {
        throw new Error('Controle de tempo inválido');
      }

      const rating = getRatingForTimeControl(profile, timeControlName);

      // 1. Remover entrada antiga deste jogador (evitar duplicatas)
      await supabase
        .from('matchmaking_queue')
        .delete()
        .eq('player_id', profile.id);

      // 2. Limpar entradas órfãs (jogadores que fecharam o navegador)
      await supabase.rpc('cleanup_stale_matchmaking_entries');

      // Calcular threshold de heartbeat (apenas jogadores ativos nos últimos 60s)
      const heartbeatThreshold = new Date(Date.now() - HEARTBEAT_STALE_THRESHOLD).toISOString();

      // Primeiro, verificar se já existe alguém na fila com o mesmo controle de tempo
      // Filtrar apenas jogadores com heartbeat recente
      const { data: existingQueue, error: queueError } = await supabase
        .from('matchmaking_queue')
        .select('*, profiles:player_id(id, user_id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical)')
        .eq('time_control', timeControlName)
        .neq('player_id', profile.id)
        .gt('last_heartbeat', heartbeatThreshold)
        .order('created_at', { ascending: true })
        .limit(1);

      if (queueError) throw queueError;

      // Se encontrou alguém na fila (com heartbeat válido), criar a partida
      if (existingQueue && existingQueue.length > 0) {
        const opponent = existingQueue[0];
        
        // Remover oponente da fila
        await supabase
          .from('matchmaking_queue')
          .delete()
          .eq('id', opponent.id);

        // Decidir cores aleatoriamente
        const isWhite = Math.random() < 0.5;
        const whitePlayerId = isWhite ? profile.id : opponent.player_id;
        const blackPlayerId = isWhite ? opponent.player_id : profile.id;

        // Criar a partida
        const { data: newGame, error: gameError } = await supabase
          .from('games')
          .insert({
            white_player_id: whitePlayerId,
            black_player_id: blackPlayerId,
            status: 'active',
            time_control: timeControlName,
            initial_time: timeControl.time,
            increment: timeControl.increment,
            fen: INITIAL_FEN,
            current_turn: 'white',
            white_time_left: timeControl.time * 1000,
            black_time_left: timeControl.time * 1000,
            started_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (gameError) throw gameError;

        playMatchFoundSound();
        setMatchedGame(newGame);
        setIsSearching(false);
        return newGame;
      }

      // Ninguém na fila, adicionar-se à fila
      const { data: entry, error: insertError } = await supabase
        .from('matchmaking_queue')
        .insert({
          player_id: profile.id,
          time_control: timeControlName,
          initial_time: timeControl.time,
          increment: timeControl.increment,
          rating: rating,
          rating_range: 200,
          last_heartbeat: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        // Se for erro de duplicata, já está na fila
        if (insertError.code === '23505') {
          setError('Você já está na fila de espera');
        } else {
          throw insertError;
        }
      }

      setQueueEntry(entry);
      return null;
    } catch (err) {
      console.error('Erro ao entrar na fila:', err);
      setError(err.message);
      setIsSearching(false);
      return null;
    }
  }, [user, profile]);

  // Sair da fila de matchmaking
  const leaveQueue = useCallback(async () => {
    if (!profile) return;

    try {
      await supabase
        .from('matchmaking_queue')
        .delete()
        .eq('player_id', profile.id);

      setQueueEntry(null);
      setIsSearching(false);
    } catch (err) {
      console.error('Erro ao sair da fila:', err);
    }
  }, [profile]);

  // Escutar por partidas criadas (quando alguém te encontra na fila)
  useEffect(() => {
    if (!profile || !isSearching || matchedGame) return;

    const channel = supabase.channel('matchmaking-games')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'games',
        },
        (payload) => {
          const game = payload.new;
          // Verificar se sou um dos jogadores
          if (game.white_player_id === profile.id || game.black_player_id === profile.id) {
            if (game.status === 'active') {
              playMatchFoundSound();
              setMatchedGame(game);
              setIsSearching(false);
              setQueueEntry(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, isSearching, matchedGame]);

  // Limpar fila ao desmontar (backup, o beforeunload é mais confiável)
  useEffect(() => {
    return () => {
      if (queueEntryRef.current && profileRef.current) {
        supabase
          .from('matchmaking_queue')
          .delete()
          .eq('player_id', profileRef.current.id)
          .then(() => {
            console.log('[Matchmaking] Cleanup ao desmontar');
          })
          .catch((err) => {
            console.error('[Matchmaking] Erro no cleanup:', err);
          });
      }
    };
  }, []);

  return {
    isSearching,
    error,
    matchedGame,
    setMatchedGame,
    joinQueue,
    leaveQueue,
    clearMatchedGame: () => setMatchedGame(null),
    presenceConnected,
  };
}

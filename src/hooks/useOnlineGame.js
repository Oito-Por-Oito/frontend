import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { calculateNewRating, getRatingCategory, getRatingForTimeControl } from '@/lib/gameHelpers';
import { playMoveSound, playCaptureSound, playCheckSound, playGameEndSound, playLowTimeSound } from '@/hooks/useSound';

// Função auxiliar para tocar som baseado no lance
const playMoveAudio = (moveResult, chessInstance) => {
  if (chessInstance.isCheckmate()) {
    // Som de fim de jogo será tratado separadamente
    return;
  }
  
  if (chessInstance.inCheck()) {
    playCheckSound();
  } else if (moveResult.captured) {
    playCaptureSound();
  } else {
    playMoveSound();
  }
};

export function useOnlineGame(gameId) {
  const { user, profile } = useAuth();
  const [game, setGame] = useState(null);
  const [chess] = useState(() => new Chess());
  const [myColor, setMyColor] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ white: 0, black: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moves, setMoves] = useState([]);
  const [drawOffer, setDrawOffer] = useState(null);
  const [rematchOffer, setRematchOffer] = useState(null); // null | 'pending' | 'received'
  const [rematchGameId, setRematchGameId] = useState(null);
  const [chatMessage, setChatMessage] = useState(null); // Mensagem de chat recebida
  const [spectatorCount, setSpectatorCount] = useState(0); // Contagem de espectadores
  
  const timerRef = useRef(null);
  const lastMoveTimeRef = useRef(null);
  const chatTimeoutRef = useRef(null);
  const lastLowTimeSoundRef = useRef(0);

  // Carregar partida inicial
  useEffect(() => {
    if (!gameId) return;

    const loadGame = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('games')
          .select(`
            *,
            white_player:white_player_id(id, user_id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical),
            black_player:black_player_id(id, user_id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical)
          `)
          .eq('id', gameId)
          .single();

        if (fetchError) throw fetchError;

        setGame(data);
        chess.load(data.fen);
        setTimeLeft({
          white: data.white_time_left,
          black: data.black_time_left,
        });
        lastMoveTimeRef.current = data.last_move_at ? new Date(data.last_move_at).getTime() : Date.now();

        // Determinar minha cor
        if (profile) {
          if (data.white_player_id === profile.id) {
            setMyColor('white');
            setOpponent(data.black_player);
          } else if (data.black_player_id === profile.id) {
            setMyColor('black');
            setOpponent(data.white_player);
          }
        }

        // Carregar lances
        const { data: movesData } = await supabase
          .from('game_moves')
          .select('*')
          .eq('game_id', gameId)
          .order('move_number', { ascending: true });

        if (movesData) setMoves(movesData);

        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar partida:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId, profile, chess]);

  // Subscription para atualizações em tempo real
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase.channel(`game:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          const updatedGame = payload.new;
          
          setGame(prev => {
            // Detectar fim de jogo para tocar som
            if (updatedGame.status === 'completed' && prev?.status !== 'completed') {
              const isDraw = updatedGame.result === '1/2-1/2';
              if (!isDraw && profile) {
                const isWin = updatedGame.winner_id === profile.id;
                playGameEndSound(isWin);
              }
            }
            return { ...prev, ...updatedGame };
          });
          
          // Detectar oferta de empate via Realtime
          if (profile) {
            if (updatedGame.draw_offer_from) {
              if (updatedGame.draw_offer_from === profile.id) {
                setDrawOffer('pending'); // Eu ofereci
              } else {
                setDrawOffer('received'); // Oponente ofereceu
              }
            } else {
              setDrawOffer(null); // Oferta cancelada/recusada
            }
            
            // Detectar oferta de rematch via Realtime
            if (updatedGame.rematch_offer_from) {
              if (updatedGame.rematch_offer_from === profile.id) {
                setRematchOffer('pending'); // Eu ofereci
              } else {
                setRematchOffer('received'); // Oponente ofereceu
              }
            } else if (!updatedGame.rematch_game_id) {
              setRematchOffer(null); // Oferta cancelada/recusada
            }
            
            // Detectar partida de rematch criada
            if (updatedGame.rematch_game_id && !rematchGameId) {
              setRematchGameId(updatedGame.rematch_game_id);
            }
            
            // Detectar mensagem de chat rápido
            if (updatedGame.last_chat) {
              const chat = updatedGame.last_chat;
              // Mostrar apenas mensagens do oponente
              if (chat.sender_id !== profile.id) {
                // Verificar se a mensagem é recente (menos de 10 segundos)
                const sentAt = new Date(chat.sent_at).getTime();
                if (Date.now() - sentAt < 10000) {
                  setChatMessage(chat);
                  // Limpar após 4 segundos
                  if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);
                  chatTimeoutRef.current = setTimeout(() => setChatMessage(null), 4000);
                }
              }
            }
          }
          
          // Atualizar tabuleiro se FEN mudou
          if (updatedGame.fen && updatedGame.fen !== chess.fen()) {
            chess.load(updatedGame.fen);
          }
          
          // Atualizar tempos
          setTimeLeft({
            white: updatedGame.white_time_left,
            black: updatedGame.black_time_left,
          });
          
          lastMoveTimeRef.current = updatedGame.last_move_at 
            ? new Date(updatedGame.last_move_at).getTime() 
            : Date.now();
        }
      )
      .subscribe();

    // Subscription para novos lances (som do oponente)
    const movesChannel = supabase.channel(`game-moves:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_moves',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const newMove = payload.new;
          
          // Tocar som apenas para lances do oponente (evita duplicação)
          if (profile && newMove.player_id !== profile.id) {
            const isCapture = newMove.san.includes('x');
            const isCheck = newMove.san.includes('+') || newMove.san.includes('#');
            
            if (isCheck) {
              playCheckSound();
            } else if (isCapture) {
              playCaptureSound();
            } else {
              playMoveSound();
            }
          }
          
          setMoves(prev => [...prev, newMove]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(movesChannel);
    };
  }, [gameId, chess]);

  // Presence para contar espectadores
  useEffect(() => {
    if (!gameId || !profile) return;

    const presenceChannel = supabase.channel(`spectators:${gameId}`, {
      config: { presence: { key: profile.id } }
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        // Contar espectadores (excluindo os jogadores)
        let count = 0;
        for (const key of Object.keys(state)) {
          // Não contar os jogadores como espectadores
          if (key !== game?.white_player_id && key !== game?.black_player_id) {
            count++;
          }
        }
        setSpectatorCount(count);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [gameId, profile, game?.white_player_id, game?.black_player_id]);

  // Timer local
  useEffect(() => {
    if (!game || game.status !== 'active') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const currentTurn = game.current_turn;
        const elapsed = Date.now() - (lastMoveTimeRef.current || Date.now());
        
        let newTime;
        if (currentTurn === 'white') {
          newTime = Math.max(0, game.white_time_left - elapsed);
        } else {
          newTime = Math.max(0, game.black_time_left - elapsed);
        }
        
        // Tocar som de tempo baixo apenas para o jogador atual
        // quando for a vez dele e o tempo estiver abaixo de 30s
        if (myColor === currentTurn && newTime < 30000 && newTime > 0) {
          const now = Date.now();
          if (now - lastLowTimeSoundRef.current > 1000) {
            playLowTimeSound();
            lastLowTimeSoundRef.current = now;
          }
        }
        
        if (currentTurn === 'white') {
          return { ...prev, white: newTime };
        } else {
          return { ...prev, black: newTime };
        }
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [game]);

  // Fazer um lance
  const makeMove = useCallback(async (from, to, promotion = 'q') => {
    if (!game || !profile || game.status !== 'active') return false;
    
    // Verificar se é minha vez
    if (game.current_turn !== myColor) return false;

    // Tentar fazer o lance localmente
    const moveResult = chess.move({ from, to, promotion });
    if (!moveResult) return false;

    // Tocar som do lance imediatamente
    playMoveAudio(moveResult, chess);

    const now = Date.now();
    const elapsed = now - (lastMoveTimeRef.current || now);
    
    // Calcular novo tempo
    let newTimeLeft;
    if (myColor === 'white') {
      newTimeLeft = Math.max(0, game.white_time_left - elapsed) + (game.increment * 1000);
    } else {
      newTimeLeft = Math.max(0, game.black_time_left - elapsed) + (game.increment * 1000);
    }

    // Verificar fim de jogo
    let result = null;
    let resultReason = null;
    let winnerId = null;
    let status = 'active';

    if (chess.isCheckmate()) {
      result = myColor === 'white' ? '1-0' : '0-1';
      resultReason = 'checkmate';
      winnerId = profile.id;
      status = 'completed';
    } else if (chess.isStalemate()) {
      result = '1/2-1/2';
      resultReason = 'stalemate';
      status = 'completed';
    } else if (chess.isInsufficientMaterial()) {
      result = '1/2-1/2';
      resultReason = 'insufficient_material';
      status = 'completed';
    } else if (chess.isThreefoldRepetition()) {
      result = '1/2-1/2';
      resultReason = 'threefold_repetition';
      status = 'completed';
    } else if (chess.isDraw()) {
      result = '1/2-1/2';
      resultReason = 'fifty_moves';
      status = 'completed';
    }

    try {
      // Atualizar jogo no banco (limpar oferta de empate se houver)
      const updateData = {
        fen: chess.fen(),
        pgn: chess.pgn(),
        current_turn: myColor === 'white' ? 'black' : 'white',
        last_move_at: new Date().toISOString(),
        draw_offer_from: null, // Limpar oferta de empate ao fazer lance
        ...(myColor === 'white' 
          ? { white_time_left: newTimeLeft } 
          : { black_time_left: newTimeLeft }
        ),
      };

      if (status === 'completed') {
        updateData.status = status;
        updateData.result = result;
        updateData.result_reason = resultReason;
        updateData.winner_id = winnerId;
        updateData.ended_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('games')
        .update(updateData)
        .eq('id', gameId);

      if (updateError) throw updateError;

      // Inserir lance
      await supabase
        .from('game_moves')
        .insert({
          game_id: gameId,
          move_number: moves.length + 1,
          player_id: profile.id,
          from_square: from,
          to_square: to,
          san: moveResult.san,
          fen_after: chess.fen(),
          time_left: newTimeLeft,
        });

      // Se o jogo terminou, atualizar ratings
      if (status === 'completed') {
        await updateRatings(result, resultReason);
      }

      return true;
    } catch (err) {
      console.error('Erro ao fazer lance:', err);
      // Reverter lance local
      chess.undo();
      return false;
    }
  }, [game, profile, myColor, chess, gameId, moves.length]);

  // Atualizar ratings após partida (usando função RPC do banco)
  const updateRatings = useCallback(async (result, resultReason) => {
    if (!gameId) {
      console.warn('[updateRatings] gameId não definido');
      return;
    }

    console.log('[updateRatings] Iniciando...', { gameId, result, resultReason });

    try {
      const { data, error } = await supabase.rpc('update_game_ratings', {
        p_game_id: gameId,
        p_result: result,
        p_result_reason: resultReason,
      });

      if (error) {
        console.error('[updateRatings] Erro RPC:', error.message, error.details, error.hint);
      } else {
        console.log('[updateRatings] Sucesso!', data);
      }
    } catch (err) {
      console.error('[updateRatings] Exceção:', err);
    }
  }, [gameId]);

  // Desistir
  const resign = useCallback(async () => {
    if (!game || !profile || game.status !== 'active') return;

    const result = myColor === 'white' ? '0-1' : '1-0';
    const winnerId = myColor === 'white' ? game.black_player_id : game.white_player_id;

    try {
      await supabase
        .from('games')
        .update({
          status: 'completed',
          result,
          result_reason: 'resignation',
          winner_id: winnerId,
          ended_at: new Date().toISOString(),
        })
        .eq('id', gameId);

      await updateRatings(result, 'resignation');
    } catch (err) {
      console.error('Erro ao desistir:', err);
    }
  }, [game, profile, myColor, gameId]);

  // Oferecer empate
  const offerDraw = useCallback(async () => {
    if (!game || !profile || game.status !== 'active') return;
    
    // Não pode oferecer se já tem oferta pendente
    if (game.draw_offer_from) return;

    try {
      await supabase
        .from('games')
        .update({ draw_offer_from: profile.id })
        .eq('id', gameId);
        
      setDrawOffer('pending');
    } catch (err) {
      console.error('Erro ao oferecer empate:', err);
    }
  }, [game, profile, gameId]);

  // Aceitar empate
  const acceptDraw = useCallback(async () => {
    if (!game || game.status !== 'active') return;

    try {
      await supabase
        .from('games')
        .update({
          status: 'completed',
          result: '1/2-1/2',
          result_reason: 'draw_agreement',
          draw_offer_from: null,
          ended_at: new Date().toISOString(),
        })
        .eq('id', gameId);

      await updateRatings('1/2-1/2', 'draw_agreement');
    } catch (err) {
      console.error('Erro ao aceitar empate:', err);
    }
  }, [game, gameId]);

  // Recusar empate
  const declineDraw = useCallback(async () => {
    if (!game || game.status !== 'active') return;

    try {
      await supabase
        .from('games')
        .update({ draw_offer_from: null })
        .eq('id', gameId);
        
      setDrawOffer(null);
    } catch (err) {
      console.error('Erro ao recusar empate:', err);
    }
  }, [game, gameId]);

  // Cancelar oferta de empate (quem ofereceu)
  const cancelDraw = useCallback(async () => {
    if (!game || game.status !== 'active') return;
    if (game.draw_offer_from !== profile?.id) return; // Só quem ofereceu pode cancelar

    try {
      await supabase
        .from('games')
        .update({ draw_offer_from: null })
        .eq('id', gameId);
        
      setDrawOffer(null);
    } catch (err) {
      console.error('Erro ao cancelar oferta:', err);
    }
  }, [game, profile, gameId]);

  // ========== SISTEMA DE REMATCH ==========
  
  // Oferecer rematch
  const offerRematch = useCallback(async () => {
    if (!game || !profile || game.status !== 'completed') return;
    if (game.rematch_offer_from || game.rematch_game_id) return; // Já tem oferta ou rematch

    try {
      await supabase
        .from('games')
        .update({ rematch_offer_from: profile.id })
        .eq('id', gameId);
        
      setRematchOffer('pending');
    } catch (err) {
      console.error('Erro ao oferecer rematch:', err);
    }
  }, [game, profile, gameId]);

  // Aceitar rematch (cria nova partida com cores invertidas)
  const acceptRematch = useCallback(async () => {
    if (!game || game.status !== 'completed') return;
    if (!game.rematch_offer_from || game.rematch_offer_from === profile?.id) return;

    // Inverter cores
    const newWhiteId = game.black_player_id;
    const newBlackId = game.white_player_id;
    const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    try {
      // Criar nova partida
      const { data: newGame, error } = await supabase
        .from('games')
        .insert({
          white_player_id: newWhiteId,
          black_player_id: newBlackId,
          status: 'active',
          time_control: game.time_control,
          initial_time: game.initial_time,
          increment: game.increment,
          fen: INITIAL_FEN,
          current_turn: 'white',
          white_time_left: game.initial_time * 1000,
          black_time_left: game.initial_time * 1000,
          started_at: new Date().toISOString(),
          original_game_id: gameId,
        })
        .select()
        .single();

      if (!error && newGame) {
        // Atualizar partida original com link para rematch
        await supabase
          .from('games')
          .update({ 
            rematch_offer_from: null,
            rematch_game_id: newGame.id 
          })
          .eq('id', gameId);
          
        setRematchGameId(newGame.id);
      }
    } catch (err) {
      console.error('Erro ao aceitar rematch:', err);
    }
  }, [game, profile, gameId]);

  // Recusar rematch
  const declineRematch = useCallback(async () => {
    if (!game || game.status !== 'completed') return;

    try {
      await supabase
        .from('games')
        .update({ rematch_offer_from: null })
        .eq('id', gameId);
        
      setRematchOffer(null);
    } catch (err) {
      console.error('Erro ao recusar rematch:', err);
    }
  }, [game, gameId]);

  // Cancelar oferta de rematch
  const cancelRematch = useCallback(async () => {
    if (!game || game.rematch_offer_from !== profile?.id) return;

    try {
      await supabase
        .from('games')
        .update({ rematch_offer_from: null })
        .eq('id', gameId);
        
      setRematchOffer(null);
    } catch (err) {
      console.error('Erro ao cancelar rematch:', err);
    }
  }, [game, profile, gameId]);

  // ========== SISTEMA DE CHAT RÁPIDO ==========
  
  // Enviar mensagem de chat rápido
  const sendChatMessage = useCallback(async (messageKey) => {
    if (!game || !profile) return;
    if (game.status !== 'active' && game.status !== 'completed') return;

    try {
      await supabase
        .from('games')
        .update({ 
          last_chat: {
            sender_id: profile.id,
            message_key: messageKey,
            sent_at: new Date().toISOString()
          }
        })
        .eq('id', gameId);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  }, [game, profile, gameId]);

  // Verificar timeout - com proteção contra race condition
  const timeoutHandledRef = useRef(false);
  
  useEffect(() => {
    if (!game || game.status !== 'active') {
      timeoutHandledRef.current = false;
      return;
    }

    const checkTimeout = async () => {
      // Evitar chamadas duplicadas
      if (timeoutHandledRef.current) return;
      
      const currentTurn = game.current_turn;
      const currentTime = currentTurn === 'white' ? timeLeft.white : timeLeft.black;

      if (currentTime <= 0) {
        timeoutHandledRef.current = true;
        
        const result = currentTurn === 'white' ? '0-1' : '1-0';
        const winnerId = currentTurn === 'white' ? game.black_player_id : game.white_player_id;

        console.log('[checkTimeout] Timeout detectado!', { currentTurn, result, winnerId });

        // Usar .eq('status', 'active') para evitar race condition entre clientes
        const { error, count } = await supabase
          .from('games')
          .update({
            status: 'completed',
            result,
            result_reason: 'timeout',
            winner_id: winnerId,
            ended_at: new Date().toISOString(),
          })
          .eq('id', gameId)
          .eq('status', 'active'); // Só atualiza se ainda está ativo

        // Chamar updateRatings apenas se este cliente atualizou o jogo
        if (!error) {
          console.log('[checkTimeout] Jogo atualizado, chamando updateRatings...');
          await updateRatings(result, 'timeout');
        } else {
          console.log('[checkTimeout] Outro cliente já tratou o timeout ou erro:', error);
        }
      }
    };

    const timeoutCheck = setInterval(checkTimeout, 500);
    return () => clearInterval(timeoutCheck);
  }, [game, timeLeft, gameId, updateRatings]);

  return {
    game,
    chess,
    myColor,
    opponent,
    timeLeft,
    loading,
    error,
    moves,
    drawOffer,
    rematchOffer,
    rematchGameId,
    makeMove,
    resign,
    offerDraw,
    acceptDraw,
    declineDraw,
    cancelDraw,
    offerRematch,
    acceptRematch,
    declineRematch,
    cancelRematch,
    chatMessage,
    sendChatMessage,
    spectatorCount,
    isMyTurn: game?.current_turn === myColor && game?.status === 'active',
    isGameOver: game?.status === 'completed',
  };
}

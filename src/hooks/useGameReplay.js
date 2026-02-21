import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { supabase } from '@/integrations/supabase/client';
import { INITIAL_FEN } from '@/lib/gameHelpers';

export function useGameReplay(gameId) {
  const [game, setGame] = useState(null);
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  
  // Reconstruct positions for each move
  const positions = useMemo(() => {
    const result = [INITIAL_FEN]; // Position before first move
    const chess = new Chess();
    
    for (const move of moves) {
      try {
        chess.move({ from: move.from_square, to: move.to_square, promotion: 'q' });
        result.push(chess.fen());
      } catch {
        // If move fails, use the stored fen_after
        result.push(move.fen_after);
        chess.load(move.fen_after);
      }
    }
    
    return result;
  }, [moves]);

  // Current FEN based on move index
  const currentFen = positions[currentMoveIndex + 1] || INITIAL_FEN;
  
  // Chess instance for current position
  const chess = useMemo(() => {
    const c = new Chess();
    c.load(currentFen);
    return c;
  }, [currentFen]);

  // Current move info (for highlighting)
  const currentMove = currentMoveIndex >= 0 ? moves[currentMoveIndex] : null;
  const lastMoveSquares = currentMove ? [currentMove.from_square, currentMove.to_square] : null;

  // Load game and moves
  useEffect(() => {
    const loadGame = async () => {
      if (!gameId) return;
      
      try {
        setLoading(true);
        
        // Load game data
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select(`
            *,
            white_player:white_player_id(id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical),
            black_player:black_player_id(id, username, display_name, avatar_url, rating_blitz, rating_rapid, rating_classical)
          `)
          .eq('id', gameId)
          .maybeSingle();

        if (gameError) throw gameError;
        if (!gameData) {
          setError('Partida não encontrada');
          return;
        }
        
        setGame(gameData);

        // Load moves
        const { data: movesData, error: movesError } = await supabase
          .from('game_moves')
          .select('*')
          .eq('game_id', gameId)
          .order('move_number', { ascending: true });

        if (movesError) throw movesError;
        setMoves(movesData || []);
        
        // Start at the beginning of the game for move-by-move analysis
        setCurrentMoveIndex(-1);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar partida:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId]);

  // Navigation functions
  const goToStart = useCallback(() => {
    setCurrentMoveIndex(-1);
  }, []);

  const goToEnd = useCallback(() => {
    setCurrentMoveIndex(moves.length - 1);
  }, [moves.length]);

  const goToPrevious = useCallback(() => {
    setCurrentMoveIndex(prev => Math.max(-1, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentMoveIndex(prev => Math.min(moves.length - 1, prev + 1));
  }, [moves.length]);

  const goToMove = useCallback((index) => {
    setCurrentMoveIndex(Math.max(-1, Math.min(moves.length - 1, index)));
  }, [moves.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'ArrowUp':
        case 'Home':
          e.preventDefault();
          goToStart();
          break;
        case 'ArrowDown':
        case 'End':
          e.preventDefault();
          goToEnd();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext, goToStart, goToEnd]);

  return {
    game,
    moves,
    chess,
    currentFen,
    currentMoveIndex,
    lastMoveSquares,
    positions,
    loading,
    error,
    goToStart,
    goToEnd,
    goToPrevious,
    goToNext,
    goToMove,
    totalMoves: moves.length,
  };
}

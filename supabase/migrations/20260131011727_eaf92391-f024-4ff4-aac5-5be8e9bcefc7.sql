-- Adicionar coluna de controle para evitar processamento duplicado
ALTER TABLE games ADD COLUMN IF NOT EXISTS ratings_processed BOOLEAN DEFAULT false;

-- Recriar a função RPC com correções
CREATE OR REPLACE FUNCTION public.update_game_ratings(p_game_id uuid, p_result text, p_result_reason text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_game RECORD;
  v_white_rating INT;
  v_black_rating INT;
  v_white_result DECIMAL;
  v_black_result DECIMAL;
  v_white_new_rating INT;
  v_black_new_rating INT;
  v_rating_column TEXT;
  v_k_factor INT := 32;
BEGIN
  -- Fetch game data
  SELECT * INTO v_game FROM games WHERE id = p_game_id;
  
  IF v_game IS NULL THEN
    RAISE EXCEPTION 'Game not found: %', p_game_id;
  END IF;
  
  -- NOVO: Verificar se já foi processado (idempotência)
  IF v_game.ratings_processed = true THEN
    RETURN; -- Já foi processado, não fazer nada
  END IF;
  
  IF v_game.white_player_id IS NULL OR v_game.black_player_id IS NULL THEN
    RAISE EXCEPTION 'Game players not set';
  END IF;
  
  -- Determine rating column based on time_control
  v_rating_column := CASE 
    WHEN v_game.time_control LIKE 'Bullet%' THEN 'rating_blitz'
    WHEN v_game.time_control LIKE 'Blitz%' THEN 'rating_blitz'
    WHEN v_game.time_control LIKE 'Rapid%' THEN 'rating_rapid'
    WHEN v_game.time_control LIKE 'Classical%' THEN 'rating_classical'
    ELSE 'rating_rapid'
  END;
  
  -- Get current ratings
  EXECUTE format('SELECT COALESCE(%I, 800) FROM profiles WHERE id = $1', v_rating_column)
    INTO v_white_rating USING v_game.white_player_id;
  EXECUTE format('SELECT COALESCE(%I, 800) FROM profiles WHERE id = $1', v_rating_column)
    INTO v_black_rating USING v_game.black_player_id;
  
  -- Calculate results
  IF p_result = '1-0' THEN
    v_white_result := 1; v_black_result := 0;
  ELSIF p_result = '0-1' THEN
    v_white_result := 0; v_black_result := 1;
  ELSE
    v_white_result := 0.5; v_black_result := 0.5;
  END IF;
  
  -- Calculate new ratings (ELO formula)
  v_white_new_rating := v_white_rating + ROUND(v_k_factor * (v_white_result - (1.0 / (1.0 + POWER(10, (v_black_rating - v_white_rating)::DECIMAL / 400)))));
  v_black_new_rating := v_black_rating + ROUND(v_k_factor * (v_black_result - (1.0 / (1.0 + POWER(10, (v_white_rating - v_black_rating)::DECIMAL / 400)))));
  
  -- Update white player profile (CORRIGIDO: usar comparações seguras com > e <)
  EXECUTE format('
    UPDATE profiles SET 
      %I = $1,
      total_games = COALESCE(total_games, 0) + 1,
      wins = CASE WHEN $2 > 0.9 THEN COALESCE(wins, 0) + 1 ELSE COALESCE(wins, 0) END,
      losses = CASE WHEN $2 < 0.1 THEN COALESCE(losses, 0) + 1 ELSE COALESCE(losses, 0) END,
      draws = CASE WHEN $2 > 0.4 AND $2 < 0.6 THEN COALESCE(draws, 0) + 1 ELSE COALESCE(draws, 0) END
    WHERE id = $3
  ', v_rating_column) USING v_white_new_rating, v_white_result, v_game.white_player_id;
  
  -- Update black player profile (CORRIGIDO: usar comparações seguras com > e <)
  EXECUTE format('
    UPDATE profiles SET 
      %I = $1,
      total_games = COALESCE(total_games, 0) + 1,
      wins = CASE WHEN $2 > 0.9 THEN COALESCE(wins, 0) + 1 ELSE COALESCE(wins, 0) END,
      losses = CASE WHEN $2 < 0.1 THEN COALESCE(losses, 0) + 1 ELSE COALESCE(losses, 0) END,
      draws = CASE WHEN $2 > 0.4 AND $2 < 0.6 THEN COALESCE(draws, 0) + 1 ELSE COALESCE(draws, 0) END
    WHERE id = $3
  ', v_rating_column) USING v_black_new_rating, v_black_result, v_game.black_player_id;
  
  -- Record rating history for white player
  INSERT INTO rating_history (user_id, rating_blitz, rating_rapid, rating_classical)
  SELECT id, rating_blitz, rating_rapid, rating_classical FROM profiles WHERE id = v_game.white_player_id;
  
  -- Record rating history for black player
  INSERT INTO rating_history (user_id, rating_blitz, rating_rapid, rating_classical)
  SELECT id, rating_blitz, rating_rapid, rating_classical FROM profiles WHERE id = v_game.black_player_id;
  
  -- Record activity for white player
  INSERT INTO user_activities (user_id, activity_type, description, result, metadata)
  VALUES (
    v_game.white_player_id,
    'game',
    'Partida ' || v_game.time_control || ' online',
    CASE WHEN v_white_result > 0.9 THEN 'win' WHEN v_white_result < 0.1 THEN 'loss' ELSE 'draw' END,
    jsonb_build_object('game_id', p_game_id, 'result', p_result, 'result_reason', p_result_reason)
  );
  
  -- Record activity for black player
  INSERT INTO user_activities (user_id, activity_type, description, result, metadata)
  VALUES (
    v_game.black_player_id,
    'game',
    'Partida ' || v_game.time_control || ' online',
    CASE WHEN v_black_result > 0.9 THEN 'win' WHEN v_black_result < 0.1 THEN 'loss' ELSE 'draw' END,
    jsonb_build_object('game_id', p_game_id, 'result', p_result, 'result_reason', p_result_reason)
  );
  
  -- NOVO: Marcar como processado para evitar duplicação
  UPDATE games SET ratings_processed = true WHERE id = p_game_id;
END;
$function$;
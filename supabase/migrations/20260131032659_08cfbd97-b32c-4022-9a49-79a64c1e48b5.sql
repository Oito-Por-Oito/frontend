-- =====================================================
-- SECURITY FIX 1: Add auth checks to RPC functions
-- =====================================================

-- Fix update_game_ratings: Verify caller is a game participant
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
  v_caller_profile_id UUID;
BEGIN
  -- SECURITY: Verify caller is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- SECURITY: Get caller's profile ID
  SELECT id INTO v_caller_profile_id FROM profiles WHERE user_id = auth.uid();
  IF v_caller_profile_id IS NULL THEN
    RAISE EXCEPTION 'Profile not found for authenticated user';
  END IF;

  -- Fetch game data
  SELECT * INTO v_game FROM games WHERE id = p_game_id;
  
  IF v_game IS NULL THEN
    RAISE EXCEPTION 'Game not found: %', p_game_id;
  END IF;
  
  -- SECURITY: Verify caller is a player in this game
  IF v_caller_profile_id != v_game.white_player_id AND v_caller_profile_id != v_game.black_player_id THEN
    RAISE EXCEPTION 'Not authorized to update ratings for this game';
  END IF;
  
  -- Check if already processed (idempotency)
  IF v_game.ratings_processed = true THEN
    RETURN;
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
  
  -- Update white player profile
  EXECUTE format('
    UPDATE profiles SET 
      %I = $1,
      total_games = COALESCE(total_games, 0) + 1,
      wins = CASE WHEN $2 > 0.9 THEN COALESCE(wins, 0) + 1 ELSE COALESCE(wins, 0) END,
      losses = CASE WHEN $2 < 0.1 THEN COALESCE(losses, 0) + 1 ELSE COALESCE(losses, 0) END,
      draws = CASE WHEN $2 > 0.4 AND $2 < 0.6 THEN COALESCE(draws, 0) + 1 ELSE COALESCE(draws, 0) END
    WHERE id = $3
  ', v_rating_column) USING v_white_new_rating, v_white_result, v_game.white_player_id;
  
  -- Update black player profile
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
  
  -- Mark as processed
  UPDATE games SET ratings_processed = true WHERE id = p_game_id;
END;
$function$;

-- Fix cleanup_stale_matchmaking_entries: Require authentication
CREATE OR REPLACE FUNCTION public.cleanup_stale_matchmaking_entries()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- SECURITY: Verify caller is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  DELETE FROM matchmaking_queue
  WHERE last_heartbeat < NOW() - INTERVAL '2 minutes';
END;
$function$;

-- Fix remove_player_from_matchmaking: Verify caller owns the profile
CREATE OR REPLACE FUNCTION public.remove_player_from_matchmaking(p_player_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_caller_profile_id UUID;
BEGIN
  -- SECURITY: Verify caller is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- SECURITY: Get caller's profile ID
  SELECT id INTO v_caller_profile_id FROM profiles WHERE user_id = auth.uid();
  
  -- SECURITY: Verify caller is removing their own entry
  IF v_caller_profile_id IS NULL OR v_caller_profile_id != p_player_id THEN
    RAISE EXCEPTION 'Not authorized to remove this player from matchmaking';
  END IF;

  DELETE FROM matchmaking_queue
  WHERE player_id = p_player_id;
END;
$function$;

-- =====================================================
-- SECURITY FIX 2: Create public view for profiles (hide user_id)
-- =====================================================

-- Create a public view that excludes sensitive user_id
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT 
  id,
  username,
  display_name,
  avatar_url,
  bio,
  rating_blitz,
  rating_rapid,
  rating_classical,
  total_games,
  wins,
  losses,
  draws,
  accuracy,
  puzzles_solved,
  streak_days,
  last_active_at,
  created_at
FROM profiles;

-- Grant access to the view
GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- Update RLS: Replace the overly permissive policy with owner-only access
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Users can view their own full profile (including user_id)
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (user_id = auth.uid());

-- Players in games can view opponent profiles (for game display)
CREATE POLICY "Game players can view opponent profiles"
  ON profiles
  FOR SELECT
  USING (
    id IN (
      SELECT white_player_id FROM games WHERE black_player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
      UNION
      SELECT black_player_id FROM games WHERE white_player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );
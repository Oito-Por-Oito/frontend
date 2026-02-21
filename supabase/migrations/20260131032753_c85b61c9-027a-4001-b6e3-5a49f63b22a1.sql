-- Fix the SECURITY DEFINER view issue by recreating with SECURITY INVOKER
DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public 
WITH (security_invoker = true)
AS
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
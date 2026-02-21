-- Tabela de partidas
CREATE TABLE public.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  white_player_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  black_player_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'aborted')),
  time_control text NOT NULL DEFAULT 'rapid',
  initial_time integer NOT NULL DEFAULT 600,
  increment integer NOT NULL DEFAULT 0,
  fen text NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  pgn text DEFAULT '',
  current_turn text NOT NULL DEFAULT 'white' CHECK (current_turn IN ('white', 'black')),
  white_time_left integer NOT NULL DEFAULT 600000,
  black_time_left integer NOT NULL DEFAULT 600000,
  result text CHECK (result IN ('1-0', '0-1', '1/2-1/2', NULL)),
  result_reason text,
  winner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  last_move_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabela de lances
CREATE TABLE public.game_moves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  move_number integer NOT NULL,
  player_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  from_square text NOT NULL,
  to_square text NOT NULL,
  san text NOT NULL,
  fen_after text NOT NULL,
  time_left integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabela de fila de matchmaking
CREATE TABLE public.matchmaking_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  time_control text NOT NULL,
  initial_time integer NOT NULL,
  increment integer NOT NULL DEFAULT 0,
  rating integer NOT NULL DEFAULT 800,
  rating_range integer NOT NULL DEFAULT 200,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(player_id)
);

-- Índices para performance
CREATE INDEX idx_games_status ON public.games(status);
CREATE INDEX idx_games_white_player ON public.games(white_player_id);
CREATE INDEX idx_games_black_player ON public.games(black_player_id);
CREATE INDEX idx_game_moves_game_id ON public.game_moves(game_id);
CREATE INDEX idx_matchmaking_queue_time_control ON public.matchmaking_queue(time_control);

-- Habilitar RLS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matchmaking_queue ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para verificar se usuário é jogador
CREATE OR REPLACE FUNCTION public.is_game_player(game_row public.games)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND (profiles.id = game_row.white_player_id OR profiles.id = game_row.black_player_id)
  )
$$;

-- RLS para games
CREATE POLICY "Anyone can view active games" ON public.games
  FOR SELECT USING (status = 'active' OR status = 'completed');

CREATE POLICY "Players can view their own games" ON public.games
  FOR SELECT USING (
    white_player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR black_player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can create games" ON public.games
  FOR INSERT TO authenticated WITH CHECK (
    white_player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR black_player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR white_player_id IS NULL
    OR black_player_id IS NULL
  );

CREATE POLICY "Players can update their games" ON public.games
  FOR UPDATE USING (
    white_player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR black_player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- RLS para game_moves
CREATE POLICY "Anyone can view game moves" ON public.game_moves
  FOR SELECT USING (true);

CREATE POLICY "Players can insert moves" ON public.game_moves
  FOR INSERT TO authenticated WITH CHECK (
    game_id IN (
      SELECT id FROM games WHERE 
        white_player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
        OR black_player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

-- RLS para matchmaking_queue
CREATE POLICY "Anyone can view queue" ON public.matchmaking_queue
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own queue entry" ON public.matchmaking_queue
  FOR INSERT TO authenticated WITH CHECK (
    player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete their own queue entry" ON public.matchmaking_queue
  FOR DELETE USING (
    player_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matchmaking_queue;
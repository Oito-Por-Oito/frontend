-- Adicionar colunas para sistema de rematch na tabela games
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS rematch_offer_from uuid DEFAULT NULL,
ADD COLUMN IF NOT EXISTS rematch_game_id uuid DEFAULT NULL,
ADD COLUMN IF NOT EXISTS original_game_id uuid DEFAULT NULL;

-- Adicionar índice para buscar partidas de rematch
CREATE INDEX IF NOT EXISTS idx_games_original_game_id ON games(original_game_id);
CREATE INDEX IF NOT EXISTS idx_games_rematch_game_id ON games(rematch_game_id);
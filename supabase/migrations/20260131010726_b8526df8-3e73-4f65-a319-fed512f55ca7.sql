-- Adicionar coluna de heartbeat para detectar jogadores offline
ALTER TABLE matchmaking_queue 
ADD COLUMN IF NOT EXISTS last_heartbeat TIMESTAMPTZ DEFAULT now();

-- Criar índice para queries de heartbeat mais rápidas
CREATE INDEX IF NOT EXISTS idx_matchmaking_queue_last_heartbeat 
ON matchmaking_queue (last_heartbeat);

-- Função para limpar entradas órfãs (jogadores que fecharam o navegador)
CREATE OR REPLACE FUNCTION cleanup_stale_matchmaking_entries()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM matchmaking_queue
  WHERE last_heartbeat < NOW() - INTERVAL '2 minutes';
END;
$$;

-- Função para remover jogador específico da fila (chamada pelo sistema de presença)
CREATE OR REPLACE FUNCTION remove_player_from_matchmaking(p_player_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM matchmaking_queue
  WHERE player_id = p_player_id;
END;
$$;
-- Adicionar coluna last_chat para mensagens rápidas durante partidas
ALTER TABLE games 
ADD COLUMN last_chat jsonb DEFAULT NULL;

-- Comentário para documentação
COMMENT ON COLUMN games.last_chat IS 'Última mensagem de chat rápido: {sender_id, message_key, sent_at}';
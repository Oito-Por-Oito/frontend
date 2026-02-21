-- Permitir que usuários atualizem suas próprias entradas de fila (necessário para heartbeat)
CREATE POLICY "Users can update their own queue entry" 
ON matchmaking_queue 
FOR UPDATE 
USING (player_id IN ( SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid() ));

-- Permitir que qualquer usuário autenticado delete entradas órfãs (para cleanup via presence)
-- Isso é seguro porque a função cleanup só remove entradas antigas
CREATE POLICY "Authenticated users can cleanup stale entries"
ON matchmaking_queue
FOR DELETE
USING (
  last_heartbeat < NOW() - INTERVAL '2 minutes'
  AND auth.uid() IS NOT NULL
);
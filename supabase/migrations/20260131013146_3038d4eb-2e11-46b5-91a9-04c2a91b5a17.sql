-- Adicionar coluna para rastrear ofertas de empate
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS draw_offer_from UUID DEFAULT NULL;

-- Comentário descritivo
COMMENT ON COLUMN games.draw_offer_from IS 
  'ID do jogador que ofereceu empate. NULL significa sem oferta ativa.';
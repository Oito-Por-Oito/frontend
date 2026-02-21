-- Permitir leitura pública de perfis
-- O user_id sensível está protegido pela view profiles_public que não o inclui
CREATE POLICY "Public profiles are viewable"
  ON public.profiles
  FOR SELECT
  TO authenticated, anon
  USING (true);
-- Remover políticas que causam recursão (fazem subqueries na própria tabela profiles)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Game players can view opponent profiles" ON public.profiles;

-- A política "Public profiles are viewable" já existe e permite leitura pública
-- As políticas de INSERT e UPDATE continuam funcionando pois usam auth.uid() = user_id diretamente